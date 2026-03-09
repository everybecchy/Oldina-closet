import { cookies } from "next/headers"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

const SESSION_COOKIE_NAME = "oldina_session"
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 dias

export interface SessionUser {
  id: string
  email: string
  name: string | null
  isAdmin: boolean
}

// Criar hash de senha
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Verificar senha
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Criar token de sessão simples (base64 do id + timestamp)
function createSessionToken(userId: string): string {
  const data = JSON.stringify({ userId, timestamp: Date.now() })
  return Buffer.from(data).toString("base64")
}

// Decodificar token de sessão
function decodeSessionToken(token: string): { userId: string; timestamp: number } | null {
  try {
    const data = Buffer.from(token, "base64").toString("utf-8")
    return JSON.parse(data)
  } catch {
    return null
  }
}

// Criar sessão
export async function createSession(userId: string): Promise<void> {
  const token = createSessionToken(userId)
  const cookieStore = await cookies()
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })
}

// Obter usuário da sessão
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  
  if (!token) return null
  
  const decoded = decodeSessionToken(token)
  if (!decoded) return null
  
  // Verificar se o token não expirou
  const tokenAge = Date.now() - decoded.timestamp
  if (tokenAge > SESSION_MAX_AGE * 1000) {
    await destroySession()
    return null
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true,
      },
    })
    
    return user
  } catch {
    return null
  }
}

// Destruir sessão
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

// Verificar se é admin
export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser()
  
  if (!user || !user.isAdmin) {
    throw new Error("Acesso não autorizado")
  }
  
  return user
}

// Verificar se está logado
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser()
  
  if (!user) {
    throw new Error("Não autenticado")
  }
  
  return user
}
