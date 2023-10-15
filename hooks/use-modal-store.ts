import { Channel, ChannelType, Server } from '@prisma/client'
import { create } from 'zustand'
import { mountStoreDevtool } from 'simple-zustand-devtools'

export type ModalType =
  | 'createServer'
  | 'invite'
  | 'editServer'
  | 'members'
  | 'createChannel'
  | 'leaveServer'
  | 'deleteServer'
  | 'deleteChannel'
  | 'editChannel'
  | 'messageFile'
  | 'deleteMessage'
interface ModalStore {
  type: ModalType | null
  data: ModalData
  isOpen: boolean
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
}

interface ModalData {
  server?: Server
  channel?: Channel
  channelType?: ChannelType
  apiUrl?: string
  query?: Record<string, any>
}

export const useModal = create<ModalStore>(set => ({
  type: null,
  data: {},
  isOpen: false,

  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: {} })
}))

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('Store', useModal)
}
