import { sanityFetch } from "../lib/live";
import {
  ALL_PRODUCTS,
  BLOG_CATEGORIES,
  GET_ALL_BLOG,
  LATEST_BLOG_QUERY,
  MY_ORDERS_QUERY,
  OTHERS_BLOG_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  SINGLE_BLOG_QUERY,
} from "./query";

const getLatestBlogs = async () => {
  try {
    const { data } = await sanityFetch({ query: LATEST_BLOG_QUERY });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching latest blogs:", error);
    return [];
  }
};

const getAllProducts = async () => {
  try {
    const { data } = await sanityFetch({ query: ALL_PRODUCTS });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching all products:", error);
    return [];
  }
};

const getProductBySlug = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
    });
    return data ?? null;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
};

const getAllBlogs = async (quantity: number) => {
  try {
    const { data } = await sanityFetch({
      query: GET_ALL_BLOG,
      params: { quantity },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching blogs:", error);
    return [];
  }
};

const getSingleBlog = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: SINGLE_BLOG_QUERY,
      params: { slug },
    });
    return data ?? null;
  } catch (error) {
    console.log("Error fetching single blog:", error);
    return null;
  }
};

const getBlogCategories = async () => {
  try {
    const { data } = await sanityFetch({ query: BLOG_CATEGORIES });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching blog categories:", error);
    return [];
  }
};

const getOthersBlog = async (slug: string, quantity: number) => {
  try {
    const { data } = await sanityFetch({
      query: OTHERS_BLOG_QUERY,
      params: { slug, quantity },
    });
    return data ?? [];
  } catch (error) {
    console.log("Error fetching other blogs:", error);
    return [];
  }
};

const getMyOrders = async (userId: string) => {
  try {
    const orders = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId },
    });
    return orders?.data || null;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return null;
  }
};

export {
  getLatestBlogs,
  getAllProducts,
  getProductBySlug,
  getAllBlogs,
  getSingleBlog,
  getBlogCategories,
  getOthersBlog,
  getMyOrders,
};
