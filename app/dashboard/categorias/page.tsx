"use client"

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, MoreHorizontal, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  productCount: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  })

  // Buscar categorias do banco
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories')
        const data = await response.json()
        
        if (data.categories) {
          setCategories(data.categories)
        }
      } catch (error) {
        console.error('Erro ao buscar categorias:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCategories()
  }, [])

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        slug: '',
        description: '',
      })
    }
    setIsDialogOpen(true)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingCategory ? prev.slug : generateSlug(name),
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = {
        id: editingCategory?.id,
        name: formData.name,
        description: formData.description || null,
      }

      const response = await fetch('/api/admin/categories', {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        if (editingCategory) {
          setCategories(prev => prev.map(c => 
            c.id === editingCategory.id ? { ...c, ...data.category } : c
          ))
        } else {
          setCategories(prev => [...prev, data.category])
        }
        setIsDialogOpen(false)
      } else {
        alert(data.error || 'Erro ao salvar categoria')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar categoria')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return
    
    try {
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCategories(prev => prev.filter(c => c.id !== id))
      } else {
        alert(data.error || 'Erro ao excluir categoria')
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
      alert('Erro ao excluir categoria')
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
            Gerenciar <span className="font-medium italic">Categorias</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            {categories.length} categorias cadastradas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Anéis"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="aneis"
                />
                <p className="text-xs text-muted-foreground">
                  Usado na URL: /produtos?categoria={formData.slug || 'slug'}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da categoria..."
                  rows={3}
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
                  editingCategory ? 'Salvar Alterações' : 'Criar Categoria'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <CardTitle className="text-lg font-medium">{category.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleOpenDialog(category)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDelete(category.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Slug: <code className="bg-muted px-1 rounded">{category.slug}</code></span>
                <span className="text-foreground font-medium">{category.productCount} produtos</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
