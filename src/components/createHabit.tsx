"use client";

import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  createdById: z.string(),
  createdAt: z.date(),
  updatedAt: z.array(z.date()),
  counter: z.number(),
});

export function CreateHabit() {
  const utils = api.useUtils();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      createdById: "",
      createdAt: new Date(),
      updatedAt: [],
      counter: 0,
    },
  });

  const createHabit = api.habits.create.useMutation({
    onSuccess: async () => {
      form.reset();
      utils.habits.invalidate().catch((err) => console.log(err));
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const submitHandle = (data: z.infer<typeof formSchema>) => {
    createHabit.mutate(data);
  };

  return (
    <Card className="mx-auto max-w-md shadow-lg">
      <CardHeader className="text-center text-lg font-semibold">
        Create Habit
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandle)}
            className="space-y-4"
          >
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <input
                  {...form.register("name")}
                  placeholder="Enter habit name"
                  className="w-full border border-gray-300 p-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <input
                  {...form.register("description")}
                  placeholder="Enter habit description"
                  className="w-full border border-gray-300 p-2"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <Button
              type="submit"
              className="w-full hover:bg-white hover:text-black hover:outline"
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
