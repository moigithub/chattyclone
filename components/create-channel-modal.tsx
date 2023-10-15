'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileUpload } from './file-upload'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { useModal } from '@/hooks/use-modal-store'
import { ChannelType } from '@prisma/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import qs from 'query-string'
import { useEffect } from 'react'

export const CreateChannelModal = () => {
  const router = useRouter()
  const params = useParams()
  const { isOpen, onClose, type, data } = useModal()

  const isModalOpen = isOpen && type === 'createChannel'

  const formSchema = z.object({
    name: z
      .string()
      .min(1, { message: 'channel name required' })
      .refine(name => name !== 'general', { message: "channel name cannot be 'general'" }),

    type: z.nativeEnum(ChannelType)
  })
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', type: data.channelType || ChannelType.TEXT }
  })

  useEffect(() => {
    if (data.channelType) {
      form.setValue('type', data.channelType)
    }
  }, [data.channelType, form])

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    try {
      const url = qs.stringifyUrl({ url: '/api/channels', query: { serverId: params?.serverId } })
      await axios.post(url, values)
      form.reset()
      router.refresh()
    } catch (e) {
      console.error(e)
    }
    onClose()
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Create channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-8 px-6'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                    <FormLabel>Channel name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        placeholder='enter channel name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              ></FormField>

              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                    <FormLabel>Channel type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none'>
                          <SelectValue placeholder='select a channel type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map(type => (
                          <SelectItem key={type} value={type} className='capitalize'>
                            {type.toLocaleLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              <DialogFooter className='bg-gray-100 px-6 py-4'>
                <Button variant='primary' disabled={isLoading}>
                  create
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
