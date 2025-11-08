"use client"

import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import React, { useState, useRef, useCallback } from 'react'

interface ImageDropzoneProps {
    onImageSelect: (file: File | null) => void;
    currentImage: File | null;
    disabled: boolean;
}

const ImageDropzone = ({ onImageSelect, currentImage, disabled }: ImageDropzoneProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState<boolean>(false)

    const validateFile = (file: File): boolean => {
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            setError('Only JPEG and PNG files are allowed');
            return false;
        }

        // Check file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError('File size must be less than 10MB');
            return false;
        }

        setError(null);
        return true;
    };

    const handleFile = useCallback((file: File) => {
        if (validateFile(file)) {
            onImageSelect(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [onImageSelect]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFile(files[0])
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFile(files[0])
        }
    }

    const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="h-full w-full">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileInput}
                className="hidden"
            />

            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`h-full w-full rounded-lg border-2 transition-all cursor-pointer relative overflow-hidden ${isDragging
                    ? 'border-blue-500 bg-blue-200'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-10'
                    }`}
            >
                {preview ? (
                    <div className="h-full w-full relative group">
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="h-full w-full object-contain"
                        />
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                            <button
                                onClick={handleRemove}
                                className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center gap-4 p-8">
                        <Upload
                            size={48}
                            className={`transition-colors ${isDragging ? 'text-blue-500' : 'text-gray-400'
                                }`}
                        />
                        <div className="text-center">
                            <p className="text-lg font-medium text-gray-700">
                                {isDragging ? 'Drop image here' : 'Drop image or click to upload'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                JPEG or PNG, max 10MB
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ImageDropzone