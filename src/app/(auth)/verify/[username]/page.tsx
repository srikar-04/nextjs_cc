'use client'
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Toaster } from '@/components/ui/sonner';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { verifySchema } from '@/schemas/verifySchema';
// the "square bracket" folder structure is used whenever we are accepting dynamic data in nextjs
function page(request: Request) {

    const [otpValue, setOtpValue] = useState('')
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const params = useParams<{username: string}>()
    const username = params.username as string

    console.log(username, 'username from url');


    const handlesubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        try {
            setLoading(true)
            const validationResult = verifySchema.safeParse({ code: otpValue });
            if (!validationResult.success) {
                // If validation fails, extract the first error message and display it.
                const errorMessage = validationResult.error.errors[0].message;
                toast.error(errorMessage);
                return;
            }
            const response = await axios.post<ApiResponse>('/api/verify-code', {username, code: otpValue.toString()})

            if(response?.data?.success) {
                toast.info(response?.data?.message)
                router.replace(`/sign-in`)
            } else {
                toast.error(response?.data?.message)
            }
        
        } catch (error) {
            const AxiosError = error as AxiosError<ApiResponse>
            console.error('Error while verifiying code : ', AxiosError)
            toast.error(AxiosError?.response?.data?.message)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className='w-full h-screen flex items-center justify-center'>
        <form onSubmit={(e) => handlesubmit(e)} className='p-4 space-y-4 space-x-4 shadow-lg'>
            <Toaster richColors />
            <InputOTP 
                maxLength={6} 
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                onChange={(value) => setOtpValue(value)}
                value={otpValue}
            >
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>
            </InputOTP>
            <div className='text-center text-sm'>
                Enter Verification Code
            </div>
            <Button className='mt-4' type='submit'>
                {loading ? <span className='flex items-center'> <Loader2 className='mr-2 animate-spin' /> Loading...</span> : 'verify' }
            </Button>
        </form>
    </div>
  )
}

export default page