import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const transactionId = searchParams.get("transactionId")

  if (!transactionId) {
    return NextResponse.json(
      { error: "ID da transacao e obrigatorio" },
      { status: 400 }
    )
  }

  // Verifica se a API key está configurada
  const apiKey = process.env.PENGUIN_PAY_API_KEY

  // Modo demo - simula verificação de pagamento
  if (!apiKey || transactionId.startsWith("demo_")) {
    // Simula um pagamento confirmado após alguns segundos (para demonstração)
    // Em produção, isso seria verificado via webhook ou polling real
    return NextResponse.json({
      transactionId,
      status: "pending", // Em demo, sempre retorna pending
      paidAt: null,
    })
  }

  try {
    // Integração real com Penguin Pay
    const response = await fetch(
      `https://api.penguimpay.com/v1/pix/${transactionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json({
        transactionId,
        status: "pending",
        paidAt: null,
      })
    }

    const data = await response.json()

    return NextResponse.json({
      transactionId: data.id,
      status: data.status === "paid" ? "paid" : "pending",
      paidAt: data.paid_at || null,
    })
  } catch (error) {
    console.error("Erro ao verificar status PIX:", error)
    return NextResponse.json({
      transactionId,
      status: "pending",
      paidAt: null,
    })
  }
}
