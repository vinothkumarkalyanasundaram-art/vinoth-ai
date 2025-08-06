'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from "react";

interface Post {
    id: number;
    title: string;
    body: string;
    link: string;
    image: string;
    overview:string;
    duration:string;
    teamSize: string;
}

export default function Projects() {
    const [data, setData] = useState<Post[] | null>(null); // Define the type
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchData = async () => {
            setLoading(true); // Start loading
            try {
                const response = await fetch("/api/projects");
                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }
                const result = await response.json();
                setData(result); // Set the fetched data
            } catch (err) {
                // setError(err); 
                // Set error if any
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchData();
        // }
    }, []);

    // console.log(projects);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return <div>No data available</div>;
    }

    return (
        <>
            <div className="divide-y divide-gray-200 dark:divide-gray-900">

                <div className="space-y-2 pt-6 pb-8 md:space-y-5">
                    <h1 className="text-3xl font-extrabold leading-9 tracking-light text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">Projects</h1>
                </div>
                <div className="h-auto align-center py-8">
                    Most familier projects which I involved individually and developed with a team in my 16 years experience. Also I got lot of opportunities to work with <b>Insurance Domain</b>, <b>Healthcare Products</b> and web application, <b>Blogs</b>, <b>Event Booking</b> and etc. Alo I handled team around <b>14</b> to <b>49</b> when I was working as a Lead.
                </div>
                <div className="grid gap-4 sm:grid-cols-1 md:gap-6 lg:grid-cols-3 lg:gap-4 p-8">


                    {data?.map((projects: any) => (
                        <article key={projects?.id} className="overflow-hidden dark:border-zinc-600 rounded-lg bg-white shadow-lg dark:bg-black dark:shadow-gray-900 shadow-gray-400">
                            <Link href={projects.link} target='_blank'>
                                <div className="h-56 w-full relative">
                                    <Image src={projects?.image} fill alt={projects.title} priority className="w-full h-full object-cover" />
                                </div>
                            </Link>
                            <div className="p-6">
                                <Link href={projects?.link} target="_blank">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        {projects?.title}
                                    </h3>
                                </Link>
                                <p className="line-clamp-3 mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{projects?.overview}
                                </p>
                                <p className="line-clamp-3 mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">Team Size: {projects?.teamSize}
                                </p>
                                <p className="line-clamp-3 mt-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400">Duration: {projects?.duration}
                                </p>
                                <Link href={projects?.link} target='_blank' className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-500">
                                    Read More
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </>)
}