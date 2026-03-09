"use client"

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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

export function FeaturedSection() {
  const { data, isLoading } = useSWR<{ success: boolean; products: Product[] }>(
    '/api/store/products?featured=true'
  )

  const featuredProducts = data?.products || []

  // Se não há produtos em destaque e não está carregando, não mostrar a seção
  if (!isLoading && featuredProducts.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p 
              className="text-sm uppercase tracking-[0.3em] text-primary mb-3"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              Destaques
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground">
              Peças <span className="font-medium italic">Selecionadas</span>
            </h2>
          </div>
          <Button asChild variant="outline" className="border-primary/30 text-foreground hover:bg-primary/5">
            <Link href="/produtos">
              Ver Todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          ) : (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}
