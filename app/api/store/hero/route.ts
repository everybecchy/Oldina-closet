import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { key: "hero" },
    })

    if (!settings) {
      // Retornar configuracoes padrao
      return NextResponse.json({
        heroTagline: "Colecao Exclusiva",
        heroTitle: "Elegancia que",
        heroTitleAccent: "brilha em voce",
        heroDescription: "Descubra joias exclusivas criadas para mulheres que apreciam a sofisticacao nos detalhes.",
        heroImage: null,
        heroStat1Value: "500+",
        heroStat1Label: "Pecas Exclusivas",
        heroStat2Value: "5k+",
        heroStat2Label: "Clientes Felizes",
        heroStat3Value: "100%",
        heroStat3Label: "Garantia",
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching hero settings:", error)
    // Retornar configuracoes padrao em caso de erro
    return NextResponse.json({
      heroTagline: "Colecao Exclusiva",
      heroTitle: "Elegancia que",
      heroTitleAccent: "brilha em voce",
      heroDescription: "Descubra joias exclusivas criadas para mulheres que apreciam a sofisticacao nos detalhes.",
      heroImage: null,
      heroStat1Value: "500+",
      heroStat1Label: "Pecas Exclusivas",
      heroStat2Value: "5k+",
      heroStat2Label: "Clientes Felizes",
      heroStat3Value: "100%",
      heroStat3Label: "Garantia",
    })
  }
}
