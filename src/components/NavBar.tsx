'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'  // useSession is a react hook which is used to get the session data
import { User } from 'next-auth'
import { Button } from './ui/button'

function NavBar() {
    const {data: session} = useSession()

    const user: User = session?.user
    
  return (
   <nav className='p-4 md:p-6 shadow-md border border-red-500'>
    <div className='flex flex-col mx-auto md:flex-row justify-between items-center border '>
        <a className='text-4xl font-bold mb-4 md:mb-0' href="#">Mstry Message</a>
        {
            session 
            ?  (
                <>
                    <span className='font-semibold text-lg transition-all hover:scale-110 p-3 ease-in-out duration-100 '>Welcome {user?.username || user?.email}</span> 
                    <Button className='w-full cursor-pointer md:w-auto' variant="destructive" onClick={() => signOut()}>Logout</Button>
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