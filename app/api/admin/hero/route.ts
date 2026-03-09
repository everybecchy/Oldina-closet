import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findUnique({
      where: { key: "hero" },
    })

    if (!settings) {
      // Criar configuracoes padrao se nao existir
      settings = await prisma.siteSettings.create({
        data: {
          key: "hero",
          heroTagline: "Colecao Exclusiva",
          heroTitle: "Elegancia que",
          heroTitleAccent: "brilha em voce",
          heroDescription: "Descubra joias exclusivas criadas para mulheres que apreciam a sofisticacao nos detalhes.",
          heroStat1Value: "500+",
          heroStat1Label: "Pecas Exclusivas",
          heroStat2Value: "5k+",
          heroStat2Label: "Clientes Felizes",
          heroStat3Value: "100%",
          heroStat3Label: "Garantia",
        },
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching hero settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch hero settings" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()

    const settings = await prisma.siteSettings.upsert({
      where: { key: "hero" },
      update: {
        heroTagline: data.heroTagline,
        heroTitle: data.heroTitle,
        heroTitleAccent: data.heroTitleAccent,
        heroDescription: data.heroDescription,
        heroImage: data.heroImage,
        heroStat1Value: data.heroStat1Value,
        heroStat1Label: data.heroStat1Label,
        heroStat2Value: data.heroStat2Value,
        heroStat2Label: data.heroStat2Label,
        heroStat3Value: data.heroStat3Value,
        heroStat3Label: data.heroStat3Label,
      },
      create: {
        key: "hero",
        heroTagline: data.heroTagline,
        heroTitle: data.heroTitle,
        heroTitleAccent: data.heroTitleAccent,
        heroDescription: data.heroDescription,
        heroImage: data.heroImage,
        heroStat1Value: data.heroStat1Value,
        heroStat1Label: data.heroStat1Label,
        heroStat2Value: data.heroStat2Value,
        heroStat2Label: data.heroStat2Label,
        heroStat3Value: data.heroStat3Value,
        heroStat3Label: data.heroStat3Label,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating hero settings:", error)
    return NextResponse.json(
      { error: "Failed to update hero settings" },
      { status: 500 }
    )
  }
}
