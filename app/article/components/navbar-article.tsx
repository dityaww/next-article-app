"use client"

import Image from "next/image"
import Logo from '@/app/assets/logo.png'
import { getProfile } from "@/app/stores/authStore"

export default function NavbarArticle () {
    const { username } = getProfile()

    return (
        <nav className="border-b border-slate-200 md:py-8 md:px-[60px] py-4 px-5">
            <div className="flex justify-between">
                <div className="flex items-center">
                    <Image src={Logo} priority={true} alt="image-logo" />
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
                    <div className="font-medium text-[16px] leading-6 underline hidden md:block">{username || "-"}</div>
                </div>
            </div>
        </nav>
    )
}

