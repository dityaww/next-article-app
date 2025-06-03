"use client"

import Image from "next/image";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Logo from '@/app/assets/logo.png'
import Link from 'next/link'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type LoginSchema } from "./components/validation";
import { useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { BadgeCheck, BadgeAlert, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/app/stores/authStore";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [passwordShown, setPasswordShown] = useState<boolean>(false)
    const { setAuth } = useAuth()
    const router = useRouter()

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: ""
        }
    })

    async function onSubmit(data: LoginSchema) {
        try {
            const { data: result, status } = await axiosInstance.post("/auth/login", data);
            const { token, role } = result;

            setAuth(token, role);
    
            if (status === 200) {
                toast.custom((t) => (
                    <div className="border-s-4 border-teal-600 flex items-center gap-4 px-4 py-3 bg-white rounded-lg w-[20rem]">
                        <BadgeCheck className="text-emerald-600" />
                        <div className="">
                            <p className="font-semibold font-sans text-base text-gray-700">Success</p>
                            <p className="text-sm font-normal text-gray-500">Successfully Login</p>
                        </div>
                    </div>
                ))

                router.push('/')
            }
        } catch (error: any) {
            console.log(error)
            toast.custom((t) => (
                <div className="border-s-4 border-red-600 flex items-center gap-4 px-4 py-3 bg-white rounded-lg w-[20rem]">
                    <BadgeAlert className="text-red-600" />
                    <div className="">
                        <p className="font-semibold font-sans text-base text-gray-700">Error</p>
                        <p className="text-sm font-normal text-gray-500">{error?.response?.data?.error || error?.message}</p>
                    </div>
                </div>
            ))
        }

        finally {
            form.reset();
        }
    }

    return (
      <>
        <div className="flex justify-center">
          <Image src={Logo} alt="image-logo" />
        </div>

        <div className="flex flex-col gap-[12px]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <div className="border rounded-md">
                                        <Input placeholder="Input username" {...field} className="!ring-0 border-none"/>
                                    </div>
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
                                    <div className="border flex items-center rounded-md shadow-xs focus:outline outline-gray-300">
                                        <Input placeholder="Input password" className="border-none shadow-none !ring-0 " type={passwordShown ? "text" : "password"} {...field} />
                                        <Button className="mx-0.5 hover:bg-transparent" variant="ghost" onClick={() => setPasswordShown(!passwordShown)}>
                                            {passwordShown ? 
                                                <EyeOff className="text-gray-400" />
                                            :
                                                <Eye className="text-gray-400"/>
                                            }
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* {error && <p className="text-red-500 font-medium">{error}</p>} */}

                    <Button type="submit" disabled={form.formState.isSubmitting} className="w-full py-[8px] px-[16px] bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white disabled:bg-gray-300 disabled:text-gray-800">
                        {form.formState.isSubmitting ? "Loading..." : "Login"}
                    </Button>
                </form>
            </Form>
        </div>

        <div className="flex justify-center">
            <p className="font-normal text-[14px] text-slate-600 leading-[20px]">Don't have account? <Link href="/register" className="text-blue-600 underline">Register</Link></p>
        </div>
      </>
    );
  }
  