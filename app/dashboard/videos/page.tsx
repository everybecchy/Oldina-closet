"use client"

import { useState } from "react"
import Image from "next/image"
import useSWR from "swr"
import { Plus, Pencil, Trash2, MoreHorizontal, Play, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
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

interface Video {
  id: string
  title: string
  description: string | null
  url: string
  thumbnail: string | null
  active: boolean
  order: number
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function VideosPage() {
  const { data: videos, mutate, isLoading } = useSWR<Video[]>("/api/admin/videos", fetcher)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    thumbnail: "",
    active: true,
  })

  const handleOpenDialog = (video?: Video) => {
    if (video) {
      setEditingVideo(video)
      setFormData({
        title: video.title,
        description: video.description || "",
        url: video.url,
        thumbnail: video.thumbnail || "",
        active: video.active,
      })
    } else {
      setEditingVideo(null)
      setFormData({
        title: "",
        description: "",
        url: "",
        thumbnail: "",
        active: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      if (editingVideo) {
        // Atualizar video existente
        const response = await fetch("/api/admin/videos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingVideo.id,
            ...formData,
            order: editingVideo.order,
          }),
        })
        if (!response.ok) throw new Error("Erro ao atualizar video")
      } else {
        // Criar novo video
        const response = await fetch("/api/admin/videos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            order: (videos?.length || 0) + 1,
          }),
        })
        if (!response.ok) throw new Error("Erro ao criar video")
      }
      mutate()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Erro ao salvar video:", error)
      alert("Erro ao salvar video")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este video?")) return
    
    try {
      const response = await fetch(`/api/admin/videos?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Erro ao excluir video")
      mutate()
    } catch (error) {
      console.error("Erro ao excluir video:", error)
      alert("Erro ao excluir video")
    }
  }

  const toggleActive = async (video: Video) => {
    try {
      const response = await fetch("/api/admin/videos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: video.id,
          active: !video.active,
        }),
      })
      if (!response.ok) throw new Error("Erro ao atualizar video")
      mutate()
    } catch (error) {
      console.error("Erro ao atualizar video:", error)
      alert("Erro ao atualizar video")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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
            Gerenciar <span className="font-medium italic">Videos</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            {videos?.length || 0} videos cadastrados
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleOpenDialog()}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Video
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingVideo ? "Editar Video" : "Novo Video"}
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
                  placeholder="Ex: Nova Colecao Primavera"
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
                  placeholder="Breve descricao do video"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL do Video (YouTube, Vimeo, etc)</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <ImageUpload
                label="Thumbnail (capa do video)"
                value={formData.thumbnail}
                onChange={(val) => setFormData((prev) => ({ ...prev, thumbnail: val }))}
                aspectRatio="thumbnail"
              />
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
                disabled={isSaving}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : editingVideo ? (
                  "Salvar Alteracoes"
                ) : (
                  "Criar Video"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Videos grid */}
      {!videos || videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum video cadastrado ainda.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Clique em "Novo Video" para adicionar o primeiro.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="relative aspect-video bg-muted">
                {video.thumbnail ? (
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-background/90 flex items-center justify-center">
                    <Play className="h-6 w-6 text-primary ml-1" />
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      video.active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {video.active ? "Ativo" : "Inativo"}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">
                      {video.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {video.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenDialog(video)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleActive(video)}>
                        {video.active ? "Desativar" : "Ativar"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(video.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
