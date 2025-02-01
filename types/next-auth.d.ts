import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    /**
     * Make these optional so TypeScript won't complain if they don't exist.
     */
    id?: string
    isSubscribed?: boolean
  }

  interface Session {
    user?: User
  }
}

declare module "next-auth/jwt" {
  /**
   * This will ensure token can have these fields 
   * without strict TypeScript errors.
   */
  interface JWT {
    id?: string
    isSubscribed?: boolean
  }
}

