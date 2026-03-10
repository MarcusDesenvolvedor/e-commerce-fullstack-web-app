import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getOrCreateUserFromClerk } from "@/lib/clerk-user";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const clerkUserData = await currentUser();
    const email =
      clerkUserData?.emailAddresses?.[0]?.emailAddress ?? "user@example.com";
    const fullName =
      [clerkUserData?.firstName, clerkUserData?.lastName]
        .filter(Boolean)
        .join(" ") || "Customer";

    const user = await getOrCreateUserFromClerk(userId, email, fullName);

    return NextResponse.json({
      data: {
        document: user.document ?? null,
        phone: user.phone ?? null,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const clerkUserData = await currentUser();
    const email =
      clerkUserData?.emailAddresses?.[0]?.emailAddress ?? "user@example.com";
    const fullName =
      [clerkUserData?.firstName, clerkUserData?.lastName]
        .filter(Boolean)
        .join(" ") || "Customer";

    const user = await getOrCreateUserFromClerk(userId, email, fullName);

    const body = await request.json();
    const document = (body.document as string)?.trim() || null;
    const phone = (body.phone as string)?.trim() || null;

    if (document !== null && document.length > 20) {
      return NextResponse.json(
        { error: "Document max 20 characters" },
        { status: 400 }
      );
    }
    if (phone !== null && phone.length > 20) {
      return NextResponse.json(
        { error: "Phone max 20 characters" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(document !== undefined && { document }),
        ...(phone !== undefined && { phone }),
      },
    });

    return NextResponse.json({
      data: {
        document: updated.document ?? null,
        phone: updated.phone ?? null,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
