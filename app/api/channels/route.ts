import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { name, type } = await req.json()
  const { searchParams } = new URL(req.url)
  const serverId = searchParams.get('serverId')

  try {
    if (!serverId) return new NextResponse('serverid missing', { status: 400 })

    const profile = await currentProfile()
    if (!profile) return new NextResponse('unauthorized', { status: 401 })

    if (name === 'general') return new NextResponse('name cannot be "general"', { status: 400 })

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] }
          }
        }
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name,
            type
          }
        }
      }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.error('server_id_patch', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
