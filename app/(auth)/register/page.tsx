"use client"

import Image from "next/image";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Logo from '@/app/assets/logo.png'
import Link from 'next/link'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form";
import { registerSchema, RegisterSchema } from "./components/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeAlert, BadgeCheck, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export default function RegisterPage() {
    const [passwordShown, setPasswordShown] = useState<boolean>(false)

    const form = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            username: "",
            password: "",
            role: ""
        }
    })

    const onSubmit = async (data: RegisterSchema) => {
        try {
            const { data: result, status } = await axiosInstance.post("/auth/register", data);
    
            if (status === 201) {
                toast.custom((t) => (
                    <div className="border-s-4 border-teal-600 flex items-center gap-4 px-4 py-3 bg-white rounded-lg w-[20rem]">
                        <BadgeCheck className="text-emerald-600" />
                        <div className="">
                            <p className="font-semibold font-sans text-base text-gray-700">Success</p>
                            <p className="text-sm font-normal text-gray-500">Successfully register account</p>
                        </div>
                    </div>
                ))
            }
        } catch (error: any) {
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

                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl className="w-full">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="User">User</SelectItem>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Aneh">Aneh</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={form.formState.isSubmitting} className="w-full py-[8px] px-[16px] bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white disabled:bg-gray-300 disabled:text-gray-800">
                        {form.formState.isSubmitting ? "Loading..." : "Register"}
                    </Button>
                </form>
            </Form>
            {/* <div className="flex flex-col gap-[4px]">
                <Label htmlFor="username" className="text-[14px] font-medium leading-[20px]">Username</Label>
                <Input 
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Input username"
                    className="border border-slate-200 py-[8px] px-[12px]"
                />
            </div>
            
            <div className="flex flex-col gap-[4px]">
                <Label htmlFor="password" className="text-[14px] font-medium leading-[20px]">Password</Label>
                <Input 
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Input password"
                    className="border border-slate-200 py-[8px] px-[12px]"
                />
            </div>
            
            <div className="flex flex-col gap-[4px]">
                <Label htmlFor="password" className="text-[14px] font-medium leading-[20px]">Role</Label>
                <Input 
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Input password"
                    className="border border-slate-200 py-[8px] px-[12px]"
                />
            </div> */}
        </div>

        {/* <div className="">
            <Button type="submit" className="w-full py-[8px] px-[16px] bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white">Register</Button>
        </div> */}

        <div className="flex justify-center">
            <p className="font-normal text-[14px] text-slate-600 leading-[20px]">Don't have account? <Link href="/login" className="text-blue-600 underline">Login</Link></p>
        </div>
      </>
    );
  }
  