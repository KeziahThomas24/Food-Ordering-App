import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <div className='h-12 text-red-500 p-4 flex items-center justify-between border-b-2 border-b-blue-500 uppercase md:h-24'>
        <Link href='/'>Food Delivery</Link>
        <ul className='xl:flex hidden text-small gap-7'>

        </ul>
    </div>
    
  )
}

export default Navbar