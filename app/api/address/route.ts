import { NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Email not found" }, { status: 400 });
  }

  const body = await req.json();

  try {
    if (body.default) {
      await backendClient
        .patch({
          query: `*[_type=="address" && email==$email]`,
          params: { email },
        })
        .set({ default: false })
        .commit();
    }

    const doc = await backendClient.create({
      _type: "address",
      name: body.name,
      email,
      address: body.address,
      kelurahan: body.kelurahan,
      kecamatan: body.kecamatan,
      city: body.city,
      province: body.province,
      postalCode: body.postalCode,
      default: body.default ?? false,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(doc);
  } catch (err) {
    console.error("Create address error:", err);
    return NextResponse.json(
      { error: "Faileda to create address" },
      { status: 500 }
    );
  }
}
