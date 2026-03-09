"use client"

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { SlidersHorizontal, Grid3X3, LayoutGrid, ChevronDown } from 'lucide-react'
import { ProductCard } from '@/components/store/product-card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Spinner } from '@/components/ui/spinner'

const allProducts = [
  {
    id: '1',
    name: 'Anel Serena Dourado',
    price: 189.90,
    comparePrice: 249.90,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
    slug: 'anel-serena-dourado',
    category: 'Anéis',
    categorySlug: 'aneis'
  },
  {
    id: '2',
    name: 'Colar Pérolas Delicadas',
    price: 299.90,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    slug: 'colar-perolas-delicadas',
    category: 'Colares',
    categorySlug: 'colares'
  },
  {
    id: '3',
    name: 'Brinco Gota Cristal',
    price: 159.90,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    slug: 'brinco-gota-cristal',
    category: 'Brincos',
    categorySlug: 'brincos'
  },
  {
    id: '4',
    name: 'Pulseira Elos Finos',
    price: 219.90,
    comparePrice: 279.90,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80',
    slug: 'pulseira-elos-finos',
    category: 'Pulseiras',
    categorySlug: 'pulseiras'
  },
  {
    id: '5',
    name: 'Anel Solitário Elegance',
    price: 349.90,
    image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=600&q=80',
    slug: 'anel-solitario-elegance',
    category: 'Anéis',
    categorySlug: 'aneis'
  },
  {
    id: '6',
    name: 'Brinco Argola Clássica',
    price: 129.90,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80',
    slug: 'brinco-argola-classica',
    category: 'Brincos',
    categorySlug: 'brincos'
  },
  {
    id: '7',
    name: 'Colar Corrente Veneziana',
    price: 259.90,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    slug: 'colar-corrente-veneziana',
    category: 'Colares',
    categorySlug: 'colares'
  },
  {
    id: '8',
    name: 'Pulseira Riviera',
    price: 399.90,
    comparePrice: 499.90,
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80',
    slug: 'pulseira-riviera',
    category: 'Pulseiras',
    categorySlug: 'pulseiras'
  },
  {
    id: '9',
    name: 'Anel Coração Brilhante',
    price: 279.90,
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&q=80',
    slug: 'anel-coracao-brilhante',
    category: 'Anéis',
    categorySlug: 'aneis'
  },
  {
    id: '10',
    name: 'Brinco Estrela Cintilante',
    price: 189.90,
    image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=600&q=80',
    slug: 'brinco-estrela-cintilante',
    category: 'Brincos',
    categorySlug: 'brincos'
  },
  {
    id: '11',
    name: 'Colar Pingente Lua',
    price: 229.90,
    comparePrice: 289.90,
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80',
    slug: 'colar-pingente-lua',
    category: 'Colares',
    categorySlug: 'colares'
  },
  {
    id: '12',
    name: 'Pulseira Charm Delicada',
    price: 169.90,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
    slug: 'pulseira-charm-delicada',
    category: 'Pulseiras',
    categorySlug: 'pulseiras'
  },
]

const categories = [
  { name: 'Todos', slug: '' },
  { name: 'Anéis', slug: 'aneis' },
  { name: 'Colares', slug: 'colares' },
  { name: 'Brincos', slug: 'brincos' },
  { name: 'Pulseiras', slug: 'pulseiras' },
]

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
        // newest - keep original order
        break
    }
    
    return products
  }, [selectedCategory, sortBy])

  const currentSort = sortOptions.find(s => s.value === sortBy)?.name || 'Mais Recentes'

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
            {categories.map((cat) => (
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
            ))}
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
          {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
        </p>

        {/* Products grid */}
        <div className={`grid grid-cols-2 gap-4 lg:gap-6 ${
          gridCols === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'
        }`}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
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
