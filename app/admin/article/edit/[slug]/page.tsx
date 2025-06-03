import axiosInstance from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import FormEditArticle from "./edit-article"

export default async function EditArticle({ params } : { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    return (
        <div className="">
            <FormEditArticle id={slug} />
        </div>
    )
}