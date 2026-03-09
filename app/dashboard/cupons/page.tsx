"use client"

import { useState } from "react"
import { Plus, Search, Pencil, Trash2, MoreHorizontal, Ticket, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Coupon {
  id: string
  code: string
  description: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minPurchase: number | null
  maxUses: number | null
  usedCount: number
  active: boolean
  expiresAt: string | null
}

const initialCoupons: Coupon[] = [
  {
    id: "1",
    code: "BEMVINDA10",
    description: "10% de desconto para novos clientes",
    discountType: "percentage",
    discountValue: 10,
    minPurchase: 100,
    maxUses: 100,
    usedCount: 45,
    active: true,
    expiresAt: "2026-12-31",
  },
  {
    id: "2",
    code: "FRETEGRATIS",
    description: "Frete gratis em compras acima de R$200",
    discountType: "fixed",
    discountValue: 25,
    minPurchase: 200,
    maxUses: null,
    usedCount: 120,
    active: true,
    expiresAt: null,
  },
  {
    id: "3",
    code: "VERAO20",
    description: "20% de desconto na colecao de verao",
    discountType: "percentage",
    discountValue: 20,
    minPurchase: 150,
    maxUses: 50,
    usedCount: 50,
    active: false,
    expiresAt: "2026-03-01",
  },
]

export default function CuponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minPurchase: "",
    maxUses: "",
    expiresAt: "",
    active: true,
  })

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenDialog = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon)
      setFormData({
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
        minPurchase: coupon.minPurchase?.toString() || "",
        maxUses: coupon.maxUses?.toString() || "",
        expiresAt: coupon.expiresAt || "",
        active: coupon.active,
      })
    } else {
      setEditingCoupon(null)
      setFormData({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        minPurchase: "",
        maxUses: "",
        expiresAt: "",
        active: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === editingCoupon.id
            ? {
                ...c,
                code: formData.code.toUpperCase(),
                description: formData.description,
                discountType: formData.discountType,
                discountValue: parseFloat(formData.discountValue),
                minPurchase: formData.minPurchase
                  ? parseFloat(formData.minPurchase)
                  : null,
                maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
                expiresAt: formData.expiresAt || null,
                active: formData.active,
              }
            : c
        )
      )
    } else {
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        code: formData.code.toUpperCase(),
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        minPurchase: formData.minPurchase
          ? parseFloat(formData.minPurchase)
          : null,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        usedCount: 0,
        expiresAt: formData.expiresAt || null,
        active: formData.active,
      }
      setCoupons((prev) => [...prev, newCoupon])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id))
  }

  const toggleActive = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    )
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-foreground">
            Gerenciar <span className="font-medium italic">Cupons</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            {coupons.length} cupons cadastrados
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Cupom
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCoupon ? "Editar Cupom" : "Novo Cupom"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="code">Codigo do Cupom</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="Ex: BEMVINDA10"
                  className="uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descricao</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Ex: 10% de desconto para novos clientes"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo de Desconto</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value: "percentage" | "fixed") =>
                      setFormData((prev) => ({ ...prev, discountType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                      <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountValue">
                    Valor {formData.discountType === "percentage" ? "(%)" : "(R$)"}
                  </Label>
                  <Input
                    id="discountValue"
                    type="number"
                    step="0.01"
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discountValue: e.target.value,
                      }))
                    }
                    placeholder={formData.discountType === "percentage" ? "10" : "25"}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPurchase">Compra Minima (R$)</Label>
                  <Input
                    id="minPurchase"
                    type="number"
                    step="0.01"
                    value={formData.minPurchase}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minPurchase: e.target.value,
                      }))
                    }
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUses">Limite de Usos</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxUses: e.target.value,
                      }))
                    }
                    placeholder="Ilimitado"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Data de Expiracao</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expiresAt: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Ativo</Label>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, active: checked }))
                  }
                />
              </div>
              <Button
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {editingCoupon ? "Salvar Alteracoes" : "Criar Cupom"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar cupons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Coupons table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Lista de Cupons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Codigo
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">
                    Desconto
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                    Usos
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">
                    Expira
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-primary" />
                        <span className="font-mono font-medium text-foreground">
                          {coupon.code}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => copyCode(coupon.code)}
                          title="Copiar codigo"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {coupon.description}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground hidden sm:table-cell">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : formatPrice(coupon.discountValue)}
                      {coupon.minPurchase && (
                        <span className="text-xs text-muted-foreground block">
                          Min: {formatPrice(coupon.minPurchase)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">
                      {coupon.usedCount}
                      {coupon.maxUses && ` / ${coupon.maxUses}`}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden lg:table-cell">
                      {coupon.expiresAt
                        ? new Date(coupon.expiresAt).toLocaleDateString("pt-BR")
                        : "Sem limite"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          coupon.active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {coupon.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleOpenDialog(coupon)}
                          >
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleActive(coupon.id)}
                          >
                            {coupon.active ? "Desativar" : "Ativar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(coupon.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
