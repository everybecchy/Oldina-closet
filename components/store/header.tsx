"use client"

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Menu, X, Search, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useStore } from '@/lib/store-context'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
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
          <Link href="/" className="block">
            <Image
              src="/images/logo-ondina.png"
              alt="Ondina Closet"
              width={320}
              height={120}
              className="h-20 md:h-24 lg:h-28 w-auto drop-shadow-sm"
              priority
              style={{ filter: 'contrast(1.1) brightness(0.95)' }}
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
        <div className="flex flex-1 justify-end gap-1 md:gap-2">
          <Button variant="ghost" size="icon" className="hidden lg:flex hover:bg-primary/10">
            <Search className="h-5 w-5 text-foreground" />
          </Button>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden lg:flex hover:bg-primary/10">
                  <User className="h-5 w-5 text-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium">{user?.name || user?.email}</div>
                <DropdownMenuSeparator />
                {user?.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Painel Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/minha-conta">Minha Conta</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/meus-pedidos">Meus Pedidos</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" asChild className="hidden lg:flex hover:bg-primary/10">
              <Link href="/login">
                <User className="h-5 w-5 text-foreground" />
              </Link>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCartOpen(true)}
            className="relative hover:bg-primary/10"
          >
            <ShoppingBag className="h-5 w-5 text-foreground" />
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
                src="/images/logo-ondina.png"
                alt="Ondina Closet"
                width={200}
                height={75}
                className="h-16 w-auto"
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
              <div className="pt-4 border-t border-border space-y-4">
                {isAuthenticated ? (
                  <>
                    {user?.isAdmin && (
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-lg font-medium text-foreground hover:text-primary transition-colors"
                      >
                        Painel Admin
                      </Link>
                    )}
                    <Link
                      href="/minha-conta"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-lg font-medium text-foreground hover:text-primary transition-colors"
                    >
                      Minha Conta
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      className="block text-lg font-medium text-destructive hover:text-destructive/80 transition-colors"
                    >
                      Sair
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    Entrar / Cadastrar
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
