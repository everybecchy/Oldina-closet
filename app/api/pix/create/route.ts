import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

// Tipos para a resposta da PenguimPay
interface PenguimPayPixResponse {
  id: string
  qr_code: string
  qr_code_base64?: string
  qr_code_url?: string
  pix_key?: string
  status: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      // Dados do cliente
      customerName,
      customerEmail,
      customerPhone,
      // Endereço
      address,
      number,
      complement,
      neighborhood,
      city,
      state,
      zipCode,
      // Itens e valores
      items,
      subtotal,
      shipping,
      discount,
      couponCode,
      shippingMethod,
    } = body

    // Validações básicas
    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: "Dados do cliente são obrigatórios" },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "O carrinho está vazio" },
        { status: 400 }
      )
    }

    // Calcular total
    const total = subtotal + shipping - (discount || 0)

    // PRIMEIRO: Gerar PIX na PenguimPay
    let pixData: PenguimPayPixResponse | null = null
    let pixError: string | null = null

    const penguimPayKey = process.env.PENGUIM_PAY_PUBLIC_KEY

    if (penguimPayKey) {
      try {
        const pixResponse = await fetch("https://api.penguimpay.com/v1/transactions/pix-in", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${penguimPayKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(total * 100), // PenguimPay usa centavos
            externalId: `OC_${Date.now()}`,
            description: `Compra Ondina Closet - ${customerName}`,
            customer: {
              name: customerName,
              email: customerEmail,
              phone: customerPhone.replace(/\D/g, ""),
            },
          }),
        })

        if (pixResponse.ok) {
          pixData = await pixResponse.json()
        } else {
          const errorData = await pixResponse.json().catch(() => ({}))
          console.error("[v0] PenguimPay erro:", errorData)
          pixError = errorData.message || "Erro ao gerar PIX"
        }
      } catch (err) {
        console.error("[v0] Erro ao chamar PenguimPay:", err)
        pixError = "Falha na comunicação com gateway de pagamento"
      }
    }

    // Se a API falhou, usar PIX manual como fallback
    const manualPixKey = process.env.PIX_KEY || "pix@ondinacloset.store"
    
    const qrCode = pixData?.qr_code || manualPixKey
    const qrCodeImage = pixData?.qr_code_base64 || pixData?.qr_code_url || null
    const transactionId = pixData?.id || `manual_${Date.now()}`

    // SEGUNDO: Somente após ter o QR code, criar o pedido no banco
    const orderNumber = `OC${Date.now().toString().slice(-8)}`

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        address: address || "",
        number: number || "",
        complement: complement || "",
        neighborhood: neighborhood || "",
        city: city || "",
        state: state || "",
        zipCode: zipCode || "",
        subtotal,
        shipping,
        discount: discount || 0,
        total,
        couponCode: couponCode || null,
        shippingMethod: shippingMethod || "PAC",
        status: "PENDING",
        items: {
          create: items.map((item: { productId: string; name: string; quantity: number; price: number; image?: string }) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image || "",
          })),
        },
      },
      include: {
        items: true,
      },
    })

    // Criar registro de pagamento
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        transactionId,
        qrCode,
        qrCodeImage,
        pixKey: pixData?.pix_key || manualPixKey,
        amount: order.total,
        status: "PENDING",
      },
    })

    // Enviar email de confirmação com PIX (não bloqueia a resposta)
    if (customerEmail) {
      sendEmail({
        to: customerEmail,
        name: customerName,
        subject: `Pedido ${orderNumber} - Aguardando pagamento PIX`,
        templateType: "payment-pix",
        data: {
          orderNumber,
          amount: total.toFixed(2),
          qrCode,
          pixKey: pixData?.pix_key || manualPixKey,
          items: order.items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price.toString(),
          })),
        },
      }).catch((err) => console.error("[v0] Erro ao enviar email:", err))
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
      },
      payment: {
        id: payment.id,
        transactionId: payment.transactionId,
        qrCode: payment.qrCode,
        qrCodeImage: payment.qrCodeImage,
        pixKey: payment.pixKey,
        amount: payment.amount.toString(),
      },
      ...(pixError && { warning: pixError }),
    })
  } catch (error) {
    console.error("[v0] Erro ao criar PIX:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
