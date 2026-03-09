import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth"
import { sendEmail } from "@/lib/email"

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
        const pixStatus = (statusData.data?.status || statusData.status || "").toUpperCase()
        
        console.log("[v0] PenguimPay status response:", JSON.stringify(statusData))
        console.log("[v0] pixStatus normalized:", pixStatus)

        // Mapear status da API para nosso formato
        // PenguimPay retorna: waiting, PENDING, APPROVED, PAID, EXPIRED, FAILED, REFUNDED
        const newStatus = (pixStatus === "APPROVED" || pixStatus === "PAID") ? "PAID" : 
                          pixStatus === "EXPIRED" ? "EXPIRED" : 
                          pixStatus === "FAILED" ? "FAILED" : 
                          pixStatus === "REFUNDED" ? "REFUNDED" : "PENDING"
        
        console.log("[v0] Mapped newStatus:", newStatus, "Current payment.status:", payment.status)

        // Atualizar status no banco se mudou
        if (newStatus !== payment.status) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { 
              status: newStatus,
              paidAt: newStatus === "PAID" ? new Date() : null,
            },
          })

          // Se foi pago, atualizar status do pedido e enviar email
          if (newStatus === "PAID") {
            const updatedOrder = await prisma.order.update({
              where: { id: payment.orderId },
              data: { status: "CONFIRMED" },
              include: { items: { include: { product: true } } },
            })

            // Enviar email de confirmação
            try {
              await sendEmail({
                to: updatedOrder.customerEmail,
                subject: `Pagamento Confirmado - Pedido #${updatedOrder.orderNumber}`,
                templateType: "payment-status",
                data: {
                  orderNumber: updatedOrder.orderNumber,
                  status: "CONFIRMADO",
                  amount: updatedOrder.total.toString(),
                  items: updatedOrder.items.map((item) => ({
                    name: item.product?.name || "Produto",
                    quantity: item.quantity,
                    price: Number(item.price).toFixed(2),
                  })),
                },
              })
            } catch (emailError) {
              console.error("[v0] Erro ao enviar email de confirmação:", emailError)
            }
          }
        }

        return NextResponse.json({
          success: true,
          status: newStatus === "PAID" ? "paid" : newStatus.toLowerCase(),
          amount: statusData.data?.amount || payment.amount.toString(),
          transactionId: statusData.data?.transaction_id || payment.transactionId,
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
