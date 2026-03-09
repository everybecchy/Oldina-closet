import { Suspense } from "react"
import CadastroClient from "./CadastroClient"

export const metadata = {
  title: "Cadastro | Ondina Closet",
  description: "Crie sua conta na Ondina Closet",
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <CadastroClient />
    </Suspense>
  )
}
