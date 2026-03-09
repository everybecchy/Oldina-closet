import { NextResponse } from "next/server"

interface FreteOption {
  service: string
  serviceName: string
  price: number
  deliveryDays: number
}

// CEP de origem (loja) - Salvador, BA
const CEP_ORIGEM = "40010000"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cepDestino = searchParams.get("cep")
  const peso = searchParams.get("peso") || "0.3" // kg
  const valor = searchParams.get("valor") || "100" // valor declarado

  if (!cepDestino) {
    return NextResponse.json(
      { error: "CEP de destino é obrigatório" },
      { status: 400 }
    )
  }

  const cleanCep = cepDestino.replace(/\D/g, "")

  if (cleanCep.length !== 8) {
    return NextResponse.json(
      { error: "CEP deve ter 8 dígitos" },
      { status: 400 }
    )
  }

  try {
    // Usando CepCerto para cálculo de frete dos Correios
    // Formato: altura x largura x comprimento em cm
    const altura = 5
    const largura = 15
    const comprimento = 20
    const pesoKg = parseFloat(peso)

    // Calcula PAC e SEDEX usando API do CepCerto
    const services = ["04510", "04014"] // PAC e SEDEX
    const freteOptions: FreteOption[] = []

    for (const serviceCode of services) {
      try {
        const url = `https://www.cepcerto.com/ws/json-frete/${CEP_ORIGEM}/${cleanCep}/${pesoKg}/${valor}/${altura}/${largura}/${comprimento}/${serviceCode}`
        
        const response = await fetch(url)
        
        if (response.ok) {
          const data = await response.json()
          
          if (data && data.valor && !data.erro) {
            freteOptions.push({
              service: serviceCode,
              serviceName: serviceCode === "04510" ? "PAC" : "SEDEX",
              price: parseFloat(data.valor.replace(",", ".")),
              deliveryDays: parseInt(data.prazo) || (serviceCode === "04510" ? 10 : 5),
            })
          }
        }
      } catch {
        // Continua para o próximo serviço
      }
    }

    // Se nenhuma opção foi encontrada, usa valores estimados
    if (freteOptions.length === 0) {
      // Calcula frete estimado baseado na distância (simplificado)
      const basePrice = 15
      const pricePerKg = 5
      const estimatedPac = basePrice + (pesoKg * pricePerKg)
      const estimatedSedex = estimatedPac * 1.8

      freteOptions.push(
        {
          service: "04510",
          serviceName: "PAC",
          price: Math.round(estimatedPac * 100) / 100,
          deliveryDays: 10,
        },
        {
          service: "04014",
          serviceName: "SEDEX",
          price: Math.round(estimatedSedex * 100) / 100,
          deliveryDays: 5,
        }
      )
    }

    // Adiciona opção de retirada na loja
    freteOptions.unshift({
      service: "retirada",
      serviceName: "Retirada na Loja",
      price: 0,
      deliveryDays: 0,
    })

    return NextResponse.json({
      options: freteOptions,
    })
  } catch (error) {
    console.error("Erro ao calcular frete:", error)
    
    // Retorna valores padrão em caso de erro
    return NextResponse.json({
      options: [
        {
          service: "retirada",
          serviceName: "Retirada na Loja",
          price: 0,
          deliveryDays: 0,
        },
        {
          service: "04510",
          serviceName: "PAC",
          price: 18.90,
          deliveryDays: 10,
        },
        {
          service: "04014",
          serviceName: "SEDEX",
          price: 32.90,
          deliveryDays: 5,
        },
      ],
    })
  }
}
