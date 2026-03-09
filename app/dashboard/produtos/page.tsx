"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Search, Pencil, Trash2, MoreHorizontal, Loader2 } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '@/components/ui/image-upload'

interface Product {
  id: string
  name: string
  price: number
  comparePrice?: number | null
  stock: number
  category: string
  categoryId: string
  image: string
  active: boolean
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    comparePrice: '',
    stock: '',
    categoryId: '',
    image: '',
  })

  // Buscar produtos e categorias do banco
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/categories'),
        ])
        
        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()
        
        if (productsData.products) {
          setProducts(productsData.products)
        }
        if (categoriesData.categories) {
          setCategories(categoriesData.categories)
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        price: product.price.toString(),
        comparePrice: product.comparePrice?.toString() || '',
        stock: product.stock.toString(),
        categoryId: product.categoryId,
        image: product.image,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        price: '',
        comparePrice: '',
        stock: '',
        categoryId: categories[0]?.id || '',
        image: '',
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = {
        id: editingProduct?.id,
        name: formData.name,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        stock: parseInt(formData.stock) || 0,
        categoryId: formData.categoryId,
        image: formData.image,
        images: formData.image ? [formData.image] : [],
      }

      const response = await fetch('/api/admin/products', {
        method: editingProduct ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        if (editingProduct) {
          setProducts(prev => prev.map(p => 
            p.id === editingProduct.id ? data.product : p
          ))
        } else {
          setProducts(prev => [...prev, data.product])
        }
        setIsDialogOpen(false)
      } else {
        alert(data.error || 'Erro ao salvar produto')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar produto')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id))
      } else {
        alert(data.error || 'Erro ao excluir produto')
      }
    } catch (error) {
      console.error('Erro ao excluir:', error)
      alert('Erro ao excluir produto')
    }
  }

  const toggleActive = async (id: string) => {
    const product = products.find(p => p.id === id)
    if (!product) return

    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          ...product,
          active: !product.active,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setProducts(prev => prev.map(p => 
          p.id === id ? { ...p, active: !p.active } : p
        ))
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
            Gerenciar <span className="font-medium italic">Produtos</span>
          </h2>
          <p className="text-muted-foreground mt-1">
            {products.length} produtos cadastrados
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Anel Serena Dourado"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="189.90"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comparePrice">Preço Anterior</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    step="0.01"
                    value={formData.comparePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, comparePrice: e.target.value }))}
                    placeholder="249.90"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Estoque</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <ImageUpload
                label="Imagem do Produto"
                value={formData.image}
                onChange={(val) => setFormData(prev => ({ ...prev, image: val }))}
                aspectRatio="square"
              />
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
                  editingProduct ? 'Salvar Alterações' : 'Criar Produto'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-medium">Lista de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Produto</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Categoria</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Preço</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Estoque</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium text-foreground text-sm">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden sm:table-cell">{product.category}</td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-foreground">{formatPrice(product.price)}</p>
                        {product.comparePrice && (
                          <p className="text-xs text-muted-foreground line-through">{formatPrice(product.comparePrice)}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{product.stock} un</td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        product.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.active ? 'Ativo' : 'Inativo'}
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
                          <DropdownMenuItem onClick={() => handleOpenDialog(product)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleActive(product.id)}>
                            {product.active ? 'Desativar' : 'Ativar'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(product.id)}
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
