'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function getSystemTheme(): 'light' | 'dark' {
    if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('system')
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
    const [mounted, setMounted] = useState(false)

    // Initialize on mount
    useEffect(() => {
        const stored = localStorage.getItem('theme') as Theme | null
        if (stored && ['light', 'dark', 'system'].includes(stored)) {
            setTheme(stored)
        }
        setMounted(true)
    }, [])

    // Apply theme
    useEffect(() => {
        if (!mounted) return

        const root = document.documentElement
        let newResolvedTheme: 'light' | 'dark'

        if (theme === 'system') {
            newResolvedTheme = getSystemTheme()
        } else {
            newResolvedTheme = theme
        }

        // Remove both classes first, then add the correct one
        root.classList.remove('light', 'dark')
        root.classList.add(newResolvedTheme)

        setResolvedTheme(newResolvedTheme)
        localStorage.setItem('theme', theme)
    }, [theme, mounted])

    // Listen for system theme changes
    useEffect(() => {
        if (!mounted) return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = () => {
            if (theme === 'system') {
                const newResolvedTheme = getSystemTheme()
                document.documentElement.classList.remove('light', 'dark')
                document.documentElement.classList.add(newResolvedTheme)
                setResolvedTheme(newResolvedTheme)
            }
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme, mounted])

    // Prevent hydration mismatch
    if (!mounted) {
        return <>{children}</>
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
