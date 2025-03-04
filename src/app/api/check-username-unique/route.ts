import { z } from "zod";
import UserModel from "@/models/User.models";
import dbConnect from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request)  {  // this "Request" is predefinied Interface
    await dbConnect();

    try {

        const { searchParams }  = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        // validation with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        if(!result?.success) {
            const usernamError = result.error.format().username?._errors || []  // .format is used to just structurize errors into array of objects
            return Response.json({
                success: false,
                message: 'Invalid username',
                errors: usernamError.length > 0 ? usernamError.join(', ') : 'Invalid query parameter'
            }, { status: 400 })
        }

        const { username } = result.data // this data contains the username ->> check zod docs while using safeParse

        const exsistingVerifiedUser = await UserModel.findOne({username, isVerified: true})
        

        if(exsistingVerifiedUser) {
            return Response.json({
                success: false,
                message: 'username already taken',
                error: 'username already taken'
            }, {status: 400})
        }

        return Response.json({
            success: true,
            message: 'username is unique'
        })
        
    } catch (error) {
        console.error('error checking unique usernam: ', error)
        return Response.json({   // this response is also an interface
            success: false,
            message: 'Error checking unique username'
        }, {status: 500})
    }
}