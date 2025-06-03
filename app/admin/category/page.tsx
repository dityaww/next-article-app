"use client"

import { Input } from "@/components/ui/input"
import { debounce } from "lodash"
import { BadgeAlert, Plus, Search } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import axiosInstance from "@/lib/axios"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import moment from "moment"
import AddCategory from "./components/add-category"
import TableCategory from "./components/table-category"
import EditCategory from "./components/edit-category"
import DeleteCategory from "./components/delete-category"
import { PaginationControl } from "@/components/ui/pagination"

interface Category {
    id: string,
    name: string
    createdAt: string
}

export default function AdminCategory() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0)
    const [totalItems, setTotalItems] = useState<number>(0);
    const [query, setQuery] = useState<string>("")
    const [searchQueries, setSearchQueries] = useState<string>("")
    const [errorState, setErrorState] = useState<string>("")
    const queryClient = useQueryClient()

    const { data: categories, error } = useQuery({
        queryKey: ['category', searchQueries, currentPage],
        queryFn: async () => {
            try {
                const { data } = await axiosInstance.get(`/categories?search=${searchQueries}&page=${currentPage}`);
                setTotalItems(data?.totalData)
                setTotalPage(data.totalPages)
                return data;
            } catch (error) {
                console.log("err get")
            }
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
        <div className="">
            {/* <header></header> */}
            <div className="divide-y divide-gray-200">
                <div className="p-6 font-medium text-[16px]">
                    Total Category: {totalItems}
                </div>
                <div className="p-6 flex justify-between">
                    <div className="flex gap-2 items-center">
                        <div className="border flex items-center gap-1.5 bg-transparent px-3 rounded-md">
                            <Search size={20} className="text-slate-400" />
                            <Input type="text" placeholder="Search category" value={query} onChange={({ target }) => setQuery(target.value)} className="font-normal text-sm !shadow-none !border-none !ring-0 leading-5 text-gray-900 placeholder:text-slate-400"/>
                        </div>
                    </div>

                    <AddCategory />
                </div>

                <TableCategory>
                    {categories && categories?.data?.length > 0 ?
                        categories?.data?.map((data: Category, index: number) => (
                            <TableRow key={index}>
                                <TableCell className="text-slate-600 text-center px-4 py-3 text-sm leading-5 capitalize">{data?.name}</TableCell>
                                <TableCell className="text-slate-600 text-center px-4 py-3 text-sm leading-5">{moment(data?.createdAt).format("MMMM D, YYYY HH:mm:ss")}</TableCell>
                                <TableCell className="px-4 py-3">
                                    <div className="flex gap-3 justify-center items-center">
                                        <EditCategory category={data} onSuccess={() => {
                                            queryClient.invalidateQueries({ queryKey: ['category']})
                                        }} />

                                        <DeleteCategory category={data} onSuccess={() => {
                                            queryClient.invalidateQueries({ queryKey: ['category']})
                                        }} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : <TableRow>
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
                    }
                </TableCategory>

            </div>
            <div className="py-5 flex justify-center">
                <div className="w-fit">
                    <PaginationControl 
                        currentPage={currentPage}
                        totalPages={totalPage}
                        onPageChange={(pages) => setCurrentPage(pages)}
                    />
                </div>
            </div>
        </div>
    )
}