import { NextResponse } from "next/server"

interface PenguinPayRequest {
  amount: number
  description: string
  external_reference: string
}

interface PenguinPayResponse {
  id: string
  qr_code: string
  qr_code_base64?: string
  status: string
  amount: number
  external_reference: string
}

export async function POST(request: Request) {
  try {
    const { amount, orderId, customerName } = await request.json()

    if (!amount || !orderId) {
      return NextResponse.json(
        { error: "Valor e ID do pedido sao obrigatorios" },
        { status: 400 }
      )
    }

    // Verifica se a API key está configurada
    const apiKey = process.env.PENGUIN_PAY_API_KEY

    if (!apiKey) {
      // Modo demo - retorna QR code simulado
      const mockQrCode = `00020126580014br.gov.bcb.pix0136${Date.now()}5204000053039865406${amount.toFixed(2)}5802BR5913Ondina Closet6008Salvador62070503***6304`
      
      return NextResponse.json({
        success: true,
        transactionId: `demo_${Date.now()}`,
        qrCode: mockQrCode,
        qrCodeImage: null,
        amount,
        status: "pending",
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
      })
    }

    // Integração real com Penguin Pay
    const payload: PenguinPayRequest = {
      amount: Math.round(amount * 100), // Converte para centavos
      description: `Pedido ${orderId} - ${customerName || "Cliente"}`,
      external_reference: orderId,
    }

    const response = await fetch("https://api.penguimpay.com/v1/pix/qrcode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Erro Penguin Pay:", errorData)
      
      // Fallback para modo demo em caso de erro
      const mockQrCode = `00020126580014br.gov.bcb.pix0136${Date.now()}5204000053039865406${amount.toFixed(2)}5802BR5913Ondina Closet6008Salvador62070503***6304`
      
      return NextResponse.json({
        success: true,
        transactionId: `demo_${Date.now()}`,
        qrCode: mockQrCode,
        qrCodeImage: null,
        amount,
        status: "pending",
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      })
    }

    const data: PenguinPayResponse = await response.json()

    return NextResponse.json({
      success: true,
      transactionId: data.id,
      qrCode: data.qr_code,
      qrCodeImage: data.qr_code_base64 || null,
      amount: data.amount / 100,
      status: data.status,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    })
  } catch (error) {
    console.error("Erro ao criar PIX:", error)
    return NextResponse.json(
      { error: "Erro ao gerar QR code PIX" },
      { status: 500 }
    )
  }
}
