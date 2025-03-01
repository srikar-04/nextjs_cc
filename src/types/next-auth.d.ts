import "next-auth"
import { DefaultSession } from "next-auth"

// adding additional type information to already exsisting interface
declare module 'next-auth' {
    interface User {  // -->> this User interface is "built in " interface by nextAuth which is used while authentication <<--
        _id?: string,
        isVerified?: boolean,
        isAcceptingMessage?: boolean,
        username?: string
    }

    interface Session {
        user: {
            _id?: string,
            isVerified?: boolean,
            isAcceptingMessage?: boolean,
            username?: string
        } & DefaultSession['username']
    }
}

/**
 * this is the default interface of nextAuth's user Interface 
 * so to add extra fields we have to do "augementation" like above (extending interface or adding new fields)
 * 
    export interface User {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    }
**/

declare module 'next-auth/jwt' {
    interface JWT {  // -->> this JWT interface is "built in " interface by nextAuth which is used while authentication <<--
        _id?: string,
        isVerified?: boolean,
        isAcceptingMessage?: boolean,
        username?: string
    }
}