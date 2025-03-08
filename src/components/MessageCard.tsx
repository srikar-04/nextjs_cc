"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/User.models";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";

type MessageCardProp = {
  message: Message,
  onMessageDelete: (MessageId: string) => void
}

function MessageCard({ message, onMessageDelete }: MessageCardProp) {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
      console.log(response, 'response||||||||||||||||||||||||||||')
      if(response?.data.success) toast.info(response?.data.message || 'successfully deleted message')
      onMessageDelete(message._id)
    } catch (error) {
      let axiosError = error as AxiosError<ApiResponse>
      console.error(axiosError, 'error while deleting message');   
    }
  }
  return (
    <Card className="border ">
    <div className="flex items-center justify-between w-full p-4">
      <CardContent className="p-0 flex-1">
        {message?.content}
      </CardContent>
      
      <div className="ml-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive"><X className="w-10 h-6" /></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                response and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  </Card>
  );
}

export default MessageCard;
