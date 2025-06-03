"use server"

import Image from 'next/image'
import WhiteLogo from '@/app/assets/white-logo.png';
import ArticleContent from './content';
import NavbarArticle from '../components/navbar-article';
export default async function ArticleDetail({ params } : { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    return (
        <main className='flex flex-col min-h-screen'>
            <NavbarArticle />

            <div className="flex-1">
                <ArticleContent id={slug} />
            </div>

            <footer className="bg-[#2563EBDB] h-[100px] flex items-center justify-center">
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
                    <Image src={WhiteLogo} alt="white-logo" />
                    <div className="text-white text-sm md:text-base leading-5 md:leading-6 font-normal">&copy; 2025 Blog genzet. All rights reserved.</div>
                </div>
            </footer>
        </main>
    )
}