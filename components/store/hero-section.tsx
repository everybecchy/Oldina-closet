"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface HeroSettings {
  heroTagline: string
  heroTitle: string
  heroTitleAccent: string
  heroDescription: string
  heroImage: string | null
  heroStat1Value: string
  heroStat1Label: string
  heroStat2Value: string
  heroStat2Label: string
  heroStat3Value: string
  heroStat3Label: string
}

const defaultSettings: HeroSettings = {
  heroTagline: 'Colecao Exclusiva',
  heroTitle: 'Elegancia que',
  heroTitleAccent: 'brilha em voce',
  heroDescription: 'Descubra joias exclusivas criadas para mulheres que apreciam a sofisticacao nos detalhes.',
  heroImage: null,
  heroStat1Value: '500+',
  heroStat1Label: 'Pecas Exclusivas',
  heroStat2Value: '5k+',
  heroStat2Label: 'Clientes Felizes',
  heroStat3Value: '100%',
  heroStat3Label: 'Garantia',
}

export function HeroSection() {
  const [settings, setSettings] = useState<HeroSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/store/hero')
      .then(res => res.json())
      .then(data => {
        setSettings({
          heroTagline: data.heroTagline || defaultSettings.heroTagline,
          heroTitle: data.heroTitle || defaultSettings.heroTitle,
          heroTitleAccent: data.heroTitleAccent || defaultSettings.heroTitleAccent,
          heroDescription: data.heroDescription || defaultSettings.heroDescription,
          heroImage: data.heroImage || null,
          heroStat1Value: data.heroStat1Value || defaultSettings.heroStat1Value,
          heroStat1Label: data.heroStat1Label || defaultSettings.heroStat1Label,
          heroStat2Value: data.heroStat2Value || defaultSettings.heroStat2Value,
          heroStat2Label: data.heroStat2Label || defaultSettings.heroStat2Label,
          heroStat3Value: data.heroStat3Value || defaultSettings.heroStat3Value,
          heroStat3Label: data.heroStat3Label || defaultSettings.heroStat3Label,
        })
      })
      .catch(() => setSettings(defaultSettings))
      .finally(() => setIsLoading(false))
  }, [])

  const heroImageUrl = settings.heroImage || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
  const hasStats = settings.heroStat1Value || settings.heroStat2Value || settings.heroStat3Value

  return (
    <section className="relative min-h-[60vh] flex items-center bg-background">
      
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-32 mx-auto lg:mx-0" />
                  <Skeleton className="h-12 w-64 mx-auto lg:mx-0" />
                  <Skeleton className="h-12 w-48 mx-auto lg:mx-0" />
                  <Skeleton className="h-20 w-full max-w-md mx-auto lg:mx-0" />
                </>
              ) : (
                <>
                  <p 
                    className="text-sm uppercase tracking-[0.3em] text-primary"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  >
                    {settings.heroTagline}
                  </p>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight text-balance">
                    {settings.heroTitle}
                    <span className="block font-medium italic text-primary"> {settings.heroTitleAccent}</span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed">
                    {settings.heroDescription}
                  </p>
                </>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12"
              >
                <Link href="/produtos">
                  Explorar Colecao
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="lg"
                className="border-primary/30 text-foreground hover:bg-primary/5 px-8 h-12"
              >
                <Link href="/produtos?categoria=novidades">
                  Novidades
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            {hasStats && (
              <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
                {settings.heroStat1Value && (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-primary">{settings.heroStat1Value}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide" style={{ fontFamily: 'var(--font-montserrat)' }}>{settings.heroStat1Label}</p>
                    </div>
                    {(settings.heroStat2Value || settings.heroStat3Value) && <div className="w-px h-10 bg-border" />}
                  </>
                )}
                {settings.heroStat2Value && (
                  <>
                    <div className="text-center">
                      <p className="text-2xl font-semibold text-primary">{settings.heroStat2Value}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide" style={{ fontFamily: 'var(--font-montserrat)' }}>{settings.heroStat2Label}</p>
                    </div>
                    {settings.heroStat3Value && <div className="w-px h-10 bg-border" />}
                  </>
                )}
                {settings.heroStat3Value && (
                  <div className="text-center">
                    <p className="text-2xl font-semibold text-primary">{settings.heroStat3Value}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide" style={{ fontFamily: 'var(--font-montserrat)' }}>{settings.heroStat3Label}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={heroImageUrl}
                alt="Joias elegantes"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
