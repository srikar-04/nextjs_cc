import NavBar from '@/components/NavBar'
import React from 'react'

function layout({children}: {children: React.ReactNode}) {
  return (
    <main>
      <NavBar />
      {children}
    </main>
  )
}

export default layout