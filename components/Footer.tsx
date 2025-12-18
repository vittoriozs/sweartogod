import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import SocialMedia from "./SocialMedia";
import { SubTitle } from "./ui/text";
import { catagoriesData, quickLinksData } from "@/constants/data";
import Link from "next/link";
import { MapPin } from "lucide-react";
import FooterTop from "./FooterTop";

const Footer = () => {
  return (
    <footer>
      <Container>
        <FooterTop />
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm">Lorem ipsum dolor sit amet consectetur</p>
            <SocialMedia
              className="text-black/80"
              iconClassName="border-black/80 hover:border-dark-grey hover:text-dark-grey"
              tooltipClassName="bg-black text-white"
            />
          </div>
          <div>
            <SubTitle>Quick Links</SubTitle>
            <ul className="space-y-2 mt-4">
              {quickLinksData?.map((item) => (
                <li key={item?.title}>
                  <Link
                    href={item?.href}
                    className="hover:text-dark-grey hoverEffect font-medium"
                  >
                    {item?.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div>
              <SubTitle>Categories</SubTitle>
              <ul className="space-y-2 mt-4">
                {catagoriesData?.map((item) => (
                  <li key={item?.title}>
                    <Link
                      href={`/categories/${item?.href}`}
                      className="hover:text-dark-grey hoverEffect font-medium"
                    >
                      {item?.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <MapPin className="h-8 w-8" />
            <div>
              <h3 className="font-semibold">Visit Us</h3>
              <p>Jakarta, Indonesia</p>
            </div>
          </div>
        </div>
        <div className="py-6 border-t text-center text-sm text-gray-600">
          <div>
            © {new Date().getFullYear()}
            {""} <Logo className="text-sm" />. All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
