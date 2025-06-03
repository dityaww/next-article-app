import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { BadgeAlert, Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/app/stores/authStore"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"

const schema = z.object({
    name: z.string().min(1, { message: "Nama kategori wajib diisi" })
})

type CategorySchema = z.infer<typeof schema>

export default function AddCategory () {
    const { token } = useAuth()

    const form = useForm<CategorySchema>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: ""
        }
    })

    const { mutate, isPending, error: errorAdd } = useMutation({
        mutationFn: async (items: CategorySchema) => {
            try {
                const { data } = await axiosInstance.post(`/categories`, items, { headers: {
                    Authorization: `Bearer ${token}`
                }})

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
        onError: (error: any) => {
            form.reset()
        },
        onSuccess: () => {
            form.reset()
        },
    })

    const onSubmit = (data: CategorySchema) => {
        mutate(data)
    }

    return (
        <Dialog>
            <DialogTrigger className="px-4 py-2 rounded-md h-10 bg-blue-600 hover:bg-blue-700 !text-white">
                <div className="flex gap-2 items-center">
                    <Plus size={20} />
                    <div className="text-sm font-medium">
                        Add Category
                    </div>
                </div>
            </DialogTrigger>
            <DialogContent className="w-[400px]">
                <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
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
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-800" disabled={isPending}>{isPending ? "Loading.." : "Add"}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>

            </DialogContent>
        </Dialog>
    )
}