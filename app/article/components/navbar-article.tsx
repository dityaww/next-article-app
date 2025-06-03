"use client"

import Image from "next/image"
import Logo from '@/app/assets/logo.png'
import { getProfile, useAuth } from "@/app/stores/authStore"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner";
import Link from "next/link"
import { BadgeCheck } from "lucide-react"
import { useEffect } from "react"
import { redirect } from "next/navigation"

export default function NavbarArticle () {
    const { username } = getProfile()
    const { clearAuth, token } = useAuth()

    useEffect(() => {
        if (!token) {
          redirect('/login')
        }
    }, [token])

    return (
        <nav className="border-b border-slate-200 md:py-8 md:px-[60px] py-4 px-5">
            <div className="flex justify-between">
                <div className="flex items-center">
                    <Image src={Logo} priority={true} alt="image-logo" />
                </div>
                <div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                    <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
                        <div className="font-medium text-gap-4 leading-6 underline hidden md:block">{username}</div>
                    </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                    <DropdownMenuItem>
                        <Link href="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                        clearAuth()
                        toast.custom((t) => (
                        <div className="border-s-4 border-teal-600 flex items-center gap-4 px-4 py-3 bg-white rounded-lg w-[20rem]">
                            <BadgeCheck className="text-emerald-600" />
                            <div className="">
                                <p className="font-semibold font-sans text-base text-gray-700">Success</p>
                                <p className="text-sm font-normal text-gray-500">Logout Success</p>
                            </div>
                        </div>
                        ))
                    }}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            </div>
        </nav>
    )
}

