// src/types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            username: string; // Add this
        } & DefaultSession["user"];
    }

    interface User {
        username: string; // Add this
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username: string; // Add this
    }
}