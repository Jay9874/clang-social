import Link from 'next/link';
import { TfiReload } from 'react-icons/tfi';
import { useRouter } from 'next/router';

export default function Custom500() {
    const router = useRouter();
    return (
        <div className="flex flex-col justify-center items-center">
            <h1>Server Error</h1>
            <h2>Return to Home page</h2>
            <div className="border-b-2 rounded-full p-2 flex justify-center items-center bg-[#F51997] border-gray-200 xl:pb-4">
                <a href="https://clang-social.vercel.app/"><p className="text-white"><TfiReload /></p></a>
            </div>
        </div>
    )
}