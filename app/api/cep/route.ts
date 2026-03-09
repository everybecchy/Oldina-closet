import { NextResponse } from "next/server"

interface BrasilApiCepResponse {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  service: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cep = searchParams.get("cep")

  if (!cep) {
    return NextResponse.json(
      { error: "CEP é obrigatório" },
      { status: 400 }
    )
  }

  // Remove caracteres não numéricos
  const cleanCep = cep.replace(/\D/g, "")

  if (cleanCep.length !== 8) {
    return NextResponse.json(
      { error: "CEP deve ter 8 dígitos" },
      { status: 400 }
    )
  }

  try {
    // Usando BrasilAPI
    const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`)
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "CEP não encontrado" },
        { status: 404 }
      )
    }

    const data: BrasilApiCepResponse = await response.json()

    return NextResponse.json({
      cep: data.cep,
      street: data.street,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
    })
  } catch (error) {
    console.error("Erro ao buscar CEP:", error)
    return NextResponse.json(
      { error: "Erro ao buscar CEP" },
      { status: 500 }
    )
  }
}
