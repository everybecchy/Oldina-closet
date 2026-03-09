"use client"

import { SWRConfig } from 'swr'
import { ReactNode } from 'react'

// Cache provider com localStorage
function localStorageProvider() {
  if (typeof window === 'undefined') {
    return new Map()
  }
  
  // Carregar cache do localStorage
  const map = new Map<string, unknown>(
    JSON.parse(localStorage.getItem('app-cache') || '[]')
  )

  // Salvar no localStorage antes de sair da pagina
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem('app-cache', appCache)
  })

  return map
}

// Fetcher global otimizado
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Falha ao carregar dados')
  }
  return res.json()
}

interface SWRProviderProps {
  children: ReactNode
}

export function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher,
        provider: localStorageProvider,
        revalidateOnFocus: false,
        revalidateIfStale: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60000, // 1 minuto
        focusThrottleInterval: 60000,
        errorRetryCount: 2,
        keepPreviousData: true,
        fallbackData: undefined,
      }}
    >
      {children}
    </SWRConfig>
  )
}
