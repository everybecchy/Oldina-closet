"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import useSWR from "swr"
import { useAuth } from "@/lib/auth-context"
import { useStore } from "@/lib/store-context"
import { Header } from "@/components/store/header"
import { Footer } from "@/components/store/footer"
import { CartDrawer } from "@/components/store/cart-drawer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Heart, ShoppingBag, Trash2, Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Product {
  id: string
  name: string
  slug: string
  price: string
  comparePrice?: string
  images: string[]
  category?: { name: string }
}

interface Favorite {
  id: string
  productId: string
  product?: Product
  createdAt: string
}

export default function FavoritosPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { addToCart } = useStore()
  
  const { data, error, isLoading, mutate } = useSWR<{ favorites: Favorite[] }>(
    isAuthenticated ? "/api/favorites" : null,
    fetcher
  )

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })
      mutate()
    } catch (error) {
      console.error("Erro ao remover favorito:", error)
    }
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images[0] || "",
      quantity: 1,
    })
  }

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(typeof price === "string" ? parseFloat(price) : price)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const favorites = data?.favorites || []

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Meus Favoritos</h1>
              <p className="text-muted-foreground">Produtos que você salvou para ver depois</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-destructive">Erro ao carregar favoritos</p>
              </CardContent>
            </Card>
          ) : favorites.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Heart className="h-8 w-8 text-muted-foreground" />
                </div>
                <h2 className="text-lg font-medium text-foreground mb-2">
                  Nenhum favorito encontrado
                </h2>
                <p className="text-muted-foreground mb-6">
                  Comece a favoritar produtos clicando no coração
                </p>
                <Button asChild>
                  <Link href="/produtos">Explorar Produtos</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favorites.map((favorite) => {
                const product = favorite.product
                if (!product) return null

                return (
                  <Card key={favorite.id} className="group overflow-hidden">
                    <div className="relative aspect-square">
                      <Link href={`/produtos/${product.slug}`}>
                        <Image
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </Link>
                      <button
                        onClick={() => handleRemoveFavorite(product.id)}
                        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm hover:bg-destructive hover:text-white transition-colors"
                        title="Remover dos favoritos"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <CardContent className="p-4">
                      {product.category && (
                        <p className="text-xs text-muted-foreground mb-1">
                          {product.category.name}
                        </p>
                      )}
                      <Link href={`/produtos/${product.slug}`}>
                        <h3 className="font-medium text-foreground line-clamp-2 mb-2 hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-semibold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        {product.comparePrice && parseFloat(product.comparePrice) > parseFloat(product.price) && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.comparePrice)}
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="w-full"
                        size="sm"
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Adicionar
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
