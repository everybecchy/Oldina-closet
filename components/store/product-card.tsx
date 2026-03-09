"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  id: string
  name: string
  price: number
  comparePrice?: number
  image: string
  slug: string
  category?: string
}

export function ProductCard({ id, name, price, comparePrice, image, slug, category }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { addToCart } = useStore()

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ id, name, price, image })
  }

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/produtos/${slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Discount badge */}
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}

          {/* Wishlist button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 bg-card/80 backdrop-blur-sm hover:bg-card transition-all ${
              isLiked ? 'text-red-500' : 'text-foreground/70'
            }`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsLiked(!isLiked)
            }}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </Button>

          {/* Quick add button */}
          <div 
            className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button 
              onClick={handleAddToCart}
              className="w-full bg-card/95 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-1">
          {category && (
            <p className="text-xs text-muted-foreground uppercase tracking-wide" style={{ fontFamily: 'var(--font-montserrat)' }}>
              {category}
            </p>
          )}
          <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-primary">{formatPrice(price)}</span>
            {comparePrice && (
              <span className="text-sm text-muted-foreground line-through">{formatPrice(comparePrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
