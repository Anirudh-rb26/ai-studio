import React from 'react'
import { History } from 'lucide-react'
import ImageCard from '@/components/image-card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Generation } from '@/lib/api'
import { Spinner } from '@/components/ui/spinner'

interface SidebarSectionProps {
    generations: Generation[];
    isLoading: boolean;
    onSelectGeneration: (generation: Generation) => void;
    selectedGenerationId?: number;
}

const SidebarSection = ({ generations, isLoading, onSelectGeneration, selectedGenerationId }: SidebarSectionProps) => {
    return (
        <div className='w-full h-full p-2 flex flex-col gap-2 shadow-2xl'>
            <div className='flex flex-row gap-2 items-center'>
                <History />
                <h1>History</h1>
                {isLoading && <Spinner />}
            </div>
            <Separator />
            <ScrollArea className='w-full overflow-hidden'>
                <div className='flex flex-col gap-2 mr-3'>
                    {generations.length === 0 && !isLoading ? (
                        <div className="text-center py-8 px-4">
                            <p className="text-sm text-gray-500">
                                No generations yet.
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Create your first one!
                            </p>
                        </div>
                    ) : (
                        generations.map((generation) => (
                            <ImageCard
                                key={generation.id}
                                generation={generation}
                                onClick={() => onSelectGeneration(generation)}
                                isSelected={selectedGenerationId === generation.id}
                            />
                        ))
                    )}
                </div>
                <ScrollBar className='' />
            </ScrollArea>
        </div>
    )
}

export default SidebarSection