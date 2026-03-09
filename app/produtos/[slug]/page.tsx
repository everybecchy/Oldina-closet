"use client"

import { use, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Heart, Minus, Plus, ShoppingBag, Truck, Shield, RefreshCw } from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/store/product-card'

// Demo product data
const products: Record<string, {
  id: string
  name: string
  price: number
  comparePrice?: number
  images: string[]
  description: string
  details: string[]
  category: string
}> = {
  'anel-serena-dourado': {
    id: '1',
    name: 'Anel Serena Dourado',
    price: 189.90,
    comparePrice: 249.90,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
      'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=800&q=80',
      'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80',
    ],
    description: 'O Anel Serena é uma peça delicada e sofisticada, perfeita para o dia a dia ou ocasiões especiais. Seu design elegante combina com qualquer estilo.',
    details: ['Banho de ouro 18k', 'Pedra de zircônia', 'Ajustável', 'Antialérgico'],
    category: 'Anéis'
  },
  'colar-perolas-delicadas': {
    id: '2',
    name: 'Colar Pérolas Delicadas',
    price: 299.90,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    ],
    description: 'Um colar clássico com pérolas delicadas que adiciona um toque de elegância a qualquer look. Perfeito para noivas ou eventos formais.',
    details: ['Pérolas de água doce', 'Fecho banhado a ouro', 'Comprimento: 45cm', 'Antialérgico'],
    category: 'Colares'
  },
  'brinco-gota-cristal': {
    id: '3',
    name: 'Brinco Gota Cristal',
    price: 159.90,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80',
    ],
    description: 'Brincos em formato de gota com cristais que capturam a luz de forma deslumbrante. Ideais para eventos especiais.',
    details: ['Cristais austríacos', 'Base em prata 925', 'Fecho borboleta', 'Tamanho: 3cm'],
    category: 'Brincos'
  },
  'pulseira-elos-finos': {
    id: '4',
    name: 'Pulseira Elos Finos',
    price: 219.90,
    comparePrice: 279.90,
    images: [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',
    ],
    description: 'Uma pulseira delicada com elos finos que adiciona sofisticação ao seu pulso. Perfeita para usar sozinha ou combinada.',
    details: ['Banho de ouro 18k', 'Comprimento: 18cm', 'Fecho lagosta', 'Antialérgico'],
    category: 'Pulseiras'
  },
}

const relatedProducts = [
  {
    id: '5',
    name: 'Anel Solitário Elegance',
    price: 349.90,
    image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=600&q=80',
    slug: 'anel-solitario-elegance',
    category: 'Anéis'
  },
  {
    id: '6',
    name: 'Brinco Argola Clássica',
    price: 129.90,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80',
    slug: 'brinco-argola-classica',
    category: 'Brincos'
  },
  {
    id: '7',
    name: 'Colar Corrente Veneziana',
    price: 259.90,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    slug: 'colar-corrente-veneziana',
    category: 'Colares'
  },
  {
    id: '8',
    name: 'Pulseira Riviera',
    price: 399.90,
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80',
    slug: 'pulseira-riviera',
    category: 'Pulseiras'
  },
]

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const product = products[slug]
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const { addToCart } = useStore()

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-foreground mb-4">Produto não encontrado</h1>
          <Button asChild>
            <Link href="/produtos">Voltar para produtos</Link>
          </Button>
        </div>
      </div>
    )
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0]
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link 
            href="/produtos" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para produtos
          </Link>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-4 right-4 bg-card/80 backdrop-blur-sm ${
                  isLiked ? 'text-red-500' : 'text-foreground/70'
                }`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
            </div>
            
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-6">
            <div>
              <p 
                className="text-sm uppercase tracking-[0.2em] text-primary mb-2"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {product.category}
              </p>
              <h1 className="text-3xl lg:text-4xl font-light text-foreground">
                {product.name}
              </h1>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Details */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide" style={{ fontFamily: 'var(--font-montserrat)' }}>
                Detalhes
              </h3>
              <ul className="space-y-1">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Add to cart */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Quantidade:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                className="w-full h-14 text-base bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Adicionar à Sacola
              </Button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Frete Grátis</p>
                <p className="text-xs text-muted-foreground">acima de R$299</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Garantia</p>
                <p className="text-xs text-muted-foreground">de 1 ano</p>
              </div>
              <div className="text-center">
                <RefreshCw className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Troca Fácil</p>
                <p className="text-xs text-muted-foreground">em 30 dias</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        <section className="mt-20">
          <h2 className="text-2xl font-light text-foreground mb-8">
            Você também pode <span className="font-medium italic">gostar</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
