import React from 'react'
import { Card } from './ui/card'
import { ThemeToggle } from './theme-toggle'

const Navbar = () => {
    return (
        <Card className='fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-full h-12 flex flex-row justify-between items-center px-10 py-2 z-50'>
            <h1>AI Studio</h1>
            <ThemeToggle />
        </Card>
    )
}

export default Navbar