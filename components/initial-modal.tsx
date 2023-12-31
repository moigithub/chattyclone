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
import { useEffect, useState } from 'react'
import { FileUpload } from './file-upload'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  const router = useRouter()

  const formSchema = z.object({
    name: z.string().min(1, { message: 'server name required' }),
    imageUrl: z.string().min(1, { message: 'server image required' })
  })
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', imageUrl: '' }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    try {
      await axios.post('/api/servers', values)
      form.reset()
      router.refresh()
      window.location.reload()
    } catch (e) {
      console.error(e)
    }
  }

  if (!isMounted) {
    return null
  }

  return (
    <Dialog open>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Customize ur server</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            Give ur server a name n image
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-8 px-6'>
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={form.control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                      <FormLabel>image</FormLabel>
                      <FormControl>
                        <FileUpload
                          endpoint='serverImage'
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                    <FormLabel>Server name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        placeholder='enter server name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
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
