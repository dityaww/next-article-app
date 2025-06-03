"use client"

import { getProfile } from "@/app/stores/authStore"

export const Header = () => {
    const { username } = getProfile()

    return (
        <header className="border-b border-slate-200 px-6 pt-5 pb-4 flex items-center justify-between bg-[#F9FAFB]">
            <h1 className="text-xl leading-7 font-semibold">Article</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
              <div className="font-medium text-[16px] leading-6 underline hidden md:block">{username || "-"}</div>
            </div>
        </header>
    )
}