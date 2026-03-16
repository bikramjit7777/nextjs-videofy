import { NextAuthOptions } from "next-auth";
import { connectToDatabase } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) { 
                if(!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }
                try { 
                    await connectToDatabase();
                    const user = await User.findOne({email: credentials.email, password: credentials.password});
                    if(!user) {
                        throw new Error("No user found with the provided credentials");
                    }
                    const isValid = await bcrypt.compare(credentials.password, user.password);
                    if(!isValid) {
                        throw new Error("Invalid password");
                    }
                    return {
                        id: user._id.toString(),
                        email: user.email
                    }
                } catch(error) {
                    console.error("Authentication error:", error);
                    throw new Error("An error occurred while trying to authenticate the user");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if(user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if(session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
        // async redirect({ url, baseUrl }) {
        //     baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        //     return baseUrl;
        // }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET,
}
    
