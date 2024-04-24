import React, { useState } from 'react'
import { Button } from "./UI/Button"
import {
  Form,
  FormControl,
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
import { Loader2, UserRound } from 'lucide-react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { processLogin } from '../utils/api-client';
import { AxiosError, AxiosResponse } from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { User } from '../shared/User';
import { Label } from './UI/Label';

const loginFormSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})

interface LoginButtonProps{
  user:User | undefined;
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

const LoginButton:React.FC<LoginButtonProps> = ({user,setUser}) => {
  const [errorLogginIn, setErrorLogginIn] = useState<Boolean>(false);
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  })
  
  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    await processLogin(
      values.email,
      values.password,
      (response:AxiosResponse) =>{
        if(response.status >= 200 && response.status < 300){
          setUser({
            id: response.data["id"],
            name:response.data["name"],
            email: response.data["email"]
          })
        }
      },
      (error: AxiosError) => {
        setErrorLogginIn(true);
        console.log(error)
      }
    );
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
                <Button variant={"link"} className='p-0 m-0'>Sign Up</Button>
                {errorLogginIn && <Label className='text-red-600	'>The e-mail address and/or password you specified are not correct.</Label> }
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