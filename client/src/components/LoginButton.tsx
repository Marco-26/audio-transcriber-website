import React from 'react'
import { Button } from "./UI/Button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./UI/Form"
import { Input } from "./UI/Input"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"

import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './UI/Dialog';
import { PlusCircle, Loader2, UserRound } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';

const loginFormSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})

const LoginButton = () => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  })
  
  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    console.log(values)
  }

  return (
    <>
      <ToastContainer />
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <UserRound className="mr-2" />
            Login
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-3 text-xl">Login</DialogTitle>
            <DialogDescription>Login to your account here!</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                  control={form.control}
                  name="email"
                  render={() => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder='Type here your email...' {...form.register("email")}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={() => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder='Type here your password...' {...form.register("password")}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting} className="flex gap-1">
                  {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Submit
               </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LoginButton