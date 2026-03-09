"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"

export default function ConfirmarEmailClient() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get("token")
        
        if (!token) {
          setStatus("error")
          setMessage("Token inválido. Por favor, verifique o link do email.")
          return
        }

        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (!response.ok) {
          setStatus("error")
          setMessage(data.error || "Erro ao confirmar email")
          return
        }

        setStatus("success")
        setMessage("Email confirmado com sucesso!")
        
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          window.location.href = "/login"
        }, 3000)
      } catch (error) {
        setStatus("error")
        setMessage(error instanceof Error ? error.message : "Erro ao confirmar email")
      }
    }

    verifyEmail()
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Melhoria%20de%20logo%20joias%20Mar%209%202026-ha7CbnbZUj0zu4PFpWOJxAVosSqWnD.png"
              alt="Ondina Closet"
              width={200}
              height={80}
              className="h-20 w-auto"
            />
          </Link>
        </div>

        {status === "loading" && (
          <div>
            <h1 className="text-2xl font-serif mb-4 text-foreground">Confirmando seu email...</h1>
            <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}

        {status === "success" && (
          <div>
            <div className="text-5xl mb-4">✓</div>
            <h1 className="text-2xl font-serif mb-4 text-foreground">Email confirmado!</h1>
            <p className="text-muted-foreground mb-8">Você será redirecionado para fazer login...</p>
            <Link href="/login" className="text-primary hover:underline font-medium">
              Clique aqui para fazer login agora
            </Link>
          </div>
        )}

        {status === "error" && (
          <div>
            <div className="text-5xl mb-4">✗</div>
            <h1 className="text-2xl font-serif mb-4 text-foreground">Erro ao confirmar email</h1>
            <p className="text-muted-foreground mb-8">{message}</p>
            <Link href="/login" className="text-primary hover:underline font-medium">
              Voltar para login
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
