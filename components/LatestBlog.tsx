import React from "react";
import Title from "./Title";
import { getLatestBlogs } from "@/sanity/queries";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";

const LatestBlog = async () => {
  const blogs = await getLatestBlogs();
  return (
    <div className="my-7.5 lg:my-15">
      <Title>Latest Blog</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-7.5">
        {blogs?.map((blog: any) => (
          <div
            key={blog?._id}
            className="rounded-lg overflow-hidden bg-white shadow-sm"
          >
            {blog?.mainImage && (
              <Link href={`/blog/${blog?.slug?.current}`}>
                <div className="w-full h-60 lg:h-64 overflow-hidden rounded-t-lg">
                  <Image
                    src={urlFor(blog.mainImage).url()}
                    alt="blogImage"
                    width={500}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            )}
            <div className="bg-white p-5 rounded-b-lg">
              <div className="text-xs flex items-center gap-5">
                <div className="flex items-center relative group cursor-pointer">
                  {blog?.blogcategories?.map((item: any, index: any) => (
                    <p
                      key={index}
                      className="font-semibold text-black tracking-wider 
                 group-hover:text-dark-grey transition-colors"
                    >
                      {item?.title}
                    </p>
                  ))}

                  <span
                    className="absolute left-0 -bottom-1.5 bg-dark-grey 
                   inline-block w-full h-0.5 
                   group-hover:bg-light-grey transition-colors"
                  />
                </div>

                <p className="flex items-center gap-1 text-c relative group hover:cursor-pointer hover:text-dark-grey hoverEffect">
                  <Calendar size={15} />
                  {dayjs(blog.publishedAt).format("D MMMM YYYY")}
                  <span className="absolute left-0 -bottom-1.5 bg-dark-grey inline-block w-full h-0.5 group-hover:bg-light-grey hoverEffect" />
                </p>
              </div>

              <Link
                href={`/blog/${blog?.slug?.current}`}
                className="text-base font-semibold tracking-wide mt-5 line-clamp-2 hover:text-dark-grey hoverEffect block"
              >
                {blog?.title}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestBlog;
