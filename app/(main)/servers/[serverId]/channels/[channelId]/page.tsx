import { ChatHeader } from '@/components/chat-header'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirectToSignIn } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { ChatInput } from '../../../../../../components/chat-input'
import { ChatMessages } from '@/components/chat-messages'
import { ChannelType } from '@prisma/client'
import { MediaRoom } from '@/components/media-room'

interface ChannelIdPageProps {
  params: {
    serverId: string
    channelId: string
  }
}

export default async function Page({ params }: ChannelIdPageProps) {
  const profile = await currentProfile()

  if (!profile) return redirectToSignIn()

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId
    }
  })

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id
    }
  })

  if (!channel || !member) return redirect('/')

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader name={channel.name} serverId={channel.serverId} type='channel' />

      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            name={channel.name}
            member={member}
            chatId={channel.id}
            apiUrl={'/api/messages'}
            socketUrl={'/api/socket/messages'}
            socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
            paramKey={'channelId'}
            paramValue={channel.id}
            type={'channel'}
          />
          <ChatInput
            name={channel.name}
            type='channel'
            apiUrl='/api/socket/messages'
            query={{ channelId: channel.id, serverId: channel.serverId }}
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} audio={false} />
      )}
    </div>
  )
}
