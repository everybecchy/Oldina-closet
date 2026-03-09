"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'

export function CartDrawer() {
  const router = useRouter()
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useStore()
  const { isAuthenticated } = useAuth()

  if (!isCartOpen) return null

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" 
        onClick={() => setIsCartOpen(false)} 
      />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Sacola</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <p className="text-lg text-muted-foreground">Sua sacola está vazia</p>
              <p className="text-sm text-muted-foreground mt-1">Adicione peças para continuar</p>
              <Button 
                onClick={() => setIsCartOpen(false)} 
                className="mt-6 bg-primary hover:bg-primary/90"
                asChild
              >
                <Link href="/produtos">Explorar Coleção</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-border last:border-0">
                  <div className="relative h-24 w-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                    <p className="text-primary font-semibold mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-border px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-xl font-semibold text-foreground">{formatPrice(cartTotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Frete calculado no checkout</p>
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base"
              onClick={() => {
                setIsCartOpen(false)
                if (isAuthenticated) {
                  router.push('/checkout')
                } else {
                  router.push('/login?redirect=/checkout')
                }
              }}
            >
              Finalizar Compra
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 text-base" 
              onClick={() => setIsCartOpen(false)}
            >
              Continuar Comprando
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
