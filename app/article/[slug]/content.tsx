"use client"

import Image from "next/image"
import DOMPurify from 'dompurify';
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import Link from "next/link";
import moment from "moment";

interface ArticleProps {
    id: string,
    title: string,
    content: string,
    userId: string,
    categoryId: string,
    createdAt: string,
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

export default function ArticleContent({ id } : { id: string }) {
    const [filteredArticle, setFilteredArticle] = useState<[]>([])
    
    const { data: articles, isLoading: isLoadingArticles, error: errorArticles } = useQuery({
        queryKey: ['articles'],
        queryFn: async (): Promise<ArticleProps> => {
            const { data } = await axiosInstance.get(`/articles/${id}`)
            return data
        },
    });
    
    const { data: articlesCategories, isLoading, error } = useQuery({
        queryKey: ['categoryArticle'],
        queryFn: async (): Promise<any> => {
            const { data } = await axiosInstance.get(`/articles?limit=20`)
            return data.data
        },
    });

    const filterByCategory = articlesCategories && articlesCategories.filter((item: any, index: number) => ( item.categoryId === articles?.categoryId )).slice(0, 3)
    console.log(filterByCategory)

    const SafeHTML = ({ html }: { html: string }) => {
        const cleanHtml = DOMPurify.sanitize(html);

        return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} className="leading-6 text-base"/>
    }

    return (
        <>
            {isLoadingArticles ? (
                <div className='py-10 px-5 md:px-40 flex flex-col gap-6 md:gap-10'>
                    <div className="flex justify-center">
                        <div className="flex flex-col items-center gap-4 ">
                            <Skeleton className="w-40 h-2" />
                            <Skeleton className="w-[600px] h-4" />
                            <Skeleton className="w-[500px] h-4" />
                        </div>
                    </div>

                    <div className="">
                        <Skeleton className="w-full h-[50rem]" />
                    </div>

                    <div className="flex flex-col gap-5">
                        {[1,1,1,1,1].map((_, key) => (
                            <Skeleton className="w-full h-5" key={key} />
                        ))}
                    </div>
                </div>
            ) : (
                <section className='py-10 px-5 md:px-40 flex flex-col gap-6 md:gap-10'>
                    <div className="flex justify-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="font-medium text-sm leading-5 text-slate-600">{moment(articles?.createdAt).format("MMMM D, YYYY")}</div>
                                <div className="w-1 h-1 rounded-full bg-slate-600"></div>
                                <div className="font-medium text-sm leading-5 text-slate-600">Created by {articles?.user?.username}</div>
                            </div>
                            <div className="font-semibold md:text-3xl text-2xl md:leading-9 leading-8 text-center max-w-2xl break-words">{articles?.title}</div>
                        </div>
                    </div>

                    <div className="">
                        {articles?.imageUrl && (
                            <Image src={articles?.imageUrl} alt='content-image' priority={true} width={2000} height={100} className='h-80 md:h-[700px] object-cover rounded-[12px]'/>
                        )}
                    </div>

                    {articles?.content && (
                        <SafeHTML html={articles?.content} />
                    )}
                </section>
            )}

            <section className="pt-10 px-5 md:px-[180px] pb-[60px] md:pb-[100px]">
                <div className="flex flex-col gap-6">
                    <h2 className="font-bold text-lg md:text-xl leading-7 text-slate-900">Other Articles</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filterByCategory ? (
                            filterByCategory?.map((data: ArticleProps, index: number) => (
                                <div className="flex flex-col gap-[16px] overflow-hidden" key={index}>
                                    <Link href={`/article/${data.id}`} className="overflow-hidden">
                                        <Image src={data.imageUrl} alt="article-image" priority={true} className="w-full h-80 object-cover rounded-[12px]" width={600} height={400}/>
                                    </Link>
    
                                    <div className="flex flex-col gap-[8px]">
                                        <div className="text-slate-600 text-xs md:text-[14px] leading-4 md:leading-[20px] font-normal">
                                            {moment(data?.createdAt).format("MMMM D, YYYY")}
                                        </div>
                                        
                                        <div className="text-base md:text-lg font-semibold leading-6 md:leading-7">
                                            {data.title}
                                        </div>
                                        
                                        <div className="text-sm leading-5 md:text-base md:leading-6 truncate">
                                            {data.content}
                                        </div>
    
                                        <div className="flex gap-2">
                                            <div className="text-xs leading-4 md:text-sm md:leading-5 px-3 py-1 text-blue-900 font-normal bg-blue-200 rounded-[100px]">{data.category.name}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            Array.from({ length: 3 }).map((_, index) => (
                                <div className="flex flex-col gap-4" key={index}>
                                    <Skeleton className="w-full h-80"/>

                                    <div className="flex flex-col gap-2">
                                        <Skeleton className="w-20 h-2" />

                                        <div className="flex flex-col gap-1">
                                            <Skeleton className="w-full h-5" />
                                            <Skeleton className="w-3/4 h-5" />
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <Skeleton className="w-full h-2" />
                                            <Skeleton className="w-full h-2" />
                                        </div>

                                        <Skeleton className="w-1/4 rounded-full h-6"/>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}