import React from "react";
import { Title } from "./ui/text";
import Link from "next/link";
import Image from "next/image";
import { banner_1, banner_3 } from "@/images";

const Hero = () => {
  return (
    <div className="py-16 md:py-0 bg-hero-1 px-10 lg:px-24 flex items-center justify-between">
      <div className="space-y-5">
        <Title>Essential Winter Collection 2025</Title>
        <Link
          href={"/shop"}
          className="bg-black text-white px-5 py-2 rounded-md text-sm font-semibold hover:bg-dark-grey hoverEffect"
        >
          Shop Now
        </Link>
      </div>
      <div>
        <Image
          src={banner_1}
          alt="banner_1"
          className="hidden md:inline-flex w-96"
        />
      </div>
    </div>
  );
};

export default Hero;
