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
import { Button } from '@/components/ui/button'
import { FileUpload } from './file-upload'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useModal } from '@/hooks/use-modal-store'
import qs from 'query-string'

export const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()
  const isModalOpen = isOpen && type === 'messageFile'
  const { apiUrl, query } = data
  const formSchema = z.object({
    fileUrl: z.string().min(1, { message: 'attachment required' })
  })
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { fileUrl: '' }
  })

  const handleClose = () => {
    form.reset()
    onClose()
  }
  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)

    const url = qs.stringifyUrl({
      url: apiUrl || '',
      query
    })
    try {
      await axios.post(url, { ...values, content: values.fileUrl })
      form.reset()
      router.refresh()
      onClose()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
          <DialogTitle className='text-2xl text-center font-bold'>Add n attachment</DialogTitle>
          <DialogDescription className='text-center text-zinc-500'>
            send a file as a msg
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='space-y-8 px-6'>
              <div className='flex items-center justify-center text-center'>
                <FormField
                  control={form.control}
                  name='fileUrl'
                  render={({ field }) => (
                    <FormItem className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                      <FormLabel>image</FormLabel>
                      <FormControl>
                        <FileUpload
                          endpoint='messageFile'
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage></FormMessage>
                    </FormItem>
                  )}
                ></FormField>
              </div>

              <DialogFooter className='bg-gray-100 px-6 py-4'>
                <Button variant='primary' disabled={isLoading}>
                  send
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
