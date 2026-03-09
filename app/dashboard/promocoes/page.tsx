"use client"

import { useState } from "react"
import { Plus, Search, Pencil, Trash2, MoreHorizontal, Percent } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

interface Promotion {
  id: string
  name: string
  description: string
  discountPercent: number
  startDate: string
  endDate: string
  active: boolean
}

const initialPromotions: Promotion[] = [
  {
    id: "1",
    name: "Black Friday",
    description: "Desconto especial em todos os produtos",
    discountPercent: 30,
    startDate: "2026-11-25",
    endDate: "2026-11-30",
    active: false,
  },
  {
    id: "2",
    name: "Dia das Maes",
    description: "Presente perfeito para sua mae",
    discountPercent: 20,
    startDate: "2026-05-01",
    endDate: "2026-05-12",
    active: false,
  },
  {
    id: "3",
    name: "Promocao de Verao",
    description: "Colecao de verao com precos especiais",
    discountPercent: 15,
    startDate: "2026-01-01",
    endDate: "2026-03-31",
    active: true,
  },
]

export default function PromocoesPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discountPercent: "",
    startDate: "",
    endDate: "",
    active: true,
  })

  const filteredPromotions = promotions.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenDialog = (promotion?: Promotion) => {
    if (promotion) {
      setEditingPromotion(promotion)
      setFormData({
        name: promotion.name,
        description: promotion.description,
        discountPercent: promotion.discountPercent.toString(),
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        active: promotion.active,
      })
    } else {
      setEditingPromotion(null)
      setFormData({
        name: "",
        description: "",
        discountPercent: "",
        startDate: "",
        endDate: "",
        active: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingPromotion) {
      setPromotions((prev) =>
        prev.map((p) =>
          p.id === editingPromotion.id
            ? {
                ...p,
                name: formData.name,
                description: formData.description,
                discountPercent: parseFloat(formData.discountPercent),
                startDate: formData.startDate,
                endDate: formData.endDate,
                active: formData.active,
              }
            : p
        )
      )
    } else {
      const newPromotion: Promotion = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        discountPercent: parseFloat(formData.discountPercent),
        startDate: formData.startDate,
        endDate: formData.endDate,
        active: formData.active,
      }
      setPromotions((prev) => [...prev, newPromotion])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id))
  }

  const toggleActive = (id: string) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-foreground">
            Gerenciar <span className="font-medium italic">Promocoes</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            {promotions.length} promocoes cadastradas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Promocao
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingPromotion ? "Editar Promocao" : "Nova Promocao"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Promocao</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ex: Black Friday"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descricao</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Descricao da promocao"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discountPercent">Desconto (%)</Label>
                <Input
                  id="discountPercent"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discountPercent}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, discountPercent: e.target.value }))
                  }
                  placeholder="20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Data de Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Data de Fim</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Ativa</Label>
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
                {editingPromotion ? "Salvar Alteracoes" : "Criar Promocao"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar promocoes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Promotions grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPromotions.map((promotion) => (
          <Card key={promotion.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Percent className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{promotion.name}</h3>
                    <p className="text-2xl font-bold text-primary">
                      {promotion.discountPercent}% OFF
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleOpenDialog(promotion)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleActive(promotion.id)}>
                      {promotion.active ? "Desativar" : "Ativar"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(promotion.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                {promotion.description}
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  {new Date(promotion.startDate).toLocaleDateString("pt-BR")} -{" "}
                  {new Date(promotion.endDate).toLocaleDateString("pt-BR")}
                </div>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    promotion.active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {promotion.active ? "Ativa" : "Inativa"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
