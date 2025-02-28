import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";  // this is the template of the email that is sent to user
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail( email: string, username: string, verifyCode: string):Promise<ApiResponse>  {

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        return {
            success: true,
            message: 'verification email sent succesfully'
        }
    } catch (error) {
        console.error('Error while sending email verification : ', error)
        return {
            success: false,
            message: 'Failed to send verification email'
        }
    }
   
}