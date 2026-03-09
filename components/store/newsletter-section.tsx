"use client"

import { useState } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      setEmail('')
    }
  }

  return (
    <section className="py-20 bg-card">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div 
          className="relative rounded-2xl overflow-hidden px-6 py-16 lg:px-16 lg:py-20"
          style={{ backgroundColor: '#FDF2F4' }}
        >
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 text-primary/20">
            <Sparkles className="h-8 w-8" />
          </div>
          <div className="absolute bottom-10 right-10 text-primary/20">
            <Sparkles className="h-12 w-12" />
          </div>
          
          <div className="relative max-w-2xl mx-auto text-center">
            <p 
              className="text-sm uppercase tracking-[0.3em] text-primary mb-3"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              Newsletter
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">
              Receba <span className="font-medium italic">Novidades</span>
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Cadastre-se para receber em primeira mão nossas novidades, promoções exclusivas e dicas de estilo.
            </p>

            {isSubmitted ? (
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <p className="text-lg text-foreground font-medium">Obrigada por se cadastrar!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Você receberá nossas novidades em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-12 bg-card border-border text-base"
                />
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Inscrever
                </Button>
              </form>
            )}

            <p className="text-xs text-muted-foreground mt-4">
              Ao se inscrever, você concorda com nossa política de privacidade.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
