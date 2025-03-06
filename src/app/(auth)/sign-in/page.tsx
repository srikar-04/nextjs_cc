'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form"
import * as z from "zod"
import Link from "next/link"
import { BadgeCheck, BadgeX, Loader2 } from 'lucide-react'
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"

const page = () => {

  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  // zod implementation in form
  const form = useForm({
    resolver: zodResolver<z.infer<typeof signInSchema>>(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await signIn('Credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })
      console.log(result, 'result in sign-in page');
      if(result?.error) {
        toast.error(result.error)
      } else {
        toast.info('sign-in successful')
      }
      setIsSubmitting(false)
      if(result?.url) {
        router.replace('/dashboard')
      }
    } catch (error) {
      const AxiosError = error as AxiosError<ApiResponse>
      console.error('Error while signing in : ', AxiosError)
      toast.error(AxiosError?.response?.data?.message)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Toaster richColors />
      <div className="w-full max-w-md space-y-8 bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join MstryMessage
          </h1>
          <p className="mb-4">
            SignIn to start your anonymus advneture
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 space-x-4">
          <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="email" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password"
                  placeholder="password" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
          ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
            </>
          ) 
          : "SignIn" }
        </Button>
          </form>
        </Form>
        <div>
          <div className="text-center mt-4">
            <p>
              Not a member?{' '}
              <Link href="/sign-up" className="text-blue-500 hover:underline hover:text-blue-800">
                Sign-In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page