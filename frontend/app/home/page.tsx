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

    const handleGenerationSuccess = (newGeneration: Generation) => {
        refetch(); // Refresh the history
        setSelectedGeneration(newGeneration); // Show the new generation
    };

    const handleSelectGeneration = (generation: Generation) => {
        setSelectedGeneration(generation);
    };

    return (
        <div className='flex flex-col w-full h-full p-2'>
            <Navbar></Navbar>
            <div className='flex flex-row h-[92%] w-full p-2 mt-15 gap-3'>
                <div className='w-[80%] h-full rounded-2xl p-2 border shadow-2xl'>
                    <MainSection onGenerationSuccess={handleGenerationSuccess} currentGeneration={selectedGeneration} />
                </div>
                <div className='w-[20%] h-full rounded-2xl p-2 border shadow-2xl'>
                    <SidebarSection generations={generations} isLoading={isLoading} onSelectGeneration={handleSelectGeneration} selectedGenerationId={selectedGeneration?.id} />
                </div>
            </div>
        </div>
    )
}

export default Home