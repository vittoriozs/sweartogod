import React from "react";
import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import CartButton from "./CartButton";
import FavoriteButton from "./FavoriteButton";
import SignIn from "./SignIn";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, SignedIn, UserButton } from "@clerk/nextjs";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import { Logs } from "lucide-react";
import { getMyOrders } from "@/sanity/queries";

const Header = async () => {
  const user = await currentUser();
  const { userId } = await auth();
  let orders = null;
  if (userId) {
    orders = await getMyOrders(userId);
  }

  return (
    <header className="bg-white py-5 sticky top-0 z-50">
      <Container className="flex items-center justify-between">
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>
        <HeaderMenu />
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <CartButton />
          <FavoriteButton />
          <ClerkLoaded>
            <SignedIn>
              <Link
                href={"/orders"}
                className="group relative hover:text-dark-grey hoverEffect"
              >
                <Logs />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
                  {orders?.length ? orders?.length : 0}
                </span>
              </Link>
              <UserButton />
            </SignedIn>
            {!user && <SignIn />}
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
};

export default Header;
