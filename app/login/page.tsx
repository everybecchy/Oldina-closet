import { Suspense } from "react"
import LoginClient from "./LoginClient"

export const metadata = {
  title: "Login | Ondina Closet",
  description: "Faça login na sua conta Ondina Closet",
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <LoginClient />
    </Suspense>
  )
}
