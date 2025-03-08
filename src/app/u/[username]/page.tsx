"use client";
import { messagesSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

function page() {
  const { status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useParams<{ username: string }>();
  const username = params.username as string;

  const form = useForm<z.infer<typeof messagesSchema>>({
    resolver: zodResolver(messagesSchema),
    defaultValues: {
      content: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof messagesSchema>) => {
    setIsSubmitting(true)
    try {
      const AcceptResponse = await axios.get<ApiResponse>('/api/accept-messages')

      if(!AcceptResponse?.data?.isAcceptingMessage) {
        toast.error('User is not accepting messages')
        form.reset()
        return
      }

      const response = await axios.post<ApiResponse>("/api/send-message", {
        username, 
        content: data.content
      });

      if(response?.data?.success) {
        toast.info(response?.data?.message || 'Successfully sent anonymous message')
        form.reset()
      } else {
        toast.info(response?.data?.message || 'Failed to send message')
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError?.response?.data?.message || 'Error while sending anonymous message')
    } finally {
      setIsSubmitting(false)
    }
  };

  const handleSuggestMessages = async () => {
    try {
      console.log('hello world')
    } catch (error) {
      const AxiosError = error as AxiosError<ApiResponse>
      console.error('Error while getting message suggestions : ', AxiosError);
      toast.error(AxiosError?.response?.data?.message || 'Error while getting message suggestions')
    }
  }

  if (status === "loading") {
    return (
      <>
        <div className="w-full h-screen flex items-center justify-center">
          <Loader2
            className="animate-spin h-16 w-16"
            style={{ animationDuration: "0.3s" }}
            strokeWidth={1}
          />
        </div>
      </>
    );
  }
  return (
    <>
      <main className="w-full h-screen flex flex-col gap-8 container mx-auto items-center mt-10">
        <h1 className="font-bold text-5xl ">Public Profile Link</h1>

        <div className="w-full p-8">
          <h1 className="font-semibold mb-0.5">Send Anonymus Messages to @{username}</h1>
          <Toaster richColors />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 space-x-4 w-full"
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        autoComplete="off"
                        className="w-full h-16"
                        placeholder="Type your anonymous message here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Button 
              type="submit" 
              disabled={!form.watch('content') || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                </>
              ) : (
                "Submit"
              )}
            </Button>
            </form>
          </Form>
        </div>

        <div className="w-full mt-6 p-8 border border-red-500">
          <Button onClick={() => handleSuggestMessages()}>Suggest Messages</Button>
        </div>
      </main>
    </>
  );
}

export default page;
