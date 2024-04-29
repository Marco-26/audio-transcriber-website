import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from './UI/Dialog'
import { Label } from '@radix-ui/react-dropdown-menu'
import { UserRound, Loader2 } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import { ToastContainer } from 'react-toastify'
import { Button } from './UI/Button'
import { DialogHeader } from './UI/Dialog'
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from './UI/Form'
import { Input } from './UI/Input'
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { User } from '../shared/User'
import LoginForm from './LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './UI/Card'
import { Link } from 'react-router-dom'
import { processSignup } from '../utils/api-client'
import { AxiosError, AxiosResponse } from 'axios'

const signupFormSchema = z.object({
  email: z.string().min(1,"Email is required").email("This is not a valid email."),
  password: z.string().min(6,"Password needs to be atleast 6 characters long"),
  confirmPassword: z.string().min(6,"Password needs to be atleast 6 characters long"),
  name: z.string().min(4, "Username must be atleast 4 characters long").max(50)
}).refine(data => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match"
});

interface SignupFormProps{
  setUser: Dispatch<SetStateAction<User | undefined>>;
}

const SignupForm:React.FC<SignupFormProps> = ({setUser}) => {

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
  })

  const onSubmit = async (values: z.infer<typeof signupFormSchema>) => {
    console.log("Submitted")
    await processSignup(
      values.email,
      values.password,
      values.confirmPassword,
      values.name,
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
        console.log(error)
      }
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="flex justify-center items-center">
        <Card className="mx-auto max-w-sm ">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-4">
              <div >
                  <FormField
                    control={form.control}
                    name="name"
                    render={() => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input id="name" type="text" placeholder="Max" required {...form.register("name")}/>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
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
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={() => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input id="password" type="password" required {...form.register("confirmPassword")}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={form.formState.isSubmitting} className="flex gap-1">
                  {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create an account
               </Button>
            </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  )
}

export default SignupForm