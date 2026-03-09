import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from './product-card'
import { Button } from '@/components/ui/button'

const featuredProducts = [
  {
    id: '1',
    name: 'Anel Serena Dourado',
    price: 189.90,
    comparePrice: 249.90,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
    slug: 'anel-serena-dourado',
    category: 'Anéis'
  },
  {
    id: '2',
    name: 'Colar Pérolas Delicadas',
    price: 299.90,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    slug: 'colar-perolas-delicadas',
    category: 'Colares'
  },
  {
    id: '3',
    name: 'Brinco Gota Cristal',
    price: 159.90,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    slug: 'brinco-gota-cristal',
    category: 'Brincos'
  },
  {
    id: '4',
    name: 'Pulseira Elos Finos',
    price: 219.90,
    comparePrice: 279.90,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80',
    slug: 'pulseira-elos-finos',
    category: 'Pulseiras'
  },
  {
    id: '5',
    name: 'Anel Solitário Elegance',
    price: 349.90,
    image: 'https://images.unsplash.com/photo-1603561596112-0a132b757442?w=600&q=80',
    slug: 'anel-solitario-elegance',
    category: 'Anéis'
  },
  {
    id: '6',
    name: 'Brinco Argola Clássica',
    price: 129.90,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80',
    slug: 'brinco-argola-classica',
    category: 'Brincos'
  },
  {
    id: '7',
    name: 'Colar Corrente Veneziana',
    price: 259.90,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    slug: 'colar-corrente-veneziana',
    category: 'Colares'
  },
  {
    id: '8',
    name: 'Pulseira Riviera',
    price: 399.90,
    comparePrice: 499.90,
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80',
    slug: 'pulseira-riviera',
    category: 'Pulseiras'
  },
]

export function FeaturedSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p 
              className="text-sm uppercase tracking-[0.3em] text-primary mb-3"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              Destaques
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground">
              Peças <span className="font-medium italic">Selecionadas</span>
            </h2>
          </div>
          <Button asChild variant="outline" className="border-primary/30 text-foreground hover:bg-primary/5">
            <Link href="/produtos">
              Ver Todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}
