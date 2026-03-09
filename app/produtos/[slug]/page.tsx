"use client"

import { use, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { ChevronLeft, Heart, Minus, Plus, ShoppingBag, Truck, Shield, RefreshCw } from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/store/product-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  comparePrice: number | null
  images: string[]
  image: string
  category: string
  categorySlug: string
  stock: number
  featured: boolean
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isLiked, setIsLiked] = useState(false)
  const { addToCart } = useStore()

  // Buscar produto do banco
  const { data: productData, isLoading: loadingProduct } = useSWR<{ success: boolean; product: Product }>(
    `/api/store/products?slug=${slug}`,
    fetcher
  )

  // Buscar produtos relacionados (mesma categoria)
  const { data: relatedData, isLoading: loadingRelated } = useSWR<{ success: boolean; products: Product[] }>(
    productData?.product?.categorySlug 
      ? `/api/store/products?category=${productData.product.categorySlug}` 
      : null,
    fetcher
  )

  const product = productData?.product
  const relatedProducts = relatedData?.products?.filter(p => p.id !== product?.id).slice(0, 4) || []

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const handleAddToCart = () => {
    if (!product) return
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || product.image
      })
    }
  }

  // Loading state
  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
          <Skeleton className="h-6 w-40 mb-8" />
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Product not found
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

  const productImages = product.images.length > 0 ? product.images : [product.image]

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
                src={productImages[selectedImage]}
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
            
            {productImages.length > 1 && (
              <div className="flex gap-3">
                {productImages.map((img, idx) => (
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

            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Stock info */}
            {product.stock > 0 ? (
              <p className="text-sm text-green-600">
                Em estoque ({product.stock} disponíveis)
              </p>
            ) : (
              <p className="text-sm text-red-600">
                Produto esgotado
              </p>
            )}

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
                    disabled={product.stock === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={product.stock === 0 || quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                className="w-full h-14 text-base bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={product.stock === 0}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {product.stock === 0 ? 'Produto Esgotado' : 'Adicionar à Sacola'}
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
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl font-light text-foreground mb-8">
              Você também pode <span className="font-medium italic">gostar</span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {loadingRelated ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              ) : (
                relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} {...relatedProduct} />
                ))
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
