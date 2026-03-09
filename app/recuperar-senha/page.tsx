import { Suspense } from "react"
import RecuperarSenhaClient from "./RecuperarSenhaClient"

export const metadata = {
  title: "Recuperar Senha | Ondina Closet",
  description: "Redefina sua senha",
}

function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-serif mb-4">Carregando...</h1>
        <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    </div>
  )
}

export default function RecuperarSenhaPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <RecuperarSenhaClient />
    </Suspense>
  )
}

