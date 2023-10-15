'use client'
import { useUser } from '@clerk/nextjs'
import '@livekit/components-styles'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LiveKitRoom, VideoConference } from '@livekit/components-react'

interface MediaRoomProps {
  chatId: string
  video: boolean
  audio: boolean
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser()
  const [token, setToken] = useState('')

  useEffect(() => {
    console.log({ user })
    // if (!user?.firstName || !user?.lastName) return

    let name: string = `${user?.firstName || ''} ${user?.lastName || ''}`
    if (name.trim() === '') {
      name = user?.primaryEmailAddress?.emailAddress || 'Guest'
    }

    ;(async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
        const data = await resp.json()
        setToken(data.token)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [user?.firstName, user?.lastName, chatId])

  if (token === '') {
    return (
      <div className='flex flex-col justify-center items-center'>
        <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Loading...</p>
      </div>
    )
  }

  return (
    <LiveKitRoom
      data-lk-theme='default'
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      video={video}
      audio={audio}
      connect={true}
      // connectOptions={{ autoSubscribe: false }}
      // style={{ height: '100dvh' }}
    >
      <VideoConference />
    </LiveKitRoom>
  )
}
