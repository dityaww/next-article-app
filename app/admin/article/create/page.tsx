"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, BadgeAlert, BadgeCheck, ImagePlus, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
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
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import axiosInstance from "@/lib/axios"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useAuth } from "@/app/stores/authStore"

const schema = z.object({
    title: z.string().min(1, { message: "Judul wajib diisi" }),
    categoryId: z.string().min(1, { message: "Kategori wajib diisi" }),
    content: z.string().min(1, { message: "Konten wajib diisi" }),
})

type AddArticleSchema = z.infer<typeof schema>

export default function CreateArticle() {
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const { token } = useAuth()

    const form = useForm<AddArticleSchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            categoryId: "",
            content: "",
        }
    })

    const { data: categories } = useQuery({
        queryKey: ['category'],
        queryFn: async () => {
          const { data } = await axiosInstance.get(`/categories?limit=60`);
          return data;
        },
    })

    const { mutate, isPending, error: errorAdd } = useMutation({
        mutationFn: async (items: AddArticleSchema) => {
            try {
                const { data, status } = await axiosInstance.post(`/articles`, items, { headers: {
                    Authorization: `Bearer ${token}`
                }})

                if (status === 200) {
                    toast.custom((t) => (
                        <div className="border-s-4 border-teal-600 flex items-center gap-4 px-4 py-3 bg-white rounded-lg w-[20rem]">
                            <BadgeCheck className="text-emerald-600" />
                            <div className="">
                                <p className="font-semibold font-sans text-base text-gray-700">Success</p>
                                <p className="text-sm font-normal text-gray-500">Successfully add article</p>
                            </div>
                        </div>
                    ))
                }

                return data
            } catch (error: any) {
                toast.custom((t) => (
                    <div className="border-s-4 border-red-600 flex items-center gap-4 px-4 py-3 bg-white rounded-lg w-[20rem]">
                        <BadgeAlert className="text-red-600" />
                        <div className="">
                            <p className="font-semibold font-sans text-base text-gray-700">Error</p>
                            <p className="text-sm font-normal text-gray-500">{error?.response?.data?.error || errorAdd}</p>
                        </div>
                    </div>
                ))
            }
        },
    })

    const onSubmit = (data: AddArticleSchema) => {
        console.log("hehehe", data)
        mutate(data)
        form.reset()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
        const previewUrl = URL.createObjectURL(file)
        setImagePreview(previewUrl)
        }
    }

    const handleRemoveImage = () => {
        setImagePreview(null)
    }
    return (
        <div className="">
            <header className="flex gap-2 p-5 items-center">
                <Link href="/admin/article">
                    <ArrowLeft className="text-slate-900" size={20}/>
                </Link>
                <div className="font-medium text-base leading-6">Create Articles</div>
            </header>

            <main className="p-6">
                <section className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <Label className="font-medium text-sm leading-5">Thumbnail</Label>

                        {!imagePreview ? (
                            <Label className="font-medium text-sm leading-5 border-2 border-dashed flex flex-col justify-center hover:cursor-pointer hover:bg-slate-100 items-center rounded-[8px] p-3 w-1/5 h-[160px]" htmlFor="thumbnail">
                                <div className="flex flex-col items-center gap-3">
                                    <ImagePlus size={20} className="text-slate-500"/>
                                    <div className="flex flex-col gap-1 items-center">
                                        <div className="underline font-normal leading-4 text-xs text-slate-500">Click to select file</div>
                                        <div className="font-normal leading-4 text-xs text-slate-500">Support File Type: jpg or png</div>
                                    </div>
                                </div>
                            </Label>
                        ) : (
                            <div className="relative w-1/5 h-[160px] rounded-[8px] overflow-hidden border">
                                <Image
                                    src={imagePreview}
                                    alt="Thumbnail Preview"
                                    layout="fill"
                                    objectFit="cover"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-md"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}

                        <Input type="file"
                            id="thumbnail"
                            name="thumbnail"
                            accept="image/png, image/jpeg"
                            hidden
                            onChange={handleFileChange} />
                    </div>

                    <Form {...form}>
                        <form action="" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <div className="border rounded-md">
                                                <Input placeholder="Input title" {...field} className="!ring-0 border-none"/>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl className="w-full">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-80">
                                                {categories && categories?.data?.length > 0 &&
                                                    categories?.data?.map((data: any, index: number) => (
                                                        <SelectItem key={index} value={data?.id || `id-${index}`}>{data?.name || "-"}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <Textarea placeholder="Type your content here." {...field} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-2 py-4">
                                <Button variant="ghost" className="pt-2 px-4 border border-slate-200 radius-md text-sm font-medium leading-5" onClick={() => form.reset()}>Cancel</Button>
                                <Button variant="ghost" className="pt-2 px-4 bg-slate-200 radius-md text-sm font-medium leading-5 hover:bg-slate-300">Preview</Button>
                                <Button variant="ghost" type="submit" className="pt-2 px-4 bg-blue-600 radius-md text-sm font-medium leading-5 text-white hover:bg-blue-700 hover:text-white">{isPending ? "Loading..." : "Upload"}</Button>
                            </div>
                        </form>
                    </Form>

                </section>
            </main>
        </div>
    )
}