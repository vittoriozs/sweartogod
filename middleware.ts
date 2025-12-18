import {
  clerkMiddleware,
  createRouteMatcher,
  clerkClient,
} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isStudioRoute = createRouteMatcher(["/studio(.*)"]);

type PublicMetadata = {
  role?: "admin" | "user";
};

export default clerkMiddleware(async (auth, req) => {
  if (isStudioRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    const publicMetadata = user.publicMetadata as PublicMetadata;

    if (publicMetadata?.role !== "admin") {
      return NextResponse.redirect(new URL("/error", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
