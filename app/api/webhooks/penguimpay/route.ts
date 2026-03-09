import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { transactionId, status } = body

    if (!transactionId || !status) {
      return NextResponse.json(
        { error: "transactionId e status são obrigatórios" },
        { status: 400 }
      )
    }

    // Buscar pagamento
    const payment = await prisma.payment.findUnique({
      where: { transactionId },
      include: {
        order: {
          include: { items: true },
        },
      },
    })

    if (!payment) {
      console.log("[v0] Webhook: Pagamento não encontrado:", transactionId)
      return NextResponse.json({ success: true })
    }

    // Atualizar status do pagamento
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { status, updatedAt: new Date() },
    })

    // Atualizar status do pedido baseado no pagamento
    let orderStatus = payment.order.status
    if (status === "APPROVED") {
      orderStatus = "CONFIRMED"
    } else if (status === "FAILED" || status === "EXPIRED") {
      orderStatus = "CANCELLED"
    }

    await prisma.order.update({
      where: { id: payment.order.id },
      data: { status: orderStatus },
    })

    // Enviar email de atualização para o cliente
    const statusMessages: Record<string, string> = {
      PENDING: "Aguardando confirmação do pagamento",
      APPROVED: "Pagamento confirmado! Seu pedido foi confirmado.",
      FAILED: "Falha no pagamento. Por favor, tente novamente.",
      EXPIRED: "O PIX expirou. Gere um novo código de pagamento.",
      REFUNDED: "Reembolso processado com sucesso.",
    }

    if (payment.order.customerEmail) {
      await sendEmail({
        to: payment.order.customerEmail,
        name: payment.order.customerName,
        subject: `Atualização de Pagamento - Pedido ${payment.order.orderNumber}`,
        templateType: "payment-status",
        data: {
          orderNumber: payment.order.orderNumber,
          status: statusMessages[status] || "Status atualizado",
          amount: payment.amount.toString(),
          items: payment.order.items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price.toString(),
          })),
        },
      })
    }

    console.log(`[v0] Webhook: Pagamento ${transactionId} atualizado para ${status}`)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro no webhook PenguimPay:", error)
    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    )
  }
}
