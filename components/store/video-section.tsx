"use client"

import { Play } from 'lucide-react'
import useSWR from 'swr'
import { useState } from 'react'

interface Video {
  id: string
  title: string
  description: string | null
  url: string
  thumbnail: string | null
  active: boolean
}

const fetcher = (url: string) => fetch(url).then(res => res.json())

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/)
  return match ? match[1] : null
}

function getYouTubeThumbnail(url: string) {
  const videoId = getYouTubeId(url)
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
}

export function VideoSection() {
  const { data: videos } = useSWR<Video[]>('/api/admin/videos', fetcher)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  
  const activeVideos = videos?.filter(v => v.active) || []
  
  if (!activeVideos.length) return null

  return (
    <section className="py-16 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light text-foreground">
            Nossos <span className="font-medium italic text-primary">Vídeos</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Conheça mais sobre nossas peças e como elas podem transformar seu visual
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeVideos.map((video) => {
            const isYouTube = video.url.includes('youtube') || video.url.includes('youtu.be')
            const thumbnail = video.thumbnail || getYouTubeThumbnail(video.url)
            const videoId = getYouTubeId(video.url)
            const isPlaying = playingVideo === video.id

            return (
              <div key={video.id} className="group">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-foreground/5">
                  {isPlaying && isYouTube && videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <>
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Play className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setPlayingVideo(video.id)}
                          className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground transform scale-90 group-hover:scale-100 transition-transform"
                        >
                          <Play className="h-8 w-8 ml-1" fill="currentColor" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="font-medium text-foreground">{video.title}</h3>
                  {video.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{video.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
