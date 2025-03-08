'use client'

import { Message } from '@/models/User.models'
import React, { useCallback, useEffect, useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { Loader2, RefreshCcw } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { acceptMessagesSchema } from '@/schemas/acceptMessageSchema'
import * as z from 'zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import MessageCard from '@/components/MessageCard'

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

  useEffect( () => {
    if(!session || !session?.user) return
    fetchMessages()
    fetchAcceptMessages()
  }, [session, setValue, fetchAcceptMessages, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {acceptMessages: !acceptMessages})
      setValue('acceptMessages', !acceptMessages)
      toast.info(response?.data?.message)
    } catch (error) {
      const AxiosError = error as AxiosError<ApiResponse>
      toast.error(AxiosError?.response?.data?.message)
    }
  }

  const {username} = session?.user
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.info('profile url copied to clipboard')
  }

  if(status === 'loading') {
    return (
      <>
        <div className='w-full h-screen flex items-center justify-center'>
          <Loader2 className='animate-spin h-16 w-16' style={{ animationDuration: "0.3s" }} strokeWidth={0.5}/>
        </div>
      </>
    )
  }

  if(status == 'unauthenticated') {
    return (
      <>
        <div className='w-full h-screen flex items-center justify-center text-2xl'>
          <h1>Unauthenticated. Please Login!!!</h1>
        </div>
      </>
    )
  }

  return (
    <>
      <Toaster richColors />
      <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
        <h1 className='text-4xl font-bold mb-4'>
          User Dashboard
        </h1>

        <div className='mb-4'>
          <h2 className='text-lg font-semibold mb-2'>Copy Your Unique Link</h2>{' '}
          <div className='flex items-center'>
            <input 
              type="text" 
              value={profileUrl}
              disabled
              className='input input-bordered w-full p-2 mr-2'
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        <div className='mb-4'>
          <Switch 
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={switchLoading} 
          />
          <span className='ml-2'>
            Accept Messages: {acceptMessages ? 'On' : 'Off'}
          </span>
        </div>
        <Separator />

        <Button 
          className='mt-4'
          variant='outline'
          onClick={(e) => {
            e.preventDefault()
            fetchMessages(true)
          }}
        >
          {
            loading 
            ? <Loader2 className='h-4 w-4 animate-spin'/>
            : <RefreshCcw className='h-4 w-4'/>
          }
        </Button>

        <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
          {messages.length > 0 ? (
            messages.map((message) => (
              <MessageCard 
                key={message.id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          )
          : (
            <p>No Message To Display</p>
          )
        }
        </div>
      </div>
    </>
  )
}

export default DashboardPage