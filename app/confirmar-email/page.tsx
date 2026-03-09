import { Suspense } from "react"
import ConfirmarEmailClient from "./ConfirmarEmailClient"

export const metadata = {
  title: "Confirmar Email | Ondina Closet",
  description: "Confirmando seu email",
}

export default function ConfirmarEmailPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <ConfirmarEmailClient />
    </Suspense>
  )
}

function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-serif mb-4">Confirmando email...</h1>
        <div className="animate-spin inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    </div>
  )
}
