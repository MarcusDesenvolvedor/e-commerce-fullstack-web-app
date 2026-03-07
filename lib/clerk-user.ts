import { prisma } from "./db";

export async function getOrCreateUserFromClerk(
  clerkId: string,
  email: string,
  fullName: string
) {
  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId,
        email,
        fullName: fullName || "Customer",
        passwordHash: "clerk-auth", // Placeholder for Clerk-only users
      },
    });
  }

  return user;
}
