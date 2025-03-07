import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import Router, { useRouter } from "next/router";
import { useParams } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import { AxiosError } from "axios";

export async function DELETE(req: Request) {

    const params = useParams<{messageId: string}>();
    const messageId = params.messageId

    await dbConnect();

    console.log(messageId, 'messageId from delete route');

    const session = await getServerSession(authOptions);

    if(!session || !session?.user) {
        return Response.json({
            success: false,
            message: "You are not authenticated. Please login",
        }, {status: 401})
    }

    const user: User = session?.user

    try {

        const updatedResult = await UserModel.updateOne(
            {id: user._id},
            {$pull: {messages: {_id: messageId}}}
        )

        if(updatedResult.modifiedCount == 0) {
            return Response.json({
                success: false,
                message: "Message not found or already deleted, in deleting message route",
            }, {status: 404})
        }

        return Response.json({
            success: true,
            message: "Message deleted successfully",
        },{status: 200})
        
    } catch (error) {
        const AxiosError = error as AxiosError<ApiResponse>
        console.error('Error while deleting message : ', AxiosError?.response?.data?.message);
        return Response.json({
            success: false,
            message: AxiosError?.response?.data?.message,
        }, {status: AxiosError?.response?.status})
    }
}