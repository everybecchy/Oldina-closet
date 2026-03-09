"use client"

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, Grid3X3, LayoutGrid, ChevronDown } from 'lucide-react'
import useSWR from 'swr'
import { ProductCard } from '@/components/store/product-card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Spinner } from '@/components/ui/spinner'
import { Skeleton } from '@/components/ui/skeleton'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  image: string
  category: string
  categorySlug: string
}

interface Category {
  id: string
  name: string
  slug: string
}

const sortOptions = [
  { name: 'Mais Recentes', value: 'newest' },
  { name: 'Preço: Menor para Maior', value: 'price-asc' },
  { name: 'Preço: Maior para Menor', value: 'price-desc' },
  { name: 'Nome: A-Z', value: 'name-asc' },
]

function ProductsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('categoria') || ''
  const [selectedCategory, setSelectedCategory] = useState(categoryParam)
  const [sortBy, setSortBy] = useState('newest')
  const [gridCols, setGridCols] = useState<3 | 4>(4)

  // Buscar produtos do banco
  const { data: productsData, isLoading: loadingProducts } = useSWR<{ success: boolean; products: Product[] }>(
    '/api/store/products'
  )

  // Buscar categorias do banco
  const { data: categoriesData, isLoading: loadingCategories } = useSWR<{ success: boolean; categories: Category[] }>(
    '/api/store/categories'
  )

  const allProducts = productsData?.products || []
  const dbCategories = categoriesData?.categories || []

  // Criar lista de categorias para filtro
  const categories = useMemo(() => {
    return [
      { name: 'Todos', slug: '' },
      ...dbCategories.map(c => ({ name: c.name, slug: c.slug }))
    ]
  }, [dbCategories])

  const filteredProducts = useMemo(() => {
    let products = [...allProducts]
    
    // Filter by category
    if (selectedCategory) {
      products = products.filter(p => p.categorySlug === selectedCategory)
    }
    
    // Sort
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        products.sort((a, b) => b.price - a.price)
        break
      case 'name-asc':
        products.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // newest - keep original order (already sorted by createdAt desc from API)
        break
    }
    
    return products
  }, [allProducts, selectedCategory, sortBy])

  const currentSort = sortOptions.find(s => s.value === sortBy)?.name || 'Mais Recentes'
  const isLoading = loadingProducts || loadingCategories

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="py-12 lg:py-16 text-center" style={{ backgroundColor: '#FDF2F4' }}>
        <p 
          className="text-sm uppercase tracking-[0.3em] text-primary mb-3"
          style={{ fontFamily: 'var(--font-montserrat)' }}
        >
          Coleção
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground">
          Nossas <span className="font-medium italic">Joias</span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto px-4">
          Descubra peças exclusivas selecionadas com cuidado para você
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        {/* Filters bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {loadingCategories ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-20" />
              ))
            ) : (
              categories.map((cat) => (
                <Button
                  key={cat.slug}
                  variant={selectedCategory === cat.slug ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={selectedCategory === cat.slug 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-border hover:bg-muted'
                  }
                >
                  {cat.name}
                </Button>
              ))
            )}
          </div>

          {/* Sort & Grid options */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  {currentSort}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sortOptions.map((option) => (
                  <DropdownMenuItem 
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                  >
                    {option.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="hidden lg:flex items-center gap-1 border border-border rounded-md p-1">
              <Button
                variant={gridCols === 3 ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setGridCols(3)}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={gridCols === 4 ? 'secondary' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setGridCols(4)}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          {isLoading ? (
            <Skeleton className="h-4 w-40 inline-block" />
          ) : (
            `${filteredProducts.length} ${filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`
          )}
        </p>

        {/* Products grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Spinner className="h-10 w-10 text-primary" />
            <p className="text-muted-foreground text-sm">Carregando produtos...</p>
          </div>
        ) : (
          <div className={`grid grid-cols-2 gap-4 lg:gap-6 ${
            gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              Nenhum produto encontrado nesta categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
