import { NextResponse } from "next/server"

// Cupons de demonstração (em produção, viria do banco de dados)
const coupons = [
  {
    code: "BEMVINDA10",
    discountType: "percentage",
    discountValue: 10,
    minPurchase: 100,
    maxUses: 100,
    usedCount: 45,
    active: true,
    expiresAt: new Date("2026-12-31"),
  },
  {
    code: "FRETEGRATIS",
    discountType: "fixed",
    discountValue: 25,
    minPurchase: 200,
    maxUses: null,
    usedCount: 120,
    active: true,
    expiresAt: null,
  },
  {
    code: "VERAO20",
    discountType: "percentage",
    discountValue: 20,
    minPurchase: 150,
    maxUses: 50,
    usedCount: 50,
    active: false,
    expiresAt: new Date("2026-03-01"),
  },
]

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json()

    if (!code) {
      return NextResponse.json(
        { error: "Codigo do cupom e obrigatorio" },
        { status: 400 }
      )
    }

    const coupon = coupons.find(
      (c) => c.code.toUpperCase() === code.toUpperCase()
    )

    if (!coupon) {
      return NextResponse.json(
        { error: "Cupom nao encontrado" },
        { status: 404 }
      )
    }

    if (!coupon.active) {
      return NextResponse.json(
        { error: "Este cupom esta inativo" },
        { status: 400 }
      )
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json(
        { error: "Este cupom expirou" },
        { status: 400 }
      )
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json(
        { error: "Este cupom atingiu o limite de usos" },
        { status: 400 }
      )
    }

    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return NextResponse.json(
        {
          error: `Compra minima de R$ ${coupon.minPurchase.toFixed(2)} para usar este cupom`,
        },
        { status: 400 }
      )
    }

    // Calcula o desconto
    let discount = 0
    if (coupon.discountType === "percentage") {
      discount = (subtotal * coupon.discountValue) / 100
    } else {
      discount = coupon.discountValue
    }

    // Garante que o desconto não seja maior que o subtotal
    discount = Math.min(discount, subtotal)

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount: Math.round(discount * 100) / 100,
      message:
        coupon.discountType === "percentage"
          ? `${coupon.discountValue}% de desconto aplicado!`
          : `R$ ${coupon.discountValue.toFixed(2)} de desconto aplicado!`,
    })
  } catch (error) {
    console.error("Erro ao validar cupom:", error)
    return NextResponse.json(
      { error: "Erro ao validar cupom" },
      { status: 500 }
    )
  }
}
