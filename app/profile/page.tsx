"use client"

import Image from "next/image"
import WhiteLogo from '@/app/assets/white-logo.png';
import NavbarArticle from "../article/components/navbar-article";
import { Button } from "@/components/ui/button";
import { Images } from "lucide-react";
import { getProfile } from "../stores/authStore";
import Link from "next/link";

export default function ProfilePage() {
    const { role, username } = getProfile()

    return (
        <>
            <div className="flex flex-col min-h-screen w-full">
                <NavbarArticle />

                <div className="flex-1 flex flex-col justify-center items-center">
                    <div className="flex flex-col items-center gap-3">
                        <h2 className="text-lg font-medium">User Profile</h2>
                        <div className="rounded-full w-20 h-20 bg-blue-100 flex items-center justify-center">
                            <Images size={28} className="text-blue-700"/>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2 bg-gray-100 px-3 py-2 rounded-md">
                                <div className="w-24 font-medium text-md">Username</div>
                                <div>:</div>
                                <div className="w-64 text-center font-normal text-md">{username || "-"}</div>
                            </div>

                            <div className="flex gap-2 bg-gray-100 px-3 py-2 rounded-md">
                                <div className="w-24 font-medium text-md">Role</div>
                                <div>:</div>
                                <div className="w-64 text-center font-normal text-md">{role || "-"}</div>
                            </div>
                        </div>

                        <Link href="/" className="w-full">
                            <Button type="button" className="bg-blue-700 text-white hover:bg-blue-800 hover:cursor-pointer w-full h-10">Back to Home</Button>
                        </Link>
                    </div>
                </div>

                <footer className="bg-[#2563EBDB] h-[100px] flex items-center justify-center">
                    <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
                        <Image src={WhiteLogo} alt="white-logo" />
                        <div className="text-white text-sm md:text-base leading-5 md:leading-6 font-normal">&copy; 2025 Blog genzet. All rights reserved.</div>
                    </div>
                </footer>
            </div>
        </>
    )
}