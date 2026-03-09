"use client"

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import useSWR from 'swr'
import { Skeleton } from '@/components/ui/skeleton'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  productCount: number
}

export function CategorySection() {
  const { data, isLoading } = useSWR<{ success: boolean; categories: Category[] }>(
    '/api/store/categories'
  )

  const categories = data?.categories || []

  // Se não há categorias e não está carregando, não mostrar a seção
  if (!isLoading && categories.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p 
            className="text-sm uppercase tracking-[0.3em] text-primary mb-3"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            Explore
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground">
            Nossas <span className="font-medium italic">Categorias</span>
          </h2>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl overflow-hidden">
                <Skeleton className="w-full h-full" />
              </div>
            ))
          ) : (
            categories.map((category) => (
              <Link 
                key={category.slug}
                href={`/produtos?categoria=${category.slug}`}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden"
              >
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-lg">{category.name}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                  <h3 className="text-lg lg:text-xl font-medium text-white mb-1">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-white/80 hidden lg:block">
                      {category.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-2 text-white/90 text-sm group-hover:text-white transition-colors">
                    <span className="hidden lg:inline">Ver mais</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
