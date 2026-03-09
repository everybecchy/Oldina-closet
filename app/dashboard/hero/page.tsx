"use client"

import { useState, useEffect } from 'react'
import { Loader2, Save, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'
import { toast } from 'sonner'
import Link from 'next/link'

interface HeroSettings {
  heroTagline: string
  heroTitle: string
  heroTitleAccent: string
  heroDescription: string
  heroImage: string | null
  heroStat1Value: string
  heroStat1Label: string
  heroStat2Value: string
  heroStat2Label: string
  heroStat3Value: string
  heroStat3Label: string
}

export default function HeroSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [settings, setSettings] = useState<HeroSettings>({
    heroTagline: '',
    heroTitle: '',
    heroTitleAccent: '',
    heroDescription: '',
    heroImage: null,
    heroStat1Value: '',
    heroStat1Label: '',
    heroStat2Value: '',
    heroStat2Label: '',
    heroStat3Value: '',
    heroStat3Label: '',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/hero')
      const data = await response.json()
      setSettings({
        heroTagline: data.heroTagline || '',
        heroTitle: data.heroTitle || '',
        heroTitleAccent: data.heroTitleAccent || '',
        heroDescription: data.heroDescription || '',
        heroImage: data.heroImage || null,
        heroStat1Value: data.heroStat1Value || '',
        heroStat1Label: data.heroStat1Label || '',
        heroStat2Value: data.heroStat2Value || '',
        heroStat2Label: data.heroStat2Label || '',
        heroStat3Value: data.heroStat3Value || '',
        heroStat3Label: data.heroStat3Label || '',
      })
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Erro ao carregar configuracoes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/admin/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success('Configuracoes salvas com sucesso!')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Erro ao salvar configuracoes')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light text-foreground">
            Secao <span className="font-medium italic text-primary">Hero</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure os textos e imagem da secao principal da homepage
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/" target="_blank">
              <Eye className="h-4 w-4 mr-2" />
              Ver Site
            </Link>
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alteracoes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Textos principais */}
        <Card>
          <CardHeader>
            <CardTitle>Textos Principais</CardTitle>
            <CardDescription>
              Configure o titulo e descricao da secao hero
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline (texto pequeno acima do titulo)</Label>
              <Input
                id="tagline"
                value={settings.heroTagline}
                onChange={(e) => setSettings(prev => ({ ...prev, heroTagline: e.target.value }))}
                placeholder="Ex: Colecao Exclusiva"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Titulo Principal</Label>
              <Input
                id="title"
                value={settings.heroTitle}
                onChange={(e) => setSettings(prev => ({ ...prev, heroTitle: e.target.value }))}
                placeholder="Ex: Elegancia que"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="titleAccent">Titulo em Destaque (italico)</Label>
              <Input
                id="titleAccent"
                value={settings.heroTitleAccent}
                onChange={(e) => setSettings(prev => ({ ...prev, heroTitleAccent: e.target.value }))}
                placeholder="Ex: brilha em voce"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descricao</Label>
              <Textarea
                id="description"
                value={settings.heroDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, heroDescription: e.target.value }))}
                placeholder="Descricao da secao..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Imagem */}
        <Card>
          <CardHeader>
            <CardTitle>Imagem do Hero</CardTitle>
            <CardDescription>
              Imagem exibida ao lado do texto na secao hero
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUpload
              label=""
              value={settings.heroImage || ''}
              onChange={(val) => setSettings(prev => ({ ...prev, heroImage: val || null }))}
              aspectRatio="portrait"
            />
          </CardContent>
        </Card>

        {/* Estatisticas */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estatisticas</CardTitle>
            <CardDescription>
              Numeros exibidos abaixo da descricao (deixe em branco para ocultar)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-3 p-4 border rounded-lg">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Estatistica 1</Label>
                <Input
                  value={settings.heroStat1Value}
                  onChange={(e) => setSettings(prev => ({ ...prev, heroStat1Value: e.target.value }))}
                  placeholder="500+"
                />
                <Input
                  value={settings.heroStat1Label}
                  onChange={(e) => setSettings(prev => ({ ...prev, heroStat1Label: e.target.value }))}
                  placeholder="Pecas Exclusivas"
                />
              </div>
              <div className="space-y-3 p-4 border rounded-lg">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Estatistica 2</Label>
                <Input
                  value={settings.heroStat2Value}
                  onChange={(e) => setSettings(prev => ({ ...prev, heroStat2Value: e.target.value }))}
                  placeholder="5k+"
                />
                <Input
                  value={settings.heroStat2Label}
                  onChange={(e) => setSettings(prev => ({ ...prev, heroStat2Label: e.target.value }))}
                  placeholder="Clientes Felizes"
                />
              </div>
              <div className="space-y-3 p-4 border rounded-lg">
                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Estatistica 3</Label>
                <Input
                  value={settings.heroStat3Value}
                  onChange={(e) => setSettings(prev => ({ ...prev, heroStat3Value: e.target.value }))}
                  placeholder="100%"
                />
                <Input
                  value={settings.heroStat3Label}
                  onChange={(e) => setSettings(prev => ({ ...prev, heroStat3Label: e.target.value }))}
                  placeholder="Garantia"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
