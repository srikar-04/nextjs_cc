'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react' // useSession is a react hook which is used to get the session data in "client side"
import { User } from 'next-auth'                        // getServerSession() is used in server side
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'

function NavBar() {
    const {data: session, status} = useSession()

    const user: User = session?.user

    if(status === 'loading') {
        return (
            <>
                <div className='w-full h-screen flex items-center justify-center'>
                    <Loader2 className='animate-spin h-10 w-10'/>
                </div>
            </>
        )
    }
    
  return (
   <nav className='p-4 md:p-6 shadow-md'>
    <div className='flex flex-col mx-auto md:flex-row justify-between items-center  '>
        <a className='text-4xl font-bold mb-4 md:mb-0' href="#">Mstry Message</a>
        {
            session 
            ?  (
                <>
                    {/* callbackUrl is used to redirect the user to the home page after logout instead of signin page */}
                    <span className='font-semibold text-lg transition-all hover:scale-110 p-3 ease-in-out duration-100 '>Welcome {user?.username || user?.email}</span> 
                    <Button className='w-full cursor-pointer md:w-auto' variant="destructive" onClick={() => signOut({callbackUrl: '/'})}>Logout</Button>
                </>
            )
            :  <>
                <Link href="/sign-in">
                    <Button className='w-full md:w-auto'>Sign In</Button>
                </Link>
            </>
        }
    </div>
   </nav>
  )
}

export default NavBar