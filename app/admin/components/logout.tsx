"use client"

import { useAuth } from "@/app/stores/authStore"
import { BadgeCheck } from "lucide-react"
import { redirect } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

export default function LogoutAccount() {
    const { clearAuth, token } = useAuth()

    useEffect(() => {
        if (!token) {
          redirect('/login')
        }
    }, [token])

    return (
        <div onClick={() => {
            clearAuth()
            toast.custom((t) => (
            <div className="border-s-4 border-teal-600 flex items-center gap-4 px-4 py-3 bg-white rounded-lg w-[20rem]">
                <BadgeCheck className="text-emerald-600" />
                <div className="">
                    <p className="font-semibold font-sans text-base text-gray-700">Success</p>
                    <p className="text-sm font-normal text-gray-500">Logout Success</p>
                </div>
            </div>))
        }} className="!text-white text-base leading-6 font-medium">
            Logout
        </div>
    )
}