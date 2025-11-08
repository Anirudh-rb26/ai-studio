
"use client"

import { Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ImageDropzone from '@/components/image-dropzone'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '@/components/ui/input-group'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Generation } from '@/lib/api'
import { useState } from 'react'
import { useGenerate } from '@/hooks/useGenerate'
import Image from 'next/image'

interface MainSectionProps {
    onGenerationSuccess: (generation: Generation) => void;
    currentGeneration: Generation | null;
}

const MainSection = ({ onGenerationSuccess, currentGeneration }: MainSectionProps) => {
    const [image, setImage] = useState<File | null>(null);
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState('realistic');

    const { generate, abort, isGenerating, error, retryCount, maxRetries } = useGenerate(onGenerationSuccess);

    const handleGenerate = async () => {
        if (!image || !prompt.trim()) {
            return;
        }

        try {
            await generate(image, prompt, style);
            setImage(null);
            setPrompt('');
        } catch (err) {
            console.error('Generation Failed: ', err);
        }
    }

    const canGenerate = image && prompt.trim() && !isGenerating;

    const currentImageUrl = currentGeneration
        ? (currentGeneration.imageUrl.startsWith('http')
            ? currentGeneration.imageUrl
            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${currentGeneration.imageUrl}`)
        : null;


    return (
        <div className='w-full h-full rounded-2xl flex flex-col gap-y-3 justify-between'>
            <div className='w-full h-[80%]'>
                {currentGeneration && currentImageUrl ? (
                    <div className="relative w-full h-full rounded-xl overflow-hidden border">
                        <img
                            src={currentImageUrl}
                            alt={currentGeneration.prompt}
                            className="w-full h-full object-contain bg-gray-50"
                        />
                        <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg">
                            <p className="text-sm font-medium">{currentGeneration.prompt}</p>
                            <p className="text-xs text-gray-300 mt-1 capitalize">Style: {currentGeneration.style}</p>
                        </div>
                    </div>
                ) : (
                    <ImageDropzone
                        onImageSelect={setImage}
                        currentImage={image}
                        disabled={isGenerating}
                    />
                )}
            </div>
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="text-sm font-medium">
                        {error}
                        {retryCount > 0 && ` (Retry ${retryCount}/${maxRetries})`}
                    </p>
                </div>
            )}
            {isGenerating && retryCount > 0 && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                    <p className="text-sm font-medium">
                        Model overloaded. Retrying... (Attempt {retryCount + 1}/{maxRetries + 1})
                    </p>
                </div>
            )}
            <div className='w-full h-[20%]'>
                <InputGroup className='w-full h-full! shadow-2xl light:bg-gray-100 border border-gray-400'>
                    <InputGroupTextarea
                        placeholder="Enter your prompt. (Eg. Stylized , 90's vintage style....)"
                        className='w-full h-full resize-none'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={isGenerating}
                    />
                    <InputGroupAddon align={'block-end'} className='flex flex-row justify-end'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <InputGroupButton variant="ghost" disabled={isGenerating}>
                                    {style === 'realistic' && 'Realistic'}
                                    {style === 'artistic' && 'Artistic'}
                                    {style === 'minimalist' && 'Minimalist'}
                                </InputGroupButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="start"
                                className="[--radius:0.95rem]"
                            >
                                <DropdownMenuItem onClick={() => setStyle('realistic')}>
                                    Realistic
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStyle('artistic')}>
                                    Artistic
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStyle('minimalist')}>
                                    Minimalist
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {isGenerating ? (
                            <Button onClick={abort} variant="destructive" size="sm">
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                        ) : (
                            <Button onClick={handleGenerate} disabled={!canGenerate} size="sm">
                                <Send className="w-4 h-4" />
                            </Button>
                        )}
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </div>
    )
}

export default MainSection