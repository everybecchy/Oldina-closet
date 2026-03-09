"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Search, Pencil, Trash2, MoreHorizontal, GripVertical } from "lucide-react"
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
import { ImageUpload } from "@/components/ui/image-upload"

interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  link: string
  active: boolean
  order: number
}

const initialBanners: Banner[] = [
  {
    id: "1",
    title: "Nova Colecao",
    subtitle: "Descubra as joias mais elegantes",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    link: "/produtos",
    active: true,
    order: 1,
  },
  {
    id: "2",
    title: "Promocao de Verao",
    subtitle: "Ate 30% de desconto",
    image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80",
    link: "/promocoes",
    active: true,
    order: 2,
  },
]

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    active: true,
  })

  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner)
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle,
        image: banner.image,
        link: banner.link,
        active: banner.active,
      })
    } else {
      setEditingBanner(null)
      setFormData({
        title: "",
        subtitle: "",
        image: "",
        link: "",
        active: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingBanner) {
      setBanners((prev) =>
        prev.map((b) =>
          b.id === editingBanner.id
            ? { ...b, ...formData }
            : b
        )
      )
    } else {
      const newBanner: Banner = {
        id: Date.now().toString(),
        ...formData,
        order: banners.length + 1,
      }
      setBanners((prev) => [...prev, newBanner])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id))
  }

  const toggleActive = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-light text-foreground">
            Gerenciar <span className="font-medium italic">Banners</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            {banners.length} banners cadastrados
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Banner
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingBanner ? "Editar Banner" : "Novo Banner"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titulo</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Ex: Nova Colecao"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitulo</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, subtitle: e.target.value }))
                  }
                  placeholder="Ex: Descubra as joias mais elegantes"
                />
              </div>
              <ImageUpload
                label="Imagem do Banner"
                value={formData.image}
                onChange={(val) => setFormData((prev) => ({ ...prev, image: val }))}
                aspectRatio="banner"
              />
              <div className="space-y-2">
                <Label htmlFor="link">Link (opcional)</Label>
                <Input
                  id="link"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, link: e.target.value }))
                  }
                  placeholder="/produtos"
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
                {editingBanner ? "Salvar Alteracoes" : "Criar Banner"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banners list */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Lista de Banners</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50"
              >
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{banner.title}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {banner.subtitle}
                  </p>
                  {banner.link && (
                    <p className="text-xs text-primary mt-1">{banner.link}</p>
                  )}
                </div>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    banner.active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {banner.active ? "Ativo" : "Inativo"}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleOpenDialog(banner)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleActive(banner.id)}>
                      {banner.active ? "Desativar" : "Ativar"}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(banner.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
