'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { resolvedTheme, setTheme } = useTheme()

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
    }, [])

    if (!mounted) return null

    const isDark = resolvedTheme === 'dark'

    return (
        <motion.button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`relative flex items-center justify-between w-14 h-7 rounded-full p-0.5 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 ${isDark
                ? 'bg-linear-to-r from-indigo-600 to-purple-700'
                : 'bg-linear-to-r from-yellow-400 to-orange-500'
                }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Background glow effect */}
            <motion.div
                className={`absolute inset-0 rounded-full blur-md opacity-50 ${isDark
                    ? 'bg-linear-to-r from-indigo-600 to-purple-700'
                    : 'bg-linear-to-r from-yellow-400 to-orange-500'
                    }`}
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Sun Icon - Left side */}
            <motion.div
                className="relative z-10 flex items-center justify-center ml-0.5"
                animate={{
                    scale: isDark ? 0.8 : 1,
                    opacity: isDark ? 0.5 : 1,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <Sun className="w-4 h-4 text-white" />
            </motion.div>

            {/* Toggle Circle */}
            <motion.div
                className="absolute w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                animate={{
                    x: isDark ? 28 : 2,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                }}
            >
                <motion.div
                    animate={{
                        rotate: isDark ? 360 : 0,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    {isDark ? (
                        <Moon className="w-3 h-3 text-indigo-600" />
                    ) : (
                        <Sun className="w-3 h-3 text-yellow-500" />
                    )}
                </motion.div>
            </motion.div>

            {/* Moon Icon - Right side */}
            <motion.div
                className="relative z-10 flex items-center justify-center mr-0.5"
                animate={{
                    scale: isDark ? 1 : 0.8,
                    opacity: isDark ? 1 : 0.5,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <Moon className="w-4 h-4 text-white" />
            </motion.div>

            {/* Stars decoration (only visible in dark mode) */}
            {isDark && (
                <>
                    <motion.div
                        className="absolute top-0.5 left-4 w-0.5 h-0.5 bg-white rounded-full"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                        className="absolute top-2 left-3 w-0.5 h-0.5 bg-white rounded-full"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    />
                    <motion.div
                        className="absolute bottom-1 left-3.5 w-0.5 h-0.5 bg-white rounded-full"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                    />
                </>
            )}
        </motion.button>
    )
}