import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center" style={{ backgroundColor: '#FDF2F4' }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      </div>
      
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <p 
                className="text-sm uppercase tracking-[0.3em] text-primary"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                Nova Coleção 2026
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight text-balance">
                Elegância que
                <span className="block font-medium italic text-primary"> brilha em você</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed">
                Descubra joias exclusivas criadas para mulheres que apreciam a sofisticação nos detalhes.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12"
              >
                <Link href="/produtos">
                  Explorar Coleção
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="lg"
                className="border-primary/30 text-foreground hover:bg-primary/5 px-8 h-12"
              >
                <Link href="/produtos?categoria=novidades">
                  Novidades
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
              <div className="text-center">
                <p className="text-2xl font-semibold text-primary">500+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide" style={{ fontFamily: 'var(--font-montserrat)' }}>Peças Exclusivas</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-semibold text-primary">5k+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide" style={{ fontFamily: 'var(--font-montserrat)' }}>Clientes Felizes</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-semibold text-primary">100%</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide" style={{ fontFamily: 'var(--font-montserrat)' }}>Garantia</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80"
                alt="Joias elegantes"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden relative">
                  <Image
                    src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=100&q=80"
                    alt="Anel"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Anel Serenity</p>
                  <p className="text-xs text-primary font-semibold">R$ 189,90</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
