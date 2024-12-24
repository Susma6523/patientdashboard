"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import SubmitButton from "@/components/shared/SubmitButton";
import CustomFormField from "@/components/shared/CustomFormField";

const formSchema = z.object({
  doctor: z.string().min(1, { message: "Please select a doctor" }),
  date: z.string().min(1, { message: "Please select a date" }),
  time: z.string().min(1, { message: "Please select a time" }),
});

export default function BookAppointmentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      doctor: "",
      date: "",
      time: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been successfully booked.",
      });
      router.push("/patient/dashboard/my-appointments");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CustomFormField
              form={form.control}
              name="doctor"
              label="Doctor"
              placeholder="Select Doctor"
            />
            <SubmitButton  isLoading={isLoading}>
              Book Appointment
            </SubmitButton>
          </form>
        </Form>
      </div>
  );
}
