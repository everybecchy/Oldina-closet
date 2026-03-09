import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get("transactionId")

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID é obrigatório" },
        { status: 400 }
      )
    }

    // Buscar pagamento
    const payment = await prisma.payment.findFirst({
      where: { transactionId },
      include: { order: true },
    })

    if (!payment) {
      return NextResponse.json(
        { error: "Pagamento não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se o usuário tem permissão (se logado e o pedido tem userId)
    const user = await getSessionUser()
    if (payment.order.userId && user && payment.order.userId !== user.id && !user.isAdmin) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 403 }
      )
    }

    // Se for PIX manual, retornar status local
    if (transactionId.startsWith("manual_")) {
      return NextResponse.json({
        success: true,
        status: payment.status.toLowerCase(),
        amount: payment.amount.toString(),
        transactionId: payment.transactionId,
      })
    }

    // Consultar status na PenguimPay
    try {
      const statusResponse = await fetch(
        `https://api.penguimpay.com/api/external/pix/deposit/${transactionId}`,
        {
          headers: {
            "Authorization": `Bearer ${process.env.PENGUIM_PAY_PUBLIC_KEY}`,
          },
        }
      )

      if (statusResponse.ok) {
        const statusData = await statusResponse.json()

        // Mapear status da API para nosso formato
        const newStatus = statusData.status === "paid" ? "PAID" : 
                          statusData.status === "cancelled" ? "CANCELLED" : 
                          statusData.status === "failed" ? "FAILED" : "PENDING"

        // Atualizar status no banco se mudou
        if (newStatus !== payment.status) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { 
              status: newStatus,
              paidAt: newStatus === "PAID" ? new Date() : null,
            },
          })

          // Se foi pago, atualizar status do pedido
          if (newStatus === "PAID") {
            await prisma.order.update({
              where: { id: payment.orderId },
              data: { status: "CONFIRMED" },
            })
          }
        }

        return NextResponse.json({
          success: true,
          status: statusData.status || payment.status.toLowerCase(),
          amount: statusData.amount || payment.amount.toString(),
          transactionId: statusData.id || payment.transactionId,
        })
      }
    } catch (apiError) {
      console.error("[v0] Erro ao consultar PenguimPay:", apiError)
    }

    // Retornar status local se a API falhar
    return NextResponse.json({
      success: true,
      status: payment.status.toLowerCase(),
      amount: payment.amount.toString(),
      transactionId: payment.transactionId,
    })
  } catch (error) {
    console.error("[v0] Erro ao consultar status PIX:", error)
    return NextResponse.json(
      { error: "Erro ao consultar status" },
      { status: 500 }
    )
  }
}
