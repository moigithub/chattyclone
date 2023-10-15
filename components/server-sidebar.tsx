import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { ChannelType, MemberRole } from '@prisma/client'
import { redirect } from 'next/navigation'
import { ServerHeader } from './server-header'
import { ScrollArea } from './ui/scroll-area'
import { ServerSearch } from './server-search'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { Separator } from './ui/separator'
import { ServerSection } from './server-section'
import { ServerChannel } from './server-channel'
import { ServerMember } from './server-member'

interface ServerSidebarProps {
  serverId: string
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className='mr-2 h-4 w-4' />,
  [ChannelType.AUDIO]: <Mic className='mr-2 h-4 w-4' />,
  [ChannelType.VIDEO]: <Video className='mr-2 h-4 w-4' />
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 mr-2 text-indigo-500' />,
  [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 mr-2 text-rose-500' />
}

export const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
  const profile = await currentProfile()
  if (!profile) return redirect('/')

  const server = await db.server.findUnique({
    where: { id: serverId },
    include: {
      channels: {
        orderBy: { createdAt: 'asc' }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: { role: 'asc' }
      }
    }
  })

  if (!server) return redirect('/')
  const textChannels = server?.channels.filter(channel => channel.type === ChannelType.TEXT)
  const audioChannels = server?.channels.filter(channel => channel.type === ChannelType.AUDIO)
  const videoChannels = server?.channels.filter(channel => channel.type === ChannelType.VIDEO)
  const members = server?.members.filter(member => member.profileId !== profile.id)

  const role = server?.members.find(member => member.profileId === profile.id)?.role
  console.log('textChannels', textChannels)
  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]'>
      <ServerHeader server={server} role={role} />
      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },

              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },

              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type]
                }))
              },

              {
                label: 'Members Channels',
                type: 'member',
                data: members?.map(member => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role]
                }))
              }
            ]}
          />
        </div>

        <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
        <div className='space-y-[2px]'>
          {textChannels?.length > 0 && (
            <div className='mb-2'>
              <ServerSection
                label={'Text channels'}
                sectionType={'channels'}
                channelType={ChannelType.TEXT}
                role={role}
              />
              {textChannels?.map(channel => (
                <ServerChannel key={channel.id} server={server} channel={channel} role={role} />
              ))}
            </div>
          )}
        </div>
        <div className='space-y-[2px]'>
          {audioChannels?.length > 0 && (
            <div className='mb-2'>
              <ServerSection
                label={'Voice channels'}
                sectionType={'channels'}
                channelType={ChannelType.AUDIO}
                role={role}
              />
              {audioChannels?.map(channel => (
                <ServerChannel key={channel.id} server={server} channel={channel} role={role} />
              ))}{' '}
            </div>
          )}
        </div>
        <div className='space-y-[2px]'>
          {videoChannels?.length > 0 && (
            <div className='mb-2'>
              <ServerSection
                label={'Video channels'}
                sectionType={'channels'}
                channelType={ChannelType.VIDEO}
                role={role}
              />
              {videoChannels?.map(channel => (
                <ServerChannel key={channel.id} server={server} channel={channel} role={role} />
              ))}{' '}
            </div>
          )}
        </div>
        <div className='space-y-[2px]'>
          {members?.length > 0 && (
            <div className='mb-2'>
              <ServerSection
                sectionType={'members'}
                role={role}
                label={'Members'}
                server={server}
              />
              {members?.map(member => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}{' '}
            </div>
          )}{' '}
        </div>
      </ScrollArea>
    </div>
  )
}
