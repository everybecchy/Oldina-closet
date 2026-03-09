import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/auth"
import { sendEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID é obrigatório" },
        { status: 400 }
      )
    }

    // Buscar pedido
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      )
    }

    // Verificar se usuário tem permissão (se logado)
    const user = await getSessionUser()
    if (order.userId && user && order.userId !== user.id && !user.isAdmin) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 403 }
      )
    }

    // Verificar se já existe um pagamento para este pedido
    const existingPayment = await prisma.payment.findUnique({
      where: { orderId: order.id },
    })

    if (existingPayment) {
      // Retornar dados do pagamento existente
      return NextResponse.json({
        success: true,
        payment: {
          id: existingPayment.id,
          qrCode: existingPayment.qrCode,
          qrCodeImage: existingPayment.qrCodeImage,
          pixKey: existingPayment.pixKey,
          amount: existingPayment.amount.toString(),
          transactionId: existingPayment.transactionId,
        },
      })
    }

    // Criar PIX na PenguimPay
    const pixResponse = await fetch("https://api.penguimpay.com/api/external/pix/deposit", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PENGUIM_PAY_PUBLIC_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Number(order.total),
        description: `Pedido ${order.orderNumber} - Ondina Closet`,
        orderId: order.id,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
      }),
    })

    if (!pixResponse.ok) {
      const error = await pixResponse.json().catch(() => ({}))
      console.error("[v0] Erro PenguimPay:", error)
      
      // Se a API de pagamento falhar, criar PIX manual (fallback)
      const manualPixKey = process.env.PIX_KEY || "pix@ondinacloset.com"
      const payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          transactionId: `manual_${Date.now()}`,
          qrCode: manualPixKey,
          qrCodeImage: null,
          pixKey: manualPixKey,
          amount: order.total,
          status: "PENDING",
        },
      })

      return NextResponse.json({
        success: true,
        payment: {
          id: payment.id,
          qrCode: payment.qrCode,
          qrCodeImage: payment.qrCodeImage,
          pixKey: payment.pixKey,
          amount: payment.amount.toString(),
          transactionId: payment.transactionId,
        },
      })
    }

    const pixData = await pixResponse.json()

    // Salvar transação no banco
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        transactionId: pixData.id,
        qrCode: pixData.qr_code,
        qrCodeImage: pixData.qr_code_base64 || pixData.qr_code_url,
        pixKey: pixData.pix_key || "",
        amount: order.total,
        status: "PENDING",
      },
    })

    // Enviar email de confirmação com PIX
    if (order.customerEmail) {
      try {
        await sendEmail({
          to: order.customerEmail,
          name: order.customerName,
          subject: "Seu PIX para pagamento - Ondina Closet",
          templateType: "payment-pix",
          data: {
            orderNumber: order.orderNumber,
            amount: order.total.toString(),
            qrCode: pixData.qr_code,
            pixKey: pixData.pix_key || "",
            items: order.items.map((item: any) => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price.toString(),
            })),
          },
        })
      } catch (emailError) {
        console.error("[v0] Erro ao enviar email de PIX:", emailError)
      }
    }

    return NextResponse.json({
      success: true,
      payment: {
        id: payment.id,
        qrCode: payment.qrCode,
        qrCodeImage: payment.qrCodeImage,
        pixKey: payment.pixKey,
        amount: payment.amount.toString(),
        transactionId: payment.transactionId,
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao criar PIX:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
