import FavoriteProducts from "@/components/FavoriteProducts";
import NoAccess from "@/components/NoAccess";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const WishListPage = async () => {
  const user = await currentUser();
  return (
    <>
      {user ? (
        <FavoriteProducts />
      ) : (
        <NoAccess details="Log in to view your favorite items. Don’t miss out on your cart products to make the payment!" />
      )}
    </>
  );
};

export default WishListPage;
