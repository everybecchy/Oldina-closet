import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const user = await getSessionUser()
    if (!user) {
      return NextResponse.json(
        { error: "Não autenticado" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const transactionId = searchParams.get("transactionId")

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID é obrigatório" },
        { status: 400 }
      )
    }

    // Buscar pagamento
    const payment = await prisma.payment.findUnique({
      where: { transactionId },
      include: { order: true },
    })

    if (!payment) {
      return NextResponse.json(
        { error: "Pagamento não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se o usuário tem permissão
    if (payment.order.userId !== user.id && !user.isAdmin) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 403 }
      )
    }

    // Consultar status na PenguimPay
    const statusResponse = await fetch(
      `https://api.penguimpay.com/api/external/pix/deposit/${transactionId}`,
      {
        headers: {
          "Authorization": `Bearer ${process.env.PENGUIM_PAY_PUBLIC_KEY}`,
        },
      }
    )

    if (!statusResponse.ok) {
      console.error("[v0] Erro ao consultar PIX:", statusResponse.status)
      
      // Retornar status local se a API falhar
      return NextResponse.json({
        success: true,
        status: payment.status,
        amount: payment.amount.toString(),
        transactionId: payment.transactionId,
      })
    }

    const statusData = await statusResponse.json()

    // Atualizar status no banco se mudou
    if (statusData.status !== payment.status) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: statusData.status },
      })
    }

    return NextResponse.json({
      success: true,
      status: statusData.status,
      amount: statusData.amount || payment.amount.toString(),
      transactionId: statusData.id,
    })
  } catch (error) {
    console.error("[v0] Erro ao consultar status PIX:", error)
    return NextResponse.json(
      { error: "Erro ao consultar status" },
      { status: 500 }
    )
  }
}
