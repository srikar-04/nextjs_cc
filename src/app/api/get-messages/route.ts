import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GEt(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if(!session || !user) {
        return Response.json({
            success: false,
            message: "You are not authenticated. Please login",
        }, {status: 401})
    }
    
    // converting id, which is a string, to object id because while using aggregation pipeline, it may throw error
    const userId = new mongoose.Types.ObjectId(user?._id)

    try {

        const user = await UserModel.aggregate([
            {$match: {_id: userId}}, // matching the user, by id, in first pipeline
            {$unwind: '$messages'}, // unwinding the messages array
            {$sort: {'messages.createdAt': -1}}, // sorting the messages in descending order
            {$group: {_id: '$_id', messages: {$push: '$messages'}}} // grouping the messages by user id
        ])

        if(!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "User not found, in getting messages route",
            }, {status: 404})
        }

        return Response.json({
            success: true,
            messages: user[0].messages
        }, {status: 200}) 
        
    } catch (error) {
        return Response.json({
            success: false,
            message: "Error while getting messages, in get-message route",
        }, {status: 500})
    }

}