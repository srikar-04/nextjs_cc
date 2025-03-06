import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import Router, { useRouter } from "next/router";
import { useParams } from "next/navigation";

export async function DELETE(req: Request) {
    await dbConnect();

    const params = useParams<{messageId: string}>();
    const messageId = params.messageId

    console.log(messageId, 'messageId from delete route');

    const session = await getServerSession(authOptions);

    if(!session || !session?.user) {
        return Response.json({
            success: false,
            message: "You are not authenticated. Please login",
        }, {status: 401})
    }

    const user: User = session?.user

    
}