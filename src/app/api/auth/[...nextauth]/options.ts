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
    callbacks: {
        // -->> the use here is "nextAuth's built in type" it has nothing to do with the User Interface that we have declared in the model <<--
        async jwt({ token, user }) {
            // dumping information inside token, so that we donot need to call db everytime
            if(user) {  // this is the user that we are getting from db inside authorize callback inside credentialsProvoder
                token._id = user._id?.toString()
                token.username = user.username
                token.isAcceptingMessage = user.isAcceptingMessage
                token.isVerified = user.isVerified
            }
            return token
        },
        async session({ session, token }) {

            if(token) {
                session.user._id = token._id
                session.user.username  = token.username
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.isVerified = token.isVerified
            }
           
            return session
        },
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET
}