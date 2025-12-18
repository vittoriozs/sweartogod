import Container from "@/components/Container";
import Title from "@/components/Title";
import { urlFor } from "@/sanity/lib/image";
import { getAllBlogs } from "@/sanity/queries";
import dayjs from "dayjs";
import { Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogPage = async () => {
  const blogs = await getAllBlogs(6);

  return (
    <div className="my-5 lg:mt-2.5 lg:mb-7.5">
      <Container>
        <Title>Blog page</Title>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 md:mt-10">
          {blogs?.map((blog) => (
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
              <div className="bg-gray-100 p-5">
                <div className="text-xs flex items-center gap-5">
                  <div className="flex items-center relative group cursor-pointer">
                    {blog?.blogcategories?.map((item, index) => (
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
                    <Calendar size={15} />{" "}
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
      </Container>
    </div>
  );
};

export default BlogPage;
