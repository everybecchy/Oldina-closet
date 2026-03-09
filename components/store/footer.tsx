import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image
              src="/images/logo.jpeg"
              alt="Ondina Closet"
              width={150}
              height={54}
              className="h-14 w-auto mb-4"
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Joias elegantes e sofisticadas para mulheres que apreciam a beleza nos detalhes.
            </p>
            <div className="flex gap-4 mt-6">
              <Link href="https://www.instagram.com/ondinacloset?igsh=a2duajJ6aXV0M2lz" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4" style={{ fontFamily: 'var(--font-montserrat)' }}>
              Navegação
            </h3>
            <ul className="space-y-3">
              {['Início', 'Coleção', 'Novidades', 'Sobre Nós'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4" style={{ fontFamily: 'var(--font-montserrat)' }}>
              Categorias
            </h3>
            <ul className="space-y-3">
              {['Anéis', 'Colares', 'Brincos', 'Pulseiras', 'Conjuntos'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4" style={{ fontFamily: 'var(--font-montserrat)' }}>
              Contato
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                contato@ondinacloset.store
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                +55 13 99640-1256
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                São Paulo, Brasil
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-xs text-muted-foreground">
            © 2026 Ondina Closet. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
