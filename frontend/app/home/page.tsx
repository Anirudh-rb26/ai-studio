"use client"

import { Generation } from '@/lib/api'
import React, { useState } from 'react'
import Navbar from '@/components/navbar'
import MainSection from './main-section'
import SidebarSection from './sidebar-section'
import { useGenerations } from '@/hooks/useGeneration'

const Home = () => {
    const { generations, isLoading, refetch } = useGenerations();
    const [selectedGeneration, setSelectedGeneration] = useState<Generation | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleGenerationSuccess = (newGeneration: Generation) => {
        refetch();
        setSelectedGeneration(newGeneration);
        setSidebarOpen(false);
    };

    const handleSelectGeneration = (generation: Generation) => {
        setSelectedGeneration(generation);
        setSidebarOpen(false);
    };

    const handleClearGeneration = () => {
        setSelectedGeneration(null);
    };

    return (
        <div className='flex flex-col w-full h-full p-2'>
            <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className='flex flex-row h-[92%] w-full p-2 mt-15 gap-3'>
                {/* Sidebar - hidden on small screens unless open */}
                <div className={`fixed inset-y-0 left-0 bg-background z-50 shadow-2xl p-2 rounded-2xl border overflow-auto transition-transform transform md:relative md:translate-x-0 md:w-[20%] w-[70%] ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <SidebarSection
                        generations={generations}
                        isLoading={isLoading}
                        onSelectGeneration={handleSelectGeneration}
                        selectedGenerationId={selectedGeneration?.id}
                    />
                </div>
                {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}
                {/* Main content - full width on mobile, shrinks on desktop */}
                <div className='flex-1 md:w-[80%] h-full rounded-2xl p-2 border shadow-2xl'>
                    <MainSection
                        onGenerationSuccess={handleGenerationSuccess}
                        currentGeneration={selectedGeneration}
                        onClearGeneration={handleClearGeneration}
                    />
                </div>
            </div>
        </div>
    )
}

export default Home