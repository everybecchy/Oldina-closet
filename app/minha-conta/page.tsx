"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/lib/auth-context'
import { Header } from '@/components/store/header'
import { Footer } from '@/components/store/footer'
import { CartDrawer } from '@/components/store/cart-drawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, ShoppingBag, Heart, Settings, LogOut } from 'lucide-react'

export default function MinhaContaPage() {
  const router = useRouter()
  const { user, isAuthenticated, loading, logout } = useAuth()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const menuItems = [
    {
      icon: ShoppingBag,
      title: 'Meus Pedidos',
      description: 'Acompanhe seus pedidos e histórico de compras',
      href: '/meus-pedidos'
    },
    {
      icon: Heart,
      title: 'Favoritos',
      description: 'Veja suas peças favoritas',
      href: '/favoritos'
    },
    {
      icon: Settings,
      title: 'Configurações',
      description: 'Altere seus dados e preferências',
      href: '/configuracoes'
    }
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 py-12 lg:px-8">
          {/* User Info Card */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold text-foreground">
                    Olá, {user?.name || 'Cliente'}!
                  </h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                  {user?.isAdmin && (
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
                      Administrador
                    </span>
                  )}
                </div>
                {user?.isAdmin && (
                  <Button asChild variant="outline">
                    <Link href="/dashboard">Painel Admin</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Menu Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Logout Button */}
          <Card>
            <CardContent className="p-6">
              <Button
                variant="outline"
                className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair da Conta
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  )
}
