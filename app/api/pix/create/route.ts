import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

// Tipos para a resposta da PenguimPay
interface PenguimPayPixResponse {
  success: boolean
  data: {
    transaction_id: string
    external_id: string
    amount: number
    amount_net: number
    amount_fee: number
    status: string
    qr_code: string
    qr_code_base64: string | null
    qr_code_image: string | null
    expires_at: string
    created_at: string
    provider: string
  }
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
        // Limpar CPF do telefone e formatar documento
        const cleanPhone = customerPhone.replace(/\D/g, "")
        
        const pixResponse = await fetch("https://api.penguimpay.com/api/external/pix/deposit", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${penguimPayKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: total, // PenguimPay usa valor em reais (não centavos)
            client: {
              name: customerName,
              document: "000.000.000-00", // Documento genérico pois não coletamos CPF
              email: customerEmail,
            },
          }),
        })

        const responseData = await pixResponse.json()
        
        if (pixResponse.ok && responseData.success) {
          pixData = responseData
        } else {
          console.error("[v0] PenguimPay erro:", responseData)
          pixError = responseData.message || "Erro ao gerar PIX"
        }
      } catch (err) {
        console.error("[v0] Erro ao chamar PenguimPay:", err)
        pixError = "Falha na comunicação com gateway de pagamento"
      }
    }

    // Se a API falhou, usar PIX manual como fallback
    const manualPixKey = process.env.PIX_KEY || "pix@ondinacloset.store"
    
    const qrCode = pixData?.data?.qr_code || manualPixKey
    const qrCodeImage = pixData?.data?.qr_code_base64 || pixData?.data?.qr_code_image || null
    const transactionId = pixData?.data?.transaction_id || `manual_${Date.now()}`
    const expiresAt = pixData?.data?.expires_at || null

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
            quantity: item.quantity,
            price: item.price,
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

    // Buscar os items com os nomes dos produtos
    const orderWithProducts = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    // Gerar URL do QR code usando API externa
    const qrCodeImageUrl = qrCode.length > 50 
      ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCode)}`
      : null

    // Enviar email de confirmação com PIX (não bloqueia a resposta)
    if (customerEmail && orderWithProducts) {
      sendEmail({
        to: customerEmail,
        name: customerName,
        subject: `Pedido ${orderNumber} - Aguardando pagamento PIX`,
        templateType: "payment-pix",
        data: {
          orderNumber,
          amount: total.toFixed(2),
          qrCode: qrCodeImageUrl || "",
          pixKey: qrCode,
          items: orderWithProducts.items.map((item) => ({
            name: item.product?.name || "Produto",
            quantity: item.quantity,
            price: Number(item.price).toFixed(2),
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
        expiresAt: expiresAt,
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
