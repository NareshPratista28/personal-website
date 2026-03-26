import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
	pages: {
		signIn: '/admin/login',
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user
			const isOnAdmin = nextUrl.pathname.startsWith('/admin')
			const isLoginPage = nextUrl.pathname === '/admin/login'

			if (isOnAdmin) {
				if (isLoginPage) {
					if (isLoggedIn) return Response.redirect(new URL('/admin', nextUrl))
					return true
				}
				if (isLoggedIn) return true
				return false // Redirect unauthenticated users to login page
			}
			return true
		},
		async session({ session, token }) {
			if (token?.sub && session.user) {
				session.user.id = token.sub
			}
			return session
		},
		async jwt({ token, user }) {
			if (user) {
				token.sub = user.id
			}
			return token
		},
	},
	providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
