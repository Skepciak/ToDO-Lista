'use server'

import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!name || !email || !password) {
        return { error: 'Wszystkie pola są wymagane' }
    }

    if (password !== confirmPassword) {
        return { error: 'Hasła nie są identyczne' }
    }

    if (password.length < 6) {
        return { error: 'Hasło musi mieć minimum 6 znaków' }
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        return { error: 'Użytkownik z tym emailem już istnieje' }
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: 'user'
        }
    })

    return { success: true }
}

export async function loginUser(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Email i hasło są wymagane' }
    }

    try {
        await signIn('credentials', {
            email,
            password,
            redirect: false
        })
        return { success: true }
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return { error: 'Nieprawidłowy email lub hasło' }
                default:
                    return { error: 'Wystąpił błąd podczas logowania' }
            }
        }
        throw error
    }
}

export async function loginWithGoogle() {
    await signIn('google', { redirectTo: '/' })
}
