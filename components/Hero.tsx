import React from "react";
import Link from "next/link";
import Image from "next/image";
import { banner_1, banner_2 } from "@/images";

const Hero = () => {
  return (
    <section className="relative h-[92vh] w-full">
      <Image
        src={banner_1}
        alt="Hero Background"
        fill
        priority
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/25" />
      <div className="relative z-10 h-full flex items-center justify-end">
        <div className="px-6 lg:px-24 max-w-2xl text-white space-y-4 text-right">
          <h1 className="text-4xl md:text-5xl lg:text-5xl whitespace-nowrap leading-none">
            The New Standard.
          </h1>

          <p className="m-0 text-base md:text-lg text-white/90 mb-6">
            New arrivals that step into every moment with style
          </p>

          <div className="flex gap-4 justify-end">
            <Link
              href="/category/featured"
              className="bg-black text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-dark-grey hoverEffect"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
