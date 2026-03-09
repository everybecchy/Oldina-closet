"use client"

import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import useSWR from 'swr'
import { ProductCard } from './product-card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  image: string
  category: string
  categorySlug: string
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function RecentProductsSection() {
  const { data, isLoading } = useSWR<{ success: boolean; products: Product[] }>(
    '/api/store/products?limit=12&sort=recent',
    fetcher
  )
  
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const recentProducts = data?.products || []

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScrollButtons()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScrollButtons)
      return () => container.removeEventListener('scroll', checkScrollButtons)
    }
  }, [recentProducts])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Se nao ha produtos e nao esta carregando, nao mostrar a secao
  if (!isLoading && recentProducts.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <p 
              className="text-sm uppercase tracking-[0.3em] text-primary mb-3"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              Novidades
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground">
              Chegaram <span className="font-medium italic">Agora</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Navigation buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="h-10 w-10 rounded-full border-primary/30 text-foreground hover:bg-primary/5 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="h-10 w-10 rounded-full border-primary/30 text-foreground hover:bg-primary/5 disabled:opacity-50"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <Button asChild variant="outline" className="border-primary/30 text-foreground hover:bg-primary/5">
              <Link href="/produtos">
                Ver Todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Products carousel */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 lg:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 lg:-mx-0 lg:px-0 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[260px] md:w-[280px] space-y-3 snap-start">
                  <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : (
              recentProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-[260px] md:w-[280px] snap-start">
                  <ProductCard {...product} />
                </div>
              ))
            )}
          </div>

          {/* Mobile navigation dots */}
          {!isLoading && recentProducts.length > 2 && (
            <div className="flex md:hidden justify-center gap-2 mt-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className="text-primary disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className="text-primary disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
