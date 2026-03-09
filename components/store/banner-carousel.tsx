"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useSWR from 'swr'

interface Banner {
  id: string
  title: string
  subtitle: string | null
  image: string
  link: string | null
  active: boolean
  order: number
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function BannerCarousel() {
  const { data: banners } = useSWR<Banner[]>('/api/admin/banners', fetcher)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const activeBanners = banners?.filter(b => b.active) || []
  
  useEffect(() => {
    if (activeBanners.length <= 1) return
    
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length)
    }, 5000)
    
    return () => clearInterval(timer)
  }, [activeBanners.length])

  const goToPrev = () => {
    setCurrentIndex(prev => prev === 0 ? activeBanners.length - 1 : prev - 1)
  }

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeBanners.length)
  }

  // Se não há banners, mostrar o hero padrão
  if (!activeBanners.length) {
    return (
      <section className="relative min-h-[60vh] flex items-center justify-center" style={{ backgroundColor: '#FDF2F4' }}>
        <div className="text-center space-y-6 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight">
            Elegância que
            <span className="block font-medium italic text-primary"> brilha em você</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Descubra joias exclusivas criadas para mulheres que apreciam a sofisticação nos detalhes.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/produtos">Explorar Coleção</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden bg-muted">
      {/* Slides */}
      <div className="relative w-full h-full">
        {activeBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={banner.image.startsWith('http') ? banner.image : banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />
            </div>
            
            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="mx-auto max-w-7xl px-4 lg:px-8 w-full">
                <div className="max-w-xl space-y-4">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight text-balance">
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p className="text-lg md:text-xl text-white/90">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.link && (
                    <Button asChild size="lg" className="mt-4 bg-primary hover:bg-primary/90">
                      <Link href={banner.link}>Ver Mais</Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {activeBanners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white h-12 w-12 rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white h-12 w-12 rounded-full"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots indicator */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white w-8' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
