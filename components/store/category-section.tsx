import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    name: 'Anéis',
    slug: 'aneis',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
    description: 'Elegância para suas mãos'
  },
  {
    name: 'Colares',
    slug: 'colares',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    description: 'Brilho para seu colo'
  },
  {
    name: 'Brincos',
    slug: 'brincos',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    description: 'Destaque seu rosto'
  },
  {
    name: 'Pulseiras',
    slug: 'pulseiras',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80',
    description: 'Charme para seus pulsos'
  },
]

export function CategorySection() {
  return (
    <section className="py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p 
            className="text-sm uppercase tracking-[0.3em] text-primary mb-3"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            Explore
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground">
            Nossas <span className="font-medium italic">Categorias</span>
          </h2>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category) => (
            <Link 
              key={category.slug}
              href={`/produtos?categoria=${category.slug}`}
              className="group relative aspect-[3/4] rounded-xl overflow-hidden"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
                <h3 className="text-lg lg:text-xl font-medium text-white mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-white/80 hidden lg:block">
                  {category.description}
                </p>
                <div className="flex items-center gap-1 mt-2 text-white/90 text-sm group-hover:text-white transition-colors">
                  <span className="hidden lg:inline">Ver mais</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
