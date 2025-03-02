import UserModel from "@/models/User.models";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/User.models";

export async function POST(request: Request) {
    await dbConnect()

    const {username, content} =  await request.json()

    try {
        const foundUser = await UserModel.findOne({username})

        if(!foundUser) {
            return Response.json({
                success: false,
                message: "User not found, while sending message, in send-message route",
            }, {status: 404})
        }

        // check if user is accepting messages or not
        if(!foundUser.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting messages, in send-message route",
            }, {status: 403})
        }

        const newMessage = {
            content,
            createdAt: new Date()
        }

        foundUser.messages.push(newMessage as Message)
        await foundUser.save()

        return Response.json({
            success: true,
            message: "Message sent successfully",
        }, {status: 200})

    } catch (error) {
        console.log('error sending message, in send-message route : ', error);
        return Response.json({
            success: false,
            message: "Error while sending message, in send-message route",
        }, {status: 500})
    }
}