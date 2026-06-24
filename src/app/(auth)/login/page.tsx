"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleCredentialsSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    
    await signIn("credentials", { 
      email, 
      password,
      callbackUrl: "/dashboard"
    })
    setIsLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await signIn("google")
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-mesh">
      <div className="w-full max-w-md p-8 rounded-2xl glass-dark shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 bg-purple-500/20 blur-3xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
          <p className="text-zinc-400">Sign in to your MailingPerson account</p>
        </div>

        <div className="relative z-10 space-y-4">
          <form
            onSubmit={handleCredentialsSignIn}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-zinc-500 transition-all"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-zinc-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all"
            >
              Sign In
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-zinc-500">Dont have an account?</span>
            </div>
          </div>

          <a
            href="/register"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-900/50 border border-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-800 transition-all"
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
  )
}
