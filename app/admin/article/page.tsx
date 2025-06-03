"use client"

import { useProtectedPage } from "@/app/hooks/useProtectedPage"
import { Input } from "@/components/ui/input"
import { debounce } from "lodash"
import { BadgeAlert, Images, Plus, Search } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import axiosInstance from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import moment from "moment"
import { PaginationControl } from "@/components/ui/pagination"

export default function AdminArticle() {
    const [query, setQuery] = useState<string>("")
    const [searchQueries, setSearchQueries] = useState<string>("")
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0)
    const [totalItems, setTotalItems] = useState<number>(0);

    const { data: categories } = useQuery({
        queryKey: ['category'],
        queryFn: async () => {
          const { data } = await axiosInstance.get(`/categories?limit=60`);
          return data;
        },
    })

    const { data: articles, error } = useQuery({
        queryKey: ['articles', currentPage, searchQueries],
        queryFn: async () => {
            try {
                const { data } = await axiosInstance.get(`/articles?page=${currentPage}&title=${searchQueries}`);
                setTotalItems(data?.total)
                setTotalPage(Math.ceil(data.total / data.limit))
                return data;
            } catch (error) {
                console.log("err get")
            }
        },
        
    })

    // const { token, role } = useProtectedPage({
    //     role: "Admin",
    //     redirectTo: "/"
    // })

    // if (!token || role !== "Admin") return <p>Loading...</p>

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
        <div className="">
            {/* <header></header> */}
            <div className="divide-y divide-gray-200">
                <div className="p-6 font-medium text-[16px]">
                    Total Articles: {totalItems || 0}
                </div>
                <div className="p-6 flex justify-between">
                    <div className="flex gap-2 items-center">
                        <Select>
                            <SelectTrigger className="bg-white w-fit">
                                <SelectValue placeholder="Select a category"/>
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                                <SelectGroup>
                                    <SelectLabel>Category</SelectLabel>
                                    { categories?.data?.map((item: any, index: number) => (
                                        <SelectItem className="text-black" value={item.name} key={index}>{item.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="border flex items-center gap-1.5 bg-transparent px-3 rounded-md">
                            <Search size={20} className="text-slate-400" />
                            <Input type="text" placeholder="Search articles" value={query} onChange={({ target }) => setQuery(target.value)} className="font-normal text-sm !shadow-none !border-none !ring-0 leading-5 text-gray-900 placeholder:text-slate-400"/>
                        </div>
                    </div>
                    <Link href="/admin/article/create">
                        <Button className="px-4 py-2 rounded-md h-10 w-[135px] bg-blue-600 hover:bg-blue-700">
                            <Plus />
                            Add Articles
                        </Button>
                    </Link>
                </div>
                
                <div className="">
                    <Table>
                        <TableHeader className="bg-slate-200">
                            <TableRow>
                                <TableHead className="text-center font-medium text-sm py-3 px-4 leading-5">Thumbnail</TableHead>
                                <TableHead className="text-center font-medium text-sm py-3 px-4 leading-5">Title</TableHead>
                                <TableHead className="text-center font-medium text-sm py-3 px-4 leading-5">Category</TableHead>
                                <TableHead className="text-center font-medium text-sm py-3 px-4 leading-5">Created At</TableHead>
                                <TableHead className="text-center font-medium text-sm py-3 px-4 leading-5">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {articles && articles?.data?.length > 0 ? (
                                articles?.data?.map((data: any, index: number) => (
                                    <TableRow key={index}>
                                        <TableCell className="flex justify-center px-4 py-3">
                                            {data?.imageUrl ?
                                                <Image src={data?.imageUrl} alt="image-content" priority className="w-[60px] h-[60px] object-cover rounded-[6px]" width={300} height={100}/>
                                                : <div className="w-[60px] h-[60px] rounded-[6px] bg-gray-200 flex flex-col items-center justify-center">
                                                    <Images className="text-gray-400"/>
                                                    <p className="text-xs text-gray-400 font-medium">Error</p>
                                                </div>
                                            }
                                        </TableCell>
                                        <TableCell className="text-slate-600 text-center px-4 py-3 text-sm leading-5">{data?.title}</TableCell>
                                        <TableCell className="text-slate-600 text-center px-4 py-3 text-sm leading-5">{data?.category?.name}</TableCell>
                                        <TableCell className="text-slate-600 text-center px-4 py-3 text-sm leading-5">{moment(data?.createdAt).format("MMMM D, YYYY HH:mm:ss")}</TableCell>
                                        <TableCell className="px-4 py-3">
                                            <div className="flex gap-3 justify-center items-center">
                                                <Link href="#" className="hover:underline text-sm leading-5 font-normal text-blue-600">Preview</Link>
                                                <Link href={`/admin/article/edit/${data?.id}`} className="hover:underline text-sm leading-5 font-normal text-blue-600">Edit</Link>
                                                <Link href="#" className="hover:underline text-sm leading-5 font-normal text-red-500">Delete</Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center px-4 py-3 text-gray-600">
                                        <div className="flex divide-x-2 space-x-2 items-center justify-center w-full">
                                            {error &&
                                                <div className="flex gap-1 items-center pr-2">
                                                    <BadgeAlert className="text-red-600" />
                                                    <div className="">
                                                        {error?.message}
                                                    </div>
                                                </div>
                                            }
                                            <div className="">Tidak ada data</div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="my-[40px] flex justify-center">
                    <PaginationControl 
                        currentPage={currentPage}
                        totalPages={totalPage}
                        onPageChange={(pages) => setCurrentPage(pages)}
                    />
                </div>
            </div>
            {/* <h1>List Artikel Admin</h1> */}
        </div>
    )
}