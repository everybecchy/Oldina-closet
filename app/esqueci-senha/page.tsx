"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Loader2, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar")
      }

      setSubmitted(true)
    } catch (error) {
      console.error("[v0] Erro:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
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

        <Card className="border-gold/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif text-foreground">Recuperar Senha</CardTitle>
            <CardDescription>
              Insira seu email para receber um link de recuperação
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center space-y-4">
                <Mail className="w-16 h-16 mx-auto text-primary opacity-75" />
                <h2 className="text-lg font-serif text-foreground">Verifique seu email</h2>
                <p className="text-muted-foreground text-sm">
                  Enviamos um link para recuperar sua senha. Verifique sua caixa de entrada (e spam).
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar link de recuperação"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Link href="/login" className="text-center text-sm text-muted-foreground hover:text-foreground">
              Voltar para login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
