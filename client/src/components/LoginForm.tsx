import React, { useState } from 'react'
import { Dispatch, SetStateAction } from 'react';
import { User } from '../shared/User';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from './UI/Dialog';
import { AxiosResponse, AxiosError } from 'axios';
import { UserRound,Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { ToastContainer } from 'react-toastify';
import { z } from 'zod';
import { processLogin } from '../utils/api-client';
import { Button } from './UI/Button';
import { DialogHeader } from './UI/Dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './UI/Form';
import { Input } from './UI/Input';
import SignupForm from './SignupForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './UI/Card';
import { Label } from './UI/Label';
import { Link } from 'react-router-dom';

interface LoginButtonProps{
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

const loginFormSchema = z.object({
  email: z.string().email("This is not a valid email."),
  password: z.string().min(6,"Password needs to be atleast 6 characters long"),
})

const LoginForm:React.FC<LoginButtonProps> = ({setUser}) => {
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
      <div className="flex justify-center items-center h-93">
        <Card className="w-full max-w-sm">
        <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={() => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input id="email" type="email" placeholder="m@example.com" required {...form.register("email")}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={() => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input id="password" type="password" required {...form.register("password")}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
             
          </CardContent>
          <CardFooter className='flex flex-col'>
            <Button type="submit" disabled={form.formState.isSubmitting} className="flex gap-1 w-full mb-2">
              {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Login
            </Button>
            <div className="mt-2 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline">
                  Sign up
                </Link>
            </div>
          </CardFooter>
            </form>
          </Form>
        </Card>
        </div>
    </>
  )
}

export default LoginForm