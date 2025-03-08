import NextAuth from "next-auth";
import { authOptions } from "./options";

// the handler contains "Response Instance" [instance formed by calling Response() constructor]
// this handler manages all the "AUTHENTICATED" routes dynamically -->> like /api/auth/signin, /api/auth/signout like that
// handler is only meant to "auth routes" (i.e. files inside /api/auth/* folder)
// for non authenticated routes, when we need authentication, like user session details or token details
// we use "getServerSession()" method in server side and "getSession()" or "useSession()" method in client side

// NOTES : 
//When you define a /pages/api/auth/[...nextauth] JS/TS file and when you writeNextAuth() function, you instruct NextAuth.js,that
//every API request beginning with /api/auth/* should be handled by the code written in the this file.


// https://next-auth.js.org/configuration/initialization -->> see documentation of nextAuth for more information

const handler = NextAuth(authOptions);


export {handler as GET, handler as POST}