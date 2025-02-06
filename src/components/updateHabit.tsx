"use client";

import { api } from "@/trpc/react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
  } from "@/components/ui/card";

  import {
    Button
  } from "@/components/ui/button"
  

export function UpdateHabit() {
  const utils = api.useUtils();
  const [data] = api.habits.get.useSuspenseQuery();

  const updateHabit = api.habits.update.useMutation({
    onSuccess: async () => {
      await utils.habits.invalidate().catch((err) => console.log(err));
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const deleteHabit = api.habits.delete.useMutation({
    onSuccess: async () => {
      await utils.habits.invalidate().catch((err) => console.log(err));
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const handleHabitUpdate = (id: string) => {
    updateHabit.mutate({ id });

  }

  const handleHabitDelete = (id: string) => {
    deleteHabit.mutate({ id });
  }



  return (
   <>
   <Card>
    <CardHeader>
      <CardTitle>Update Habit</CardTitle>
    </CardHeader>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Counter</TableHead>
          <TableHead>Update</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((habit) => (
          <TableRow key={habit.id}>
            <TableCell>{habit.name}</TableCell>
            <TableCell>{habit.description}</TableCell>
            <TableCell>{habit.counter}</TableCell>
            <TableCell><Button onClick={()=>handleHabitUpdate(habit.id)}>update</Button></TableCell>
            <TableCell><Button onClick={()=>handleHabitDelete(habit.id)}>Delete</Button></TableCell>
          </TableRow>
        ))}
        </TableBody>
    </Table>
   </Card>
   </>
  );
}
