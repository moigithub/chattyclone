import { ModeToggle } from '@/components/ui/mode-toggle'
import { UserButton } from '@clerk/nextjs'
import { initialProfile } from '@/lib/initial-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { InitialModal } from '@/components/initial-modal'

export default async function Home() {
  const profile = await initialProfile()
  const server = await db.server.findFirst({
    where: {
      members: { some: { profileId: profile.id } }
    }
  })

  if (server) {
    return redirect(`/servers/${server.id}`)
  }

  return (
    <div>
      <p className='text-3xl'>Create a server</p>
      <InitialModal></InitialModal>
    </div>
  )
}
