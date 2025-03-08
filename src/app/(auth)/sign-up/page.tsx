"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import Link from "next/link";
import { BadgeCheck, BadgeX, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 200);
  const router = useRouter();

  // zod implementation in form
  const form = useForm({
    resolver: zodResolver<z.infer<typeof signUpSchema>>(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // sending request to "check-username-unnique" endpoint when debouncedUsername changes and updating the usernameMessage state
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const result = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(result.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          console.error(
            axiosError,
            "error while checking username in sign-up page"
          );
          if (axiosError?.response?.data?.errors) {
            const errorMessage = Array.isArray(
              axiosError?.response?.data?.errors
            )
              ? axiosError?.response?.data?.errors[0]
              : axiosError?.response?.data?.errors;
            setUsernameMessage(errorMessage);
          } else {
            setUsernameMessage(
              axiosError?.response?.data?.message || "Something went wrong"
            );
          }
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [username]);
  // console.log(usernameMessage, 'usernameMessage');

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);

      if (response?.data?.success) {
        toast.info(response?.data?.message);
      } else {
        toast.error(response?.data?.errors);
      }
      // creating a page for this and calling "verify-code" route from the created page
      router.replace(`verify/${username}`);
    } catch (error) {
      console.error("Error while user signup : ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data?.message;
      toast.error(errorMessage, {
        description: "SignUp failed!!!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Toaster richColors />
      <div className="w-full max-w-md space-y-8 bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join MstryMessage
          </h1>
          <p className="mb-4">SignUp to start your anonymus advneture</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 space-x-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="John Doe"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <p
                    className={`text-sm ${usernameMessage === "username is unique" ? "text-green-500" : "text-red-500"}`}
                  >
                    {usernameMessage === "username is unique" ? (
                      <span className="flex items-center">
                        <BadgeCheck className="mr-2 h-4 w-4" />
                        {usernameMessage}
                      </span>
                    ) : (
                      <span>
                        {usernameMessage && (
                          <div className="flex items-center">
                            <BadgeX className="mr-2 h-4 w-4" />
                            {usernameMessage}
                          </div>
                        )}
                      </span>
                    )}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                </>
              ) : (
                "SignUp"
              )}
            </Button>
          </form>
        </Form>
        <div>
          <div className="text-center mt-4">
            <p>
              Already a member?{" "}
              <Link
                href="/sign-in"
                className="text-blue-500 hover:underline hover:text-blue-800"
              >
                Sign-in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
