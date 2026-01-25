/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getDataSource } from '@/src/lib/db'
import { Travail } from '@/src/entities/Travail'
import { Assignation } from '@/src/entities/Assignation'

const JWT_SECRET = process.env.JWT_SECRET!


async function getUserFromToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) throw new Error('Unauthorized')
  const token = authHeader.split(' ')[1]
  return jwt.verify(token, JWT_SECRET) as any
}

// ✅ GET /api/v1/travaux/list-by-formateur
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req)
    if (user.role !== 'FORMATEUR') {
      return NextResponse.json(
        { success: false, error: 'FORBIDDEN' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const espaceId = searchParams.get('espaceId')

    const db = await getDataSource()
    const travailRepo = db.getRepository(Travail)

    // Construire la requête
    const queryBuilder = travailRepo
      .createQueryBuilder('travail')
      .leftJoinAndSelect('travail.espacePedagogique', 'espace')
      .leftJoinAndSelect('travail.formateur', 'formateur')
      .where('formateur.id = :formateurId', { formateurId: user.id })

    // Filtrer par espace si spécifié
    if (espaceId) {
      queryBuilder.andWhere('espace.id = :espaceId', { espaceId })
    }

    queryBuilder.orderBy('travail.dateLimite', 'DESC')

    const travaux = await queryBuilder.getMany()

    // Pour chaque travail, récupérer les statistiques d'assignation
    const travauxWithStats = await Promise.all(
      travaux.map(async (travail) => {
        const assignationRepo = db.getRepository(Assignation)
        const assignations = await assignationRepo
          .createQueryBuilder('assignation')
          .leftJoinAndSelect('assignation.etudiant', 'etudiant')
          .leftJoinAndSelect('etudiant.user', 'user')
          .where('assignation.travail = :travailId', { travailId: travail.id })
          .getMany()

        const stats = {
          total: assignations.length,
          assigne: assignations.filter(a => a.statut === 'ASSIGNE').length,
          livre: assignations.filter(a => a.statut === 'LIVRE').length,
          evalue: assignations.filter(a => a.statut === 'EVALUE').length
        }

        return {
          id: travail.id,
          titre: travail.titre,
          type: travail.type,
          bareme: travail.bareme,
          dateLimite: travail.dateLimite,
          statut: travail.statut,
          espacePedagogique: {
            id: travail.espacePedagogique.id,
          },
          stats,
          createdAt: travail.createdAt
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: travauxWithStats
    })
  } catch (err: any) {
    console.error('GET TRAVAUX BY FORMATEUR ERROR:', err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    )
  }
}
