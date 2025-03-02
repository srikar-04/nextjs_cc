import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {

        // in Nextjs always use "await" while taking data from frontend
        const { username, email, password } = await request.json()
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()

        const exsistingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(exsistingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            }, {status: 500})
        }

        const exsistingUserByEmail = await UserModel.findOne({email})

        if(exsistingUserByEmail) {
            // if user already exsists then check whether he is verified or not ("isVerified" field in userModel )
            // if user already exsists and also verified then well and good, return him he donot need to signup
            // if user already exsists but not verified then verify the user and update db
            if(!exsistingUserByEmail.isVerified) {
                const hashedPassword = await bcrypt.hash(password, 10)

                exsistingUserByEmail.password = hashedPassword
                exsistingUserByEmail.verifyCode = verifyCode
                exsistingUserByEmail.verifyCodeExpiry  = new Date(Date.now() + 3600000)
                await exsistingUserByEmail.save()
            } else {
                return Response.json({
                    success: false,
                    message: 'User already signed up, account already exsists with this email'
                },{status: 400})
            }

        } else {
            // if email doesnot exsists then create a new user with that email
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }

        // send verification email

        const emailVerificationResponse = await sendVerificationEmail(
            email, 
            username,
            verifyCode
        )

        if(!emailVerificationResponse.success) {
            return Response.json({
                success: false,
                message: emailVerificationResponse.message
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: 'User registered sucesfully. Please verify your email'
        }, {status: 201})
        
    } catch (error) {
        console.error('error registering user : ', error)
        return Response.json({
            success: false,
            message: 'error registering user'
        },{
            status: 500
        })
    }
}