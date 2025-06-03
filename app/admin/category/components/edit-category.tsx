import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BadgeAlert, BadgeCheck } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import axiosInstance from "@/lib/axios"
import { useAuth } from "@/app/stores/authStore"
import { toast } from "sonner"
import { useEffect, useState } from "react"

const schema = z.object({
    name: z.string().min(1, { message: "Nama kategori wajib diisi" })
})

type CategorySchema = z.infer<typeof schema>

export default function EditCategory({ category, onSuccess } : { 
    category: { id: string, name: string }
    onSuccess?: () => void
}) {
    const [open, setOpen] = useState<boolean>(false)
    const { token } = useAuth()

    const form = useForm<CategorySchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: category.name
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: async (items: CategorySchema) => {
            try {
                const { data, status } = await axiosInstance.put(`/categories/${category.id}`, items, { headers: {
                    Authorization: `Bearer ${token}`
                }})

                if (status === 200) {
                    toast.custom((t) => (
                        <div className="border-s-4 border-teal-600 flex items-center gap-4 px-4 py-3 bg-white rounded-lg w-[20rem]">
                            <BadgeCheck className="text-emerald-600" />
                            <div className="">
                                <p className="font-semibold font-sans text-base text-gray-700">Success</p>
                                <p className="text-sm font-normal text-gray-500">Successfully update data</p>
                            </div>
                        </div>
                    ))
                    setOpen(false)
                    onSuccess?.()
                }

                return data
            } catch (error: any) {
                form.reset()
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
        },
    })

    const onSubmit = (data: CategorySchema) => {
        mutate(data)
    }

    useEffect(() => {
        if (open) {
            form.reset({ name: category.name})
        }
    }, [open])
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="text-blue-600 hover:underline text-sm font-medium">
                Edit
            </DialogTrigger>
            <DialogContent className="w-[400px]">
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Input Category" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-800" disabled={isPending}>{isPending ? "Loading.." : "Save Changes"}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>

            </DialogContent>
        </Dialog>
    )
}