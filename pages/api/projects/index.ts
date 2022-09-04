// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@prisma";
import to from "await-to-js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const action = prisma.user.findUnique({
    where: req.query,
    select: { projects: true },
  });
  const [err, data] = await to(action);
  if (err) res.status(500).json(err);
  else if (data) res.status(200).json(data);
  else res.status(404).send("Not found");
}
