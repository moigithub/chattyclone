import { currentProfile } from '@/lib/current-profile'

import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/lib/db'

export async function PATCH(req: Request, { params }: { params: { serverId: string } }) {
  try {
    const profile = await currentProfile()
    if (!profile) return new NextResponse('unauthorized', { status: 401 })

    if (!params.serverId) return new NextResponse('serverid missing', { status: 400 })

    const server = await db.server.update({
      where: { id: params.serverId, profileId: profile.id },
      data: { inviteCode: uuidv4() }
    })

    return NextResponse.json(server)
  } catch (error) {
    console.error('server_id', error)
    return new NextResponse('internal error', { status: 500 })
  }
}
