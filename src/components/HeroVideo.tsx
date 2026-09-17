import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'

interface HeroVideoProps {
  src: string
  poster: string
  className?: string
}

export function HeroVideo({ src, poster, className = '' }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    video.muted = true
    const play = async () => {
      try {
        await video.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    }
    void play()
  }, [])

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <img
        src={poster}
        alt=""
        aria-hidden
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          ready ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <video
        ref={ref}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
        src={src}
        poster={poster}
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setReady(true)}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div className="absolute bottom-5 right-5 z-10 flex gap-2">
        <button
          type="button"
          aria-label={playing ? 'Pause video' : 'Play video'}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-cinnamon/70 text-cream backdrop-blur-sm transition hover:bg-cinnamon"
          onClick={() => {
            const video = ref.current
            if (!video) return
            if (video.paused) {
              void video.play()
            } else {
              video.pause()
            }
          }}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button
          type="button"
          aria-label={muted ? 'Unmute video' : 'Mute video'}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-cinnamon/70 text-cream backdrop-blur-sm transition hover:bg-cinnamon"
          onClick={() => {
            const video = ref.current
            if (!video) return
            const next = !muted
            video.muted = next
            setMuted(next)
          }}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
