'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ActivatePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleActivate = async () => {
    if (!token) {
      setStatus('error')
      setMessage('Token manquant dans l’URL.')
      return
    }

    if (!newPassword) {
      setStatus('error')
      setMessage('Veuillez entrer un nouveau mot de passe.')
      return
    }

    try {
      setStatus('loading')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/etudiants/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage('✅ Votre compte a été activé avec succès !')
        setTimeout(() => router.push('/login'), 3000) // redirige vers login
      } else {
        setStatus('error')
        setMessage('❌ Erreur : ' + (data.error || 'Impossible d’activer le compte.'))
      }
    } catch (err: any) {
      setStatus('error')
      setMessage('❌ Erreur réseau : ' + err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Activation du compte</h1>
      <p className="mb-4">
        Entrez un nouveau mot de passe pour activer votre compte formateur.
      </p>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleActivate}
        disabled={status === 'loading'}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {status === 'loading' ? 'Activation en cours...' : 'Activer mon compte'}
      </button>
      {message && (
        <p className={`mt-4 ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
