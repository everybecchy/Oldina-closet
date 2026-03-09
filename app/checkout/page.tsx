"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ChevronLeft, 
  Truck, 
  CheckCircle2, 
  Loader2, 
  Copy, 
  Check,
  Tag,
  X,
  QrCode
} from "lucide-react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FreteOption {
  service: string
  serviceName: string
  price: number
  deliveryDays: number
}

interface CepData {
  cep: string
  street: string
  neighborhood: string
  city: string
  state: string
}

interface CouponData {
  code: string
  discountType: string
  discountValue: number
  discount: number
}

type CheckoutStep = "cart" | "shipping" | "payment" | "success"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useStore()
  const [step, setStep] = useState<CheckoutStep>("cart")
  const [isLoading, setIsLoading] = useState(false)
  const [orderNumber, setOrderNumber] = useState("")
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cep: "",
    address: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  })
  
  // Shipping
  const [freteOptions, setFreteOptions] = useState<FreteOption[]>([])
  const [selectedFrete, setSelectedFrete] = useState<FreteOption | null>(null)
  const [loadingCep, setLoadingCep] = useState(false)
  const [loadingFrete, setLoadingFrete] = useState(false)
  const [cepError, setCepError] = useState("")
  
  // Coupon
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null)
  const [couponError, setCouponError] = useState("")
  const [loadingCoupon, setLoadingCoupon] = useState(false)
  
  // PIX
  const [pixData, setPixData] = useState<{
    qrCode: string
    transactionId: string
    expiresAt: string
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const [checkingPayment, setCheckingPayment] = useState(false)

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 5) return numbers
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    if (name === "cep") {
      setFormData((prev) => ({ ...prev, [name]: formatCep(value) }))
    } else if (name === "phone") {
      setFormData((prev) => ({ ...prev, [name]: formatPhone(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Buscar CEP
  const fetchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "")
    if (cleanCep.length !== 8) return

    setLoadingCep(true)
    setCepError("")

    try {
      const response = await fetch(`/api/cep?cep=${cleanCep}`)
      const data = await response.json()

      if (!response.ok) {
        setCepError(data.error || "CEP nao encontrado")
        return
      }

      setFormData((prev) => ({
        ...prev,
        address: data.street || "",
        neighborhood: data.neighborhood || "",
        city: data.city || "",
        state: data.state || "",
      }))

      // Buscar frete
      fetchFrete(cleanCep)
    } catch {
      setCepError("Erro ao buscar CEP")
    } finally {
      setLoadingCep(false)
    }
  }

  // Buscar opções de frete
  const fetchFrete = async (cep: string) => {
    setLoadingFrete(true)

    try {
      const response = await fetch(`/api/frete?cep=${cep}`)
      const data = await response.json()

      if (data.options) {
        setFreteOptions(data.options)
        // Seleciona a primeira opção com frete
        const firstPaidOption = data.options.find((o: FreteOption) => o.price > 0)
        setSelectedFrete(firstPaidOption || data.options[0])
      }
    } catch {
      // Usa opções padrão em caso de erro
      setFreteOptions([
        { service: "retirada", serviceName: "Retirada na Loja", price: 0, deliveryDays: 0 },
        { service: "04510", serviceName: "PAC", price: 18.90, deliveryDays: 10 },
        { service: "04014", serviceName: "SEDEX", price: 32.90, deliveryDays: 5 },
      ])
    } finally {
      setLoadingFrete(false)
    }
  }

  // Aplicar cupom
  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    setLoadingCoupon(true)
    setCouponError("")

    try {
      const response = await fetch("/api/cupom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal: cartTotal }),
      })

      const data = await response.json()

      if (!response.ok) {
        setCouponError(data.error)
        return
      }

      setAppliedCoupon(data)
    } catch {
      setCouponError("Erro ao validar cupom")
    } finally {
      setLoadingCoupon(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    setCouponError("")
  }

  // Calcular totais
  const shippingCost = selectedFrete?.price || 0
  const discount = appliedCoupon?.discount || 0
  const total = cartTotal + shippingCost - discount

  // Criar pagamento PIX
  const createPixPayment = async () => {
    setIsLoading(true)

    try {
      const newOrderNumber = `OC${Date.now().toString().slice(-6)}`
      setOrderNumber(newOrderNumber)

      const response = await fetch("/api/pix/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          orderId: newOrderNumber,
          customerName: formData.name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setPixData({
        qrCode: data.qrCode,
        transactionId: data.transactionId,
        expiresAt: data.expiresAt,
      })

      setStep("payment")
    } catch (error) {
      console.error("Erro ao criar PIX:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Copiar código PIX
  const copyPixCode = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Verificar status do pagamento
  const checkPaymentStatus = useCallback(async () => {
    if (!pixData?.transactionId) return

    setCheckingPayment(true)

    try {
      const response = await fetch(`/api/pix/status?transactionId=${pixData.transactionId}`)
      const data = await response.json()

      if (data.status === "paid") {
        clearCart()
        setStep("success")
      }
    } catch {
      // Ignora erros de verificação
    } finally {
      setCheckingPayment(false)
    }
  }, [pixData?.transactionId, clearCart])

  // Polling para verificar pagamento
  useEffect(() => {
    if (step !== "payment" || !pixData) return

    const interval = setInterval(checkPaymentStatus, 5000)
    return () => clearInterval(interval)
  }, [step, pixData, checkPaymentStatus])

  // Handler para blur do CEP
  useEffect(() => {
    const cleanCep = formData.cep.replace(/\D/g, "")
    if (cleanCep.length === 8) {
      fetchCep(formData.cep)
    }
  }, [formData.cep])

  const handleSubmitCart = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("shipping")
  }

  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault()
    createPixPayment()
  }

  // Simular pagamento confirmado (para demo)
  const simulatePayment = () => {
    clearCart()
    setStep("success")
  }

  if (cart.length === 0 && step !== "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-foreground mb-4">Sua sacola esta vazia</h1>
          <p className="text-muted-foreground mb-6">Adicione produtos para continuar</p>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/produtos">Explorar Produtos</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (step === "success") {
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
            Obrigada pela sua compra! Voce recebera um e-mail com os detalhes do pedido e informacoes de rastreamento.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Numero do pedido: <span className="font-medium text-foreground">#{orderNumber}</span>
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
              step === "cart" || step === "shipping" || step === "payment" 
                ? "border-primary bg-primary text-primary-foreground" 
                : "border-border text-muted-foreground"
            }`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium text-foreground hidden sm:inline">Carrinho</span>
          </div>
          <div className={`w-16 h-0.5 mx-2 ${step !== "cart" ? "bg-primary" : "bg-border"}`} />
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step === "shipping" || step === "payment" 
                ? "border-primary bg-primary text-primary-foreground" 
                : "border-border text-muted-foreground"
            }`}>
              <Truck className="w-5 h-5" />
            </div>
            <span className="ml-2 text-sm font-medium text-foreground hidden sm:inline">Entrega</span>
          </div>
          <div className={`w-16 h-0.5 mx-2 ${step === "payment" ? "bg-primary" : "bg-border"}`} />
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              step === "payment" 
                ? "border-primary bg-primary text-primary-foreground" 
                : "border-border text-muted-foreground"
            }`}>
              <QrCode className="w-5 h-5" />
            </div>
            <span className="ml-2 text-sm font-medium text-foreground hidden sm:inline">PIX</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            {step === "cart" && (
              <form onSubmit={handleSubmitCart}>
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
              </form>
            )}

            {step === "shipping" && (
              <form onSubmit={handleSubmitShipping}>
                <div className="space-y-6">
                  <h2 className="text-2xl font-light text-foreground mb-6">
                    Dados de <span className="font-medium italic">Entrega</span>
                  </h2>
                  
                  {/* Dados pessoais */}
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
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <div className="relative">
                        <Input
                          id="cep"
                          name="cep"
                          value={formData.cep}
                          onChange={handleInputChange}
                          required
                          className="h-12"
                          placeholder="00000-000"
                          maxLength={9}
                        />
                        {loadingCep && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                      </div>
                      {cepError && <p className="text-sm text-destructive">{cepError}</p>}
                    </div>
                  </div>

                  {/* Endereço */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor="address">Endereco</Label>
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
                      <Label htmlFor="number">Numero</Label>
                      <Input
                        id="number"
                        name="number"
                        value={formData.number}
                        onChange={handleInputChange}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        name="complement"
                        value={formData.complement}
                        onChange={handleInputChange}
                        className="h-12"
                        placeholder="Apto, Bloco, etc."
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        name="neighborhood"
                        value={formData.neighborhood}
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
                        maxLength={2}
                      />
                    </div>
                  </div>

                  {/* Opções de frete */}
                  {freteOptions.length > 0 && (
                    <div className="space-y-3">
                      <Label>Opcoes de Entrega</Label>
                      {loadingFrete ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Calculando frete...</span>
                        </div>
                      ) : (
                        <RadioGroup
                          value={selectedFrete?.service}
                          onValueChange={(value) => {
                            const option = freteOptions.find((o) => o.service === value)
                            if (option) setSelectedFrete(option)
                          }}
                        >
                          {freteOptions.map((option) => (
                            <div
                              key={option.service}
                              className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                                selectedFrete?.service === option.service
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/50"
                              }`}
                              onClick={() => setSelectedFrete(option)}
                            >
                              <div className="flex items-center gap-3">
                                <RadioGroupItem value={option.service} id={option.service} />
                                <div>
                                  <p className="font-medium text-foreground">{option.serviceName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {option.deliveryDays === 0
                                      ? "Disponivel para retirada"
                                      : `Entrega em ate ${option.deliveryDays} dias uteis`}
                                  </p>
                                </div>
                              </div>
                              <span className={`font-semibold ${option.price === 0 ? "text-green-600" : "text-foreground"}`}>
                                {option.price === 0 ? "Gratis" : formatPrice(option.price)}
                              </span>
                            </div>
                          ))}
                        </RadioGroup>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setStep("cart")} className="flex-1 h-12">
                      Voltar
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
                      disabled={isLoading || !selectedFrete}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Gerando PIX...
                        </>
                      ) : (
                        "Pagar com PIX"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {step === "payment" && pixData && (
              <div className="space-y-6">
                <h2 className="text-2xl font-light text-foreground mb-6">
                  Pagamento via <span className="font-medium italic">PIX</span>
                </h2>

                <div className="bg-card rounded-xl border border-border p-6 text-center">
                  {/* QR Code */}
                  <div className="w-64 h-64 mx-auto bg-white p-4 rounded-lg mb-6 flex items-center justify-center">
                    {/* Usando QRCode estilizado como fallback */}
                    <div className="w-full h-full bg-gradient-to-br from-foreground/5 to-foreground/10 rounded flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-foreground/40" />
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    Escaneie o QR Code acima ou copie o codigo PIX abaixo
                  </p>

                  {/* Código PIX */}
                  <div className="flex items-center gap-2 bg-muted p-3 rounded-lg mb-6">
                    <input
                      type="text"
                      value={pixData.qrCode}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-foreground truncate outline-none"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={copyPixCode}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copiar
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                    {checkingPayment ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Aguardando pagamento...</span>
                      </>
                    ) : (
                      <span>O pagamento sera confirmado automaticamente</span>
                    )}
                  </div>

                  <p className="text-xl font-semibold text-primary mb-4">
                    Total: {formatPrice(total)}
                  </p>

                  {/* Botão de simular pagamento (para demo) */}
                  <Button
                    type="button"
                    onClick={simulatePayment}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Simular Pagamento Confirmado (Demo)
                  </Button>
                </div>

                <Button type="button" variant="outline" onClick={() => setStep("shipping")} className="w-full h-12">
                  Voltar
                </Button>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h3 className="text-lg font-medium text-foreground mb-4">Resumo do Pedido</h3>
              
              {/* Items */}
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="text-foreground">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Cupom */}
              {step !== "payment" && (
                <div className="border-t border-border pt-4 mb-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 text-green-800 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <span className="text-sm font-medium">{appliedCoupon.code}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">-{formatPrice(appliedCoupon.discount)}</span>
                        <button onClick={removeCoupon} className="text-green-600 hover:text-green-800">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Codigo do cupom"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="uppercase"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={applyCoupon}
                          disabled={loadingCoupon || !couponCode.trim()}
                        >
                          {loadingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aplicar"}
                        </Button>
                      </div>
                      {couponError && <p className="text-sm text-destructive">{couponError}</p>}
                    </div>
                  )}
                </div>
              )}
              
              <div className="space-y-3 text-sm border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(cartTotal)}</span>
                </div>
                {selectedFrete && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frete ({selectedFrete.serviceName})</span>
                    <span className={selectedFrete.price === 0 ? "text-green-600" : "text-foreground"}>
                      {selectedFrete.price === 0 ? "Gratis" : formatPrice(selectedFrete.price)}
                    </span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Desconto</span>
                    <span>-{formatPrice(appliedCoupon.discount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-border mt-4 pt-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-medium text-foreground">Total</span>
                  <span className="text-2xl font-semibold text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
