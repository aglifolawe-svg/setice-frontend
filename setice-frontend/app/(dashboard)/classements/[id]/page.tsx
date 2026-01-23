'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Trophy,
  Medal,
  User,
  TrendingUp,
  Download,
} from 'lucide-react'
import { api } from '@/lib/api'
import { type Promotion, type Etudiant } from '@/types/index'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'

interface ClassementEntry {
  rang: number
  etudiant: Etudiant
  moyenne: number
  totalPoints: number
  totalBareme: number
  nombreEvaluations: number
}

interface ClassementData {
  promotion: Promotion
  classement: ClassementEntry[]
}

const getMedalColor = (rank: number) => {
  switch (rank) {
    case 1:
      return 'text-yellow-500'
    case 2:
      return 'text-gray-400'
    case 3:
      return 'text-amber-600'
    default:
      return 'text-muted-foreground'
  }
}

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 2:
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 3:
      return 'bg-amber-100 text-amber-800 border-amber-200'
    default:
      return ''
  }
}

export default function ClassementDetailPage() {
  const params = useParams()
  const router = useRouter()
  
  const [classementData, setClassementData] = useState<ClassementData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const promotionId = params.id as string

  useEffect(() => {
    const fetchClassement = async () => {
      try {
        // ✅ CORRECTION: Utiliser getClassementPromotion au lieu de getClassement
        const response = await api.getClassementPromotion(promotionId)
        
        if (response.success && response.data) {
          setClassementData(response.data)
        } else {
          toast.error('Erreur lors du chargement du classement')
          router.push('/directeur/classements')
        }
      } catch (error) {
        console.error('Error fetching classement:', error)
        toast.error('Erreur lors du chargement du classement')
        router.push('/directeur/classements')
      } finally {
        setIsLoading(false)
      }
    }

    if (promotionId) {
      fetchClassement()
    }
  }, [promotionId, router])

  const handleExportCSV = () => {
    if (!classementData) return

    const headers = ['Rang', 'Nom', 'Prenom', 'Matricule', 'Moyenne', 'Points', 'Bareme', 'Evaluations']
    const rows = classementData.classement.map((entry) => [
      entry.rang,
      entry.etudiant?.user?.nom || '',
      entry.etudiant?.user?.prenom || '',
      entry.etudiant?.matricule || '',
      entry.moyenne.toFixed(2),
      entry.totalPoints.toFixed(1),
      entry.totalBareme,
      entry.nombreEvaluations,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `classement_${classementData.promotion.libelle}_${new Date().toISOString().split('T')[0]}.csv`
    )
    link.click()
    URL.revokeObjectURL(url)
    toast.success('Export CSV téléchargé')
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!classementData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Classement non trouvé</p>
      </div>
    )
  }

  const { promotion, classement } = classementData

  // Stats
  const moyennePromo =
    classement.length > 0
      ? classement.reduce((acc, e) => acc + e.moyenne, 0) / classement.length
      : 0
  const maxMoyenne = classement.length > 0 ? Math.max(...classement.map((e) => e.moyenne)) : 0
  const minMoyenne = classement.length > 0 ? Math.min(...classement.map((e) => e.moyenne)) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="mt-1">
            <Link href="/directeur/classements">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
              <Trophy className="h-6 w-6 text-primary" />
              Classement - {promotion.libelle}
            </h1>
            <p className="mt-1 text-base text-muted-foreground">Année {promotion.annee}</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Étudiants classés
            </CardTitle>
            <User className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classement.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Moyenne promotion
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moyennePromo.toFixed(2)}/20</div>
            <Progress value={(moyennePromo / 20) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Meilleure moyenne
            </CardTitle>
            <Medal className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {maxMoyenne.toFixed(2)}/20
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Plus faible moyenne
            </CardTitle>
            <TrendingUp className="h-4 w-4 rotate-180 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {minMoyenne.toFixed(2)}/20
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Podium for top 3 */}
      {classement.length >= 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Podium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-center gap-4">
              {/* 2nd place */}
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <Medal className="h-8 w-8 text-gray-400" />
                </div>
                <div className="mt-2 h-20 w-24 rounded-t-lg bg-gray-200 flex flex-col items-center justify-center">
                  <p className="font-bold text-gray-700">2</p>
                </div>
                <p className="mt-2 text-center text-sm font-medium">
                  {classement[1]?.etudiant?.user?.prenom}{' '}
                  {classement[1]?.etudiant?.user?.nom}
                </p>
                <p className="text-sm text-muted-foreground">
                  {classement[1]?.moyenne.toFixed(2)}/20
                </p>
              </div>

              {/* 1st place */}
              <div className="flex flex-col items-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100">
                  <Trophy className="h-10 w-10 text-yellow-500" />
                </div>
                <div className="mt-2 h-28 w-28 rounded-t-lg bg-yellow-200 flex flex-col items-center justify-center">
                  <p className="font-bold text-yellow-700 text-xl">1</p>
                </div>
                <p className="mt-2 text-center text-sm font-medium">
                  {classement[0]?.etudiant?.user?.prenom}{' '}
                  {classement[0]?.etudiant?.user?.nom}
                </p>
                <p className="text-sm font-bold text-primary">
                  {classement[0]?.moyenne.toFixed(2)}/20
                </p>
              </div>

              {/* 3rd place */}
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <Medal className="h-8 w-8 text-amber-600" />
                </div>
                <div className="mt-2 h-16 w-24 rounded-t-lg bg-amber-200 flex flex-col items-center justify-center">
                  <p className="font-bold text-amber-700">3</p>
                </div>
                <p className="mt-2 text-center text-sm font-medium">
                  {classement[2]?.etudiant?.user?.prenom}{' '}
                  {classement[2]?.etudiant?.user?.nom}
                </p>
                <p className="text-sm text-muted-foreground">
                  {classement[2]?.moyenne.toFixed(2)}/20
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full ranking table */}
      <Card>
        <CardHeader>
          <CardTitle>Classement complet</CardTitle>
          <CardDescription>
            Classement basé sur la moyenne générale de chaque étudiant
          </CardDescription>
        </CardHeader>
        <CardContent>
          {classement.length === 0 ? (
            <div className="py-12 text-center">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                Aucun étudiant évalué dans cette promotion
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rang</TableHead>
                    <TableHead>Étudiant</TableHead>
                    <TableHead>Matricule</TableHead>
                    <TableHead className="text-center">Moyenne</TableHead>
                    <TableHead className="text-center">Points</TableHead>
                    <TableHead className="text-center">Évaluations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classement.map((entry) => (
                    <TableRow
                      key={entry.etudiant?.id}
                      className={entry.rang <= 3 ? 'bg-muted/30' : ''}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {entry.rang <= 3 ? (
                            <Medal className={`h-5 w-5 ${getMedalColor(entry.rang)}`} />
                          ) : (
                            <span className="w-5 text-center text-muted-foreground">
                              {entry.rang}
                            </span>
                          )}
                          {entry.rang <= 3 && (
                            <Badge
                              variant="outline"
                              className={getRankBadge(entry.rang)}
                            >
                              {entry.rang}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {entry.etudiant?.user?.prenom} {entry.etudiant?.user?.nom}
                      </TableCell>
                      <TableCell>{entry.etudiant?.matricule}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`font-bold ${
                            entry.moyenne >= 10
                              ? 'text-green-600'
                              : 'text-orange-600'
                          }`}
                        >
                          {entry.moyenne.toFixed(2)}
                        </span>
                        <span className="text-muted-foreground">/20</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {entry.totalPoints.toFixed(1)}/{entry.totalBareme}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{entry.nombreEvaluations}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}