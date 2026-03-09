"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '@/lib/store-context'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Início', href: '/' },
  { name: 'Coleção', href: '/produtos' },
  { name: 'Anéis', href: '/produtos?categoria=aneis' },
  { name: 'Colares', href: '/produtos?categoria=colares' },
  { name: 'Brincos', href: '/produtos?categoria=brincos' },
  { name: 'Pulseiras', href: '/produtos?categoria=pulseiras' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { cartCount, setIsCartOpen } = useStore()

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            className="text-foreground"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Logo */}
        <div className="flex lg:flex-1 justify-center lg:justify-start">
          <Link href="/" className="-m-1.5 p-1.5">
            <Image
              src="/images/logo.jpeg"
              alt="Ondina Closet"
              width={140}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors uppercase"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right side icons */}
        <div className="flex flex-1 justify-end gap-2">
          <Button variant="ghost" size="icon" className="hidden lg:flex">
            <Search className="h-5 w-5 text-foreground/70" />
          </Button>
          <Button variant="ghost" size="icon" asChild className="hidden lg:flex">
            <Link href="/admin">
              <User className="h-5 w-5 text-foreground/70" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(true)}
            className="relative"
          >
            <ShoppingBag className="h-5 w-5 text-foreground/70" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-[10px] font-semibold text-primary-foreground flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-card shadow-xl">
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <Image
                src="/images/logo.jpeg"
                alt="Ondina Closet"
                width={100}
                height={36}
                className="h-10 w-auto"
              />
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="px-4 py-6 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  Área Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
