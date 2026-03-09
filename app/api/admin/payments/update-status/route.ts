import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth"
import { sendEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: "Apenas admins podem atualizar status de pagamento" },
        { status: 403 }
      )
    }

    const { paymentId, status } = await request.json()

    if (!paymentId || !status) {
      return NextResponse.json(
        { error: "paymentId e status são obrigatórios" },
        { status: 400 }
      )
    }

    // Buscar pagamento
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          include: { items: true },
        },
      },
    })

    if (!payment) {
      return NextResponse.json(
        { error: "Pagamento não encontrado" },
        { status: 404 }
      )
    }

    // Atualizar status do pagamento
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status, updatedAt: new Date() },
    })

    // Atualizar status do pedido baseado no pagamento
    let orderStatus = payment.order.status
    if (status === "APPROVED") {
      orderStatus = "CONFIRMED"
    } else if (status === "FAILED" || status === "EXPIRED" || status === "REFUNDED") {
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
      try {
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
      } catch (emailError) {
        console.error("[v0] Erro ao enviar email de atualização:", emailError)
      }
    }

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
    })
  } catch (error) {
    console.error("[v0] Erro ao atualizar status de pagamento:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
