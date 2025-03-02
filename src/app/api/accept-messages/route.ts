import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import { User } from "next-auth"; // Remember??!!, this is the default user made using default Interface from nextauth!!

// Remember!, while doing authentication(sign-in one) we have an async session method in callbacks
// In this session we have stored all of the user information
// That is what we are exracting here through getServerSession

// getServerSession is a method which is used, in server side, to get the session details(session object) of the user
// getServerSession is prefered on server side and getSession is prefered on client side
// getServerSession atuomatically checks user authentication, before getting the session details
// you may have a doubt then when this getServerSession method checks user authentication before hand, then
// what is the use of middleware???
// getServerSession is used only in some routes, where you want session details
// while middleware can be used for every route and middleware is loaded first before aloding the app routes or api routes
// therefore even preventing loading of page and user entering the page, while getServerSession does not do this
// it loads page before hand and checks for the authentication

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if(!session || !user) {
        return Response.json({
            success: false,
            message: "You are not authenticated. Please login",
        }, {status: 401})
    }
    
    const userId = user?._id

    const { acceptMessages } = await request.json();
    
    try {

        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage: acceptMessages
            },
            {
                new: true
            }
        )

        if(!updatedUser) {
            return Response.json({
                success: false,
                message: "User not found, checking while accepting messages",
            }, {status: 404})
        }
        
        return Response.json({
            success: true,
            message: "Updated user message acceptance status successfully",
            user: updatedUser
        }, {status: 200})
       
    } catch (error) {
        console.log('error accepting messages, in acceptMessages route : ', error);
        return Response.json({
            success: false,
            message: "Error accepting messages, please try again",
        }, {status: 500})
    }
}

export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if(!session || !user) {
        return Response.json({
            success: false,
            message: "You are not authenticated. Please login",
        }, {status: 401})
    }

    const userId = user?._id

    try {
        const foundUser = await UserModel.findById(userId)

        if(!foundUser) {
            return Response.json({
                success: false,
                message: "User not found, checking while accepting messages",
            }, {status: 404})
        }

        return Response.json({
            success: true,
            message: "message acceptance status checked successfully",
            isAcceptingMessage: foundUser.isAcceptingMessage
        }, {status: 200})

    } catch (error) {
        console.log('error getting messages, in acceptMessages route : ', error);
        return Response.json({
            success: false,
            message: "Error getting messages, please try again",
        }, {status: 500})
    }
}