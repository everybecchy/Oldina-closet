"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, MoreHorizontal, GripVertical, Loader2 } from "lucide-react"
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
  subtitle: string | null
  image: string
  link: string | null
  active: boolean
  order: number
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    link: "",
    active: true,
  })

  // Buscar banners do banco
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/admin/banners')
        const data = await response.json()
        
        if (Array.isArray(data)) {
          setBanners(data)
        }
      } catch (error) {
        console.error('Erro ao buscar banners:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchBanners()
  }, [])

  const handleOpenDialog = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner)
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || "",
        image: banner.image,
        link: banner.link || "",
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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = {
        id: editingBanner?.id,
        title: formData.title,
        subtitle: formData.subtitle || null,
        image: formData.image,
        link: formData.link || null,
        active: formData.active,
        order: editingBanner?.order || banners.length + 1,
      }

      const response = await fetch('/api/admin/banners', {
        method: editingBanner ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        if (editingBanner) {
          setBanners((prev) =>
            prev.map((b) => b.id === editingBanner.id ? data : b)
          )
        } else {
          setBanners((prev) => [...prev, data])
        }
        setIsDialogOpen(false)
      } else {
        alert(data.error || 'Erro ao salvar banner')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar banner')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) return
    
    try {
      const response = await fetch(`/api/admin/banners?id=${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success || response.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== id))
      } else {
        alert(data.error || 'Erro ao excluir banner')
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
      alert('Erro ao excluir banner')
    }
  }

  const toggleActive = async (id: string) => {
    const banner = banners.find(b => b.id === id)
    if (!banner) return

    try {
      const response = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...banner,
          active: !banner.active,
        }),
      })

      if (response.ok) {
        setBanners((prev) =>
          prev.map((b) => (b.id === id ? { ...b, active: !b.active } : b))
        )
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
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
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  editingBanner ? "Salvar Alteracoes" : "Criar Banner"
                )}
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
