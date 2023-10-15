import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {
  const { searchParams } = new URL(req.url)
  const serverId = searchParams.get('serverId')
  const { name, type } = await req.json()

  try {
    const profile = await currentProfile()
    if (!profile) return new NextResponse('unauthorized', { status: 401 })
    if (!serverId) return new NextResponse('serverId missing', { status: 400 })
    if (!params.channelId) return new NextResponse('channelid missing', { status: 400 })
    if (name === 'general') return new NextResponse('name cannot be "general"', { status: 400 })

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
              NOT: { name: 'general' }
            },
            data: {
              name,
              type
            }
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.error('channel_id_delete', error)
    return new NextResponse('internal error', { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
  const { searchParams } = new URL(req.url)
  const serverId = searchParams.get('serverId')

  try {
    const profile = await currentProfile()
    if (!profile) return new NextResponse('unauthorized', { status: 401 })
    if (!serverId) return new NextResponse('serverId missing', { status: 400 })
    if (!params.channelId) return new NextResponse('channelid missing', { status: 400 })

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: { not: 'general' }
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.error('channel_id_delete', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
