"use client"

import { Header } from '@/components/store/header'
import { Footer } from '@/components/store/footer'
import { CartDrawer } from '@/components/store/cart-drawer'
import { BannerCarousel } from '@/components/store/banner-carousel'
import { CategorySection } from '@/components/store/category-section'
import { FeaturedSection } from '@/components/store/featured-section'
import { VideoSection } from '@/components/store/video-section'
import { NewsletterSection } from '@/components/store/newsletter-section'
import { WhatsAppButton } from '@/components/store/whatsapp-button'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <BannerCarousel />
        <CategorySection />
        <FeaturedSection />
        <VideoSection />
        <NewsletterSection />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  )
}
