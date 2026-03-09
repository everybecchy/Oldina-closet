"use client"

import { StoreProvider } from '@/lib/store-context'
import { Header } from '@/components/store/header'
import { Footer } from '@/components/store/footer'
import { CartDrawer } from '@/components/store/cart-drawer'
import { HeroSection } from '@/components/store/hero-section'
import { CategorySection } from '@/components/store/category-section'
import { FeaturedSection } from '@/components/store/featured-section'
import { NewsletterSection } from '@/components/store/newsletter-section'

console.log("[v0] HomePage rendering")

export default function HomePage() {
  console.log("[v0] HomePage component mounting")
  return (
    <StoreProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <CategorySection />
          <FeaturedSection />
          <NewsletterSection />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </StoreProvider>
  )
}
