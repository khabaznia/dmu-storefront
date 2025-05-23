'use client'

import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { Lock, User } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface LoginFormProps {
  onSubmit?: (username: string, password: string) => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username || !password) {
      setError("Будь ласка, введіть ім'я користувача та пароль")
      return
    }
    setError(null)
    setLoading(true)
    const res = await signIn('credentials', {
      username,
      password,
      redirect: false,
    })
    setLoading(false)
    if (res?.error) {
      setError('Невірний логін або пароль')
    } else {
      router.replace('/dashboard')
    }
    if (onSubmit) {
      onSubmit(username, password)
    }
  }

  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <Card className="w-full sm:w-96">
        <CardHeader>
          <CardTitle>Вхід до системи</CardTitle>
          <CardDescription>Введіть дані для входу в обліковий запис</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Ім'я користувача</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Введіть ім'я користувача"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Пароль</Label>
                <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                  <Link href="#">Забули пароль?</Link>
                </Button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Введіть пароль"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            {error && (
              <div className="text-sm font-medium text-destructive">{error}</div>
            )}
          </CardContent>
          <CardFooter>
            <div className="grid w-full gap-y-4">
              <Button type="submit" disabled={loading}>{loading ? 'Вхід...' : 'Увійти'}</Button>
              <Button variant="link" size="sm" asChild>
                <Link href="/signup">
                  Немає облікового запису? Зареєструватися
                </Link>
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoginForm />
    </div>
  )
}

export default LoginPage 