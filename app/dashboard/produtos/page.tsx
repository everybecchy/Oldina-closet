"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Search, Pencil, Trash2, MoreHorizontal } from 'lucide-react'
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
import { ImageUpload } from '@/components/ui/image-upload'

const initialProducts = [
  {
    id: '1',
    name: 'Anel Serena Dourado',
    price: 189.90,
    comparePrice: 249.90,
    stock: 25,
    category: 'Anéis',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&q=80',
    active: true,
  },
  {
    id: '2',
    name: 'Colar Pérolas Delicadas',
    price: 299.90,
    stock: 18,
    category: 'Colares',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&q=80',
    active: true,
  },
  {
    id: '3',
    name: 'Brinco Gota Cristal',
    price: 159.90,
    stock: 32,
    category: 'Brincos',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&q=80',
    active: true,
  },
  {
    id: '4',
    name: 'Pulseira Elos Finos',
    price: 219.90,
    comparePrice: 279.90,
    stock: 15,
    category: 'Pulseiras',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=200&q=80',
    active: true,
  },
  {
    id: '5',
    name: 'Anel Solitário Elegance',
    price: 349.90,
    stock: 8,
    category: 'Anéis',
    image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=200&q=80',
    active: false,
  },
]

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<typeof initialProducts[0] | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    comparePrice: '',
    stock: '',
    category: '',
    image: '',
  })

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

  const handleOpenDialog = (product?: typeof initialProducts[0]) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        price: product.price.toString(),
        comparePrice: product.comparePrice?.toString() || '',
        stock: product.stock.toString(),
        category: product.category,
        image: product.image,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        price: '',
        comparePrice: '',
        stock: '',
        category: '',
        image: '',
      })
    }
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? {
              ...p,
              name: formData.name,
              price: parseFloat(formData.price),
              comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
              stock: parseInt(formData.stock),
              category: formData.category,
              image: formData.image,
            }
          : p
      ))
    } else {
      const newProduct = {
        id: Date.now().toString(),
        name: formData.name,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        stock: parseInt(formData.stock),
        category: formData.category,
        image: formData.image || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=200&q=80',
        active: true,
      }
      setProducts(prev => [...prev, newProduct])
    }
    setIsDialogOpen(false)
  }

  const handleDelete = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const toggleActive = (id: string) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, active: !p.active } : p
    ))
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
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Anéis"
                  />
                </div>
              </div>
              <ImageUpload
                label="Imagem do Produto"
                value={formData.image}
                onChange={(val) => setFormData(prev => ({ ...prev, image: val }))}
                aspectRatio="square"
              />
              <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">
                {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
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
