'use client';

import React from 'react';
import { Generation } from '@/lib/api';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImageCardProps {
    generation: Generation;
    onClick?: () => void;
    isSelected?: boolean;
}

const ImageCard = ({ generation, onClick, isSelected }: ImageCardProps) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Handle both absolute and relative URLs
    const imageUrl = generation.imageUrl.startsWith('http')
        ? generation.imageUrl
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${generation.imageUrl}`;

    return (
        <div
            onClick={onClick}
            className={cn(
                'w-full rounded-lg overflow-hidden border cursor-pointer',
                isSelected && 'border-2 border-gray-200',
            )}
        >
            <div className="aspect-square w-full overflow-hidde">
                <Image
                    height={100}
                    width={100}
                    src={imageUrl}
                    alt={generation.prompt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                />
            </div>
            <div className="p-2 ">
                <p className="text-xs text-gray-700 line-clamp-2 font-medium">
                    {generation.prompt}
                </p>
                <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500 capitalize">{generation.style}</span>
                    <span className="text-xs text-gray-400">{formatDate(generation.createdAt)}</span>
                </div>
            </div>
        </div>
    );
};

export default ImageCard;