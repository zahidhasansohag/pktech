import { prisma } from "@/lib/prisma";

export async function POST(req) {

  const body = await req.json();

  const product = await prisma.product.create({
    data: body,
  });

  return Response.json(product);
}