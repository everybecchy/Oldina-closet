"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, CreditCard, Truck, CheckCircle2 } from 'lucide-react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useStore()
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: '',
  })

  const shippingCost = cartTotal >= 299 ? 0 : 19.90
  const total = cartTotal + shippingCost

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 'cart') {
      setStep('shipping')
    } else if (step === 'shipping') {
      setStep('payment')
    } else if (step === 'payment') {
      // Simulate order processing
      setStep('success')
      clearCart()
    }
  }

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-foreground mb-4">Sua sacola está vazia</h1>
          <p className="text-muted-foreground mb-6">Adicione produtos para continuar</p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/produtos">Explorar Produtos</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-light text-foreground mb-4">
            Pedido <span className="font-medium italic">Confirmado!</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            Obrigada pela sua compra! Você receberá um e-mail com os detalhes do pedido e informações de rastreamento.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Número do pedido: <span className="font-medium text-foreground">#OC{Date.now().toString().slice(-6)}</span>
          </p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/produtos">Continuar Comprando</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 py-8">
        {/* Back link */}
        <Link 
          href="/produtos" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Continuar Comprando
        </Link>

        {/* Progress steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step === 'cart' ? 'border-primary bg-primary text-primary-foreground' : 'border-primary bg-primary text-primary-foreground'
            }`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium text-foreground hidden sm:inline">Revisão</span>
          </div>
          <div className={`w-16 h-0.5 mx-2 ${step !== 'cart' ? 'bg-primary' : 'bg-border'}`} />
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step === 'shipping' || step === 'payment' ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'
            }`}>
              <Truck className="w-5 h-5" />
            </div>
            <span className="ml-2 text-sm font-medium text-foreground hidden sm:inline">Entrega</span>
          </div>
          <div className={`w-16 h-0.5 mx-2 ${step === 'payment' ? 'bg-primary' : 'bg-border'}`} />
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step === 'payment' ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground'
            }`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="ml-2 text-sm font-medium text-foreground hidden sm:inline">Pagamento</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit}>
              {step === 'cart' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-light text-foreground mb-6">
                    Revise sua <span className="font-medium italic">Sacola</span>
                  </h2>
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-card rounded-xl border border-border">
                      <div className="relative h-24 w-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                        <p className="text-primary font-semibold mt-1">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                  <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground mt-6">
                    Continuar para Entrega
                  </Button>
                </div>
              )}

              {step === 'shipping' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-light text-foreground mb-6">
                    Dados de <span className="font-medium italic">Entrega</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep('cart')} className="flex-1 h-12">
                      Voltar
                    </Button>
                    <Button type="submit" className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground">
                      Continuar para Pagamento
                    </Button>
                  </div>
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-light text-foreground mb-6">
                    Dados de <span className="font-medium italic">Pagamento</span>
                  </h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Número do Cartão</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Nome no Cartão</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Validade</Label>
                        <Input
                          id="cardExpiry"
                          name="cardExpiry"
                          placeholder="MM/AA"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCvv">CVV</Label>
                        <Input
                          id="cardCvv"
                          name="cardCvv"
                          placeholder="123"
                          value={formData.cardCvv}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep('shipping')} className="flex-1 h-12">
                      Voltar
                    </Button>
                    <Button type="submit" className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground">
                      Finalizar Pedido
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h3 className="text-lg font-medium text-foreground mb-4">Resumo do Pedido</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({cart.reduce((sum, i) => sum + i.quantity, 0)} itens)</span>
                  <span className="text-foreground">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span className={shippingCost === 0 ? 'text-green-600' : 'text-foreground'}>
                    {shippingCost === 0 ? 'Grátis' : formatPrice(shippingCost)}
                  </span>
                </div>
                {cartTotal < 299 && (
                  <p className="text-xs text-muted-foreground">
                    Falta {formatPrice(299 - cartTotal)} para frete grátis
                  </p>
                )}
              </div>

              <div className="border-t border-border mt-4 pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-medium text-foreground">Total</span>
                  <span className="text-2xl font-semibold text-primary">{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ou 3x de {formatPrice(total / 3)} sem juros
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
