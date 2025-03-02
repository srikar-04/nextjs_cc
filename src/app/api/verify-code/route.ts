import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.models";

export async function POST(request: Request) {
    await dbConnect()
    try {

        const { username, code }: {username: string, code: string} = await request.json();

        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({username: decodedUsername})

        if(!user) {
            return Response.json({
                success: false,
                message: 'User not found while verifying code'
            }, {status: 404})
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user?.verifyCodeExpiry) > new Date();

        if(!isCodeValid || !isCodeNotExpired) {
           if(!isCodeValid) {
                return Response.json({
                    success: false,
                    message: 'Invalid code'
                }, {status: 400})
           } else {
                return Response.json({
                    success: false,
                    message: 'Code has expired. Please signup again'
                }, {status: 400})
           }
        }

        user.isVerified = true
        await user.save()

        return Response.json({
            success: true,
            message: 'user verified sucesfully'
        }, {status: 201})
        
    } catch (error) {
        console.error('Error verifiying code',error);
        Response.json({
            success: false,
            message: 'Failed to verify code'
        }, {status: 500})
    }
}