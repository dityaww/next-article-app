"use client"

import Image from "next/image";
import WhiteLogo from '@/app/assets/white-logo.png';
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton"
import { useCallback, useEffect, useState } from "react";
import { PaginationControl } from "@/components/ui/pagination";
import { debounce } from "lodash"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { BadgeCheck, Search } from "lucide-react";
import { useProtectedPage } from "./hooks/useProtectedPage";
import { redirect } from "next/navigation";
import moment from "moment";
import { getProfile, useAuth } from "./stores/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner";

interface ArticleProps {
  id: string,
  title: string,
  content: string,
  userId: string,
  categoryId: string,
  createdAt: string
  imageUrl: string,
  category: {
    id: string,
    name: string,
    userId: string
  },
  user: {
    id: string,
    username: string,
    role: string
  }
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0)
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageSize, setpageSize] = useState<number>(9)
  const [query, setQuery] = useState<string>("")
  const [searchQueries, setSearchQueries] = useState<string>("")

  const { setProfile, username } = getProfile()
  const { token, clearAuth } = useAuth()

  useEffect(() => {
    if (!token) {
      redirect('/login')
    }
  }, [token])

  const { data: profile } = useQuery({
    queryKey: ['get-profiles'],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance("/auth/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        setProfile(data?.username, data?.role)
        return data
      } catch (error) {
        console.log(error)
      }
    }
})

  const { data, isLoading, error } = useQuery({
    queryKey: ['articles', currentPage, searchQueries],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/articles?limit=${pageSize}&page=${currentPage}&title=${searchQueries}`);
      setTotalItems(data?.total)
      setTotalPage(Math.ceil(data.total / data.limit))
      return data;
    },
  })
  
  const { data: categories } = useQuery({
    queryKey: ['category'],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/categories`);
      return data;
    },
  })

  const handleSearch = (value: string) => {
    setSearchQueries(value)
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 500), []);

  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    }
    return () => {
      debouncedSearch.cancel(); 
    };
  }, [query, debouncedSearch]);

  return (
    <main className="">
      {/* HERO SECTION */}
      <div className="relative h-[600px] bg-[url('/hero-image.jpg')] bg-center bg-cover">
        <div className="absolute bg-[#2563EBDB] w-full h-full"></div>
        <div className="relative z-10 text-white">
          {/* NAVIGATION BAR */}
          <nav className="flex justify-between md:py-8 py-4 md:px-[60px] px-5">
            <div className="flex items-center">
              <Image src={WhiteLogo} alt="white-logo" />
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
          </nav>

          {/* CONTENT */}
          <section className="flex justify-center mt-32">
            <div className="flex flex-col items-center gap-10 lg:w-[730px]">
              <div className="flex flex-col gap-3">
                <div className="font-bold md:leading-6 leading-5 md:text-base text-sm text-center">Blog genzet</div>
                <div className="font-medium md:text-5xl text-4xl md:leading-12 leading-10 text-center">The Journal : Design Resources, Interviews, and Industry News</div>
                <div className="font-normal md:text-2xl text-xl md:leading-8 leading-7 text-center">Your daily dose of design insights!</div>
              </div>
              <div className="text-gray-900 flex gap-2 items-center">
                <Select>
                  <SelectTrigger className="bg-white w-[180px]">
                    <SelectValue placeholder="Select a category"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      { categories?.data?.map((item: any, index: number) => (
                        <SelectItem className="text-black" value={item.name} key={index}>{item.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                
                <div className="border flex items-center gap-1.5 bg-white px-3 rounded-md">
                  <Search size={20} className="text-slate-400" />
                  <Input type="text" placeholder="Search articles" value={query} onChange={({ target }) => setQuery(target.value)} className="font-normal text-sm !shadow-none !border-none !ring-0 leading-5 text-gray-900 placeholder:text-slate-400"/>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-6 lg:px-[100px] px-5 pt-10 md:pb-[100px] pb-[60px]">
        {/* Dummy datas */}
        <div className="">Showing: {pageSize > totalItems ? totalItems : pageSize} of {totalItems}</div>

        {/* API CALLS */}
        <div className="">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 md:gap-x-10 md:gap-y-[60px] gap-10">    
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <div className="flex flex-col space-y-3" key={i}>
                  <Skeleton className="h-80 w-full rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              data !== undefined && data?.data?.length > 0 && data?.data?.map((item: ArticleProps, index: number) => (
                <div className="flex flex-col gap-4 overflow-hidden" key={index}>
                  <Link href={`/article/${item.id}`}>
                    <div className="relative w-full h-80 rounded-[12px] overflow-hidden">
                      <Image src={item.imageUrl === null ? WhiteLogo : item.imageUrl} alt="article-image" className="object-cover" fill sizes="(max-width: 400px)" />
                    </div>
                  </Link>

                  <div className="flex flex-col gap-2">
                    <div className="text-slate-600 text-xs leading-4 md:leading-5 font-normal">
                      {moment(item?.createdAt).format("MMMM D, YYYY")}
                    </div>
                    
                    <div className="text-base md:text-lg font-semibold leading-6 md:leading-7">
                      {item.title}
                    </div>
                    
                    <div className="md:text-base md:leading-6 text-sm leading-5 truncate">
                      {item.content}
                    </div>

                    <div className="flex gap-[8px]">
                      <div className="text-xs leading-4 md:text-sm md:leading-5 px-3 py-1 text-blue-900 font-normal bg-blue-200 rounded-[100px]">{item.category.name}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-[60px] flex justify-center">
            <PaginationControl 
              currentPage={currentPage}
              totalPages={totalPage}
              onPageChange={(pages) => setCurrentPage(pages)}
            />
          </div>
        </div>
      </div>

      <footer className="bg-[#2563EBDB] h-[100px] flex items-center justify-center">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
            <Image src={WhiteLogo} alt="white-logo" />
            <div className="text-white text-sm md:text-base leading-5 md:leading-6 font-normal">&copy; 2025 Blog genzet. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}

