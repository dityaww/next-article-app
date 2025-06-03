import { useAuth } from "@/app/stores/authStore"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import axiosInstance from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"
import { BadgeAlert, BadgeCheck } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function DeleteCategory({ category, onSuccess }: { 
    category: { id: string, name: string }
    onSuccess?: () => void
}) {
    const { token } = useAuth()
    const [open, setOpen] = useState<boolean>(false)
    
    const { mutate, isPending } = useMutation({
        mutationFn: async (id: string) => {
            try {
                const { data, status } = await axiosInstance.delete(`/categories/${id}`, { headers: {
                    Authorization: `Bearer ${token}`
                }})

                if (status === 200) {
                    toast.custom((t) => (
                        <div className="border-s-4 border-teal-600 flex items-center gap-4 px-4 py-3 bg-white rounded-lg w-[20rem]">
                            <BadgeCheck className="text-emerald-600" />
                            <div className="">
                                <p className="font-semibold font-sans text-base text-gray-700">Success</p>
                                <p className="text-sm font-normal text-gray-500">Successfully delete data</p>
                            </div>
                        </div>
                    ))
                    setOpen(false)
                    onSuccess?.()
                }

                return data
            } catch (error: any) {
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="text-red-600 hover:underline text-sm font-medium">
                Delete
            </DialogTrigger>
            <DialogContent className="w-[400px]">
                <DialogHeader>
                    <DialogTitle>Delete Category</DialogTitle>
                </DialogHeader>

                <DialogDescription>
                    Delete category "{category.name}"? This will remove it from master data permanently
                </DialogDescription>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" onClick={() => mutate(category.id)} className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:text-gray-800" disabled={isPending}>{isPending ? "Loading.." : "Delete"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}