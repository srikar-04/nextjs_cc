'use client'

import { Message } from '@/models/User.models'
import React, { useCallback, useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptMessagesSchema } from '@/schemas/acceptMessageSchema'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [switchLoading, setSwitchLoading] = useState(false)

  // this is optimistic ui update, this method doesn't actually call backend and then updates the state. It first updates the state and then calls backend
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(message => message._id !== messageId ))
  }

  const {data: session, status} = useSession()

  const form = useForm({
    resolver: zodResolver<z.infer<typeof acceptMessagesSchema>>(acceptMessagesSchema),
    defaultValues: {
      acceptMessages: true
    }
  })

  const { register, watch, setValue } = form
  
  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessages = useCallback( async() => {
    setSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages')
      // the type of isAcceptingMessage is boolean | undefined. so !! converts undefined to false
      setValue("acceptMessages", !!response?.data?.isAcceptingMessage)
    } catch (error) {
      const AxiosError = error as AxiosError<ApiResponse>
      toast.error(AxiosError?.response?.data?.message)
    } finally {
      setSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setLoading(true)
    setSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response?.data?.messages || [])
    } catch (error) {
      const AxiosError = error as AxiosError<ApiResponse>
      toast.error(AxiosError?.response?.data?.message)
    }  finally {
      setLoading(false)
      setSwitchLoading(false)
    }
  }, [setLoading, setMessages])

  if(status === 'loading') {
    return (
      <>
        <div className='w-full h-screen flex items-center justify-center'>
          <Loader2 className='animate-spin h-16 w-16' style={{ animationDuration: "0.3s" }} strokeWidth={0.5}/>
        </div>
      </>
    )
}

  return (
    <>
      <Toaster richColors />
      <div>Dashboard </div>
    </>
  )
}

export default DashboardPage