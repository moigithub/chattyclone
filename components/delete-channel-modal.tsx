'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import { useModal } from '@/hooks/use-modal-store'

import { Button } from './ui/button'

import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import qs from 'query-string'

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const [isLoading, setIsLoading] = useState(false)
  const { server, channel } = data
  const router = useRouter()
  const isModalOpen = isOpen && type === 'deleteChannel'

  const onClick = async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: { serverId: server?.id }
      })
      console.log(url)
      await axios.delete(url)
      onClose()
      router.refresh()
      router.push(`/servers/${server?.id}`)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Delete channel</DialogTitle>
          <DialogDescription>
            delete channel ? <span className='font-semibold text-indigo-500'>#{channel?.name}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='bg-gray-100 px-6 py-4'>
          <div className='flex items-center w-full justify-between'>
            <Button disabled={isLoading} onClick={onClose} variant='ghost'>
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={onClick} variant='primary'>
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
