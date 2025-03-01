import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import UserModel from "@/models/User.models";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
                id: "Credentials",
                name: "Credentials",       
                credentials: {
                    email: { label: "email", type: "text ", placeholder: "john@email.com" },
                    password: { label: "Password", type: "password" },
                },
                authorize: async (credentials, req): Promise<any> => {
                    await dbConnect()
                    try {
                        if (!credentials) {
                            throw new Error("Credentials not provided");
                        }
                        const { email, password } = credentials;

                        const user = await UserModel.findOne({email})

                        if(!user) {
                            throw new Error('no user found with provided credentials')
                        }

                        if(!user?.isVerified) {
                            throw new Error('Please verify your account first')
                        }

                        // decrypting password
                        const decryptedPassword = await bcrypt.compare(password, user.password)

                        if(decryptedPassword) {
                           return user  
                        } else {
                            throw new Error('Incorrect password')
                        }
                        
                    } catch (error: any) {
                        // throwing error here is necessary
                        // when error is thrown nextjs automatically redirects to error page displaying the error
                        throw new Error(error)
                    }
                },
            }),
        // GoogleProvider(),
        // GitHubProvider()
    ],
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET
}