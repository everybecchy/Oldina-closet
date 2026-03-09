"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2, MoreHorizontal, Play, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  description: string
  url: string
  thumbnail: string
  active: boolean
  order: number
}

const initialVideos: Video[] = [
  {
    id: "1",
    title: "Nova Colecao Primavera",
    description: "Conheca as pecas exclusivas da nossa colecao de primavera",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
    active: true,
    order: 1,
  },
  {
    id: "2",
    title: "Como Cuidar das Suas Joias",
    description: "Dicas essenciais para manter suas joias sempre brilhantes",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80",
    active: true,
    order: 2,
  },
]

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
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
        description: video.description,
        url: video.url,
        thumbnail: video.thumbnail,
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

  const handleSave = () => {
    if (editingVideo) {
      setVideos((prev) =>
        prev.map((v) =>
          v.id === editingVideo.id
            ? { ...v, ...formData }
            : v
        )
      )
    } else {
      const newVideo: Video = {
        id: Date.now().toString(),
        ...formData,
        order: videos.length + 1,
      }
      setVideos((prev) => [...prev, newVideo])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id))
  }

  const toggleActive = (id: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, active: !v.active } : v))
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
            {videos.length} videos cadastrados
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
                className="w-full bg-primary hover:bg-primary/90"
              >
                {editingVideo ? "Salvar Alteracoes" : "Criar Video"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Videos grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative aspect-video bg-muted">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover"
              />
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
                    <DropdownMenuItem onClick={() => toggleActive(video.id)}>
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
    </div>
  )
}
