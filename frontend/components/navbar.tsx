import React from 'react'
import { Card } from './ui/card'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'
import { HistoryIcon } from 'lucide-react'

const Navbar = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
    return (
        <Card className='fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-full h-12 flex flex-row justify-between items-center px-4 sm:px-10 py-2 z-50'>
            <Button className="md:hidden text-xl font-bold" onClick={onToggleSidebar} variant={"ghost"}>
                <HistoryIcon />
            </Button>
            <h1 className="flex-1 text-center md:text-left">AI Studio</h1>
            <ThemeToggle />
        </Card>
    )
}


export default Navbar