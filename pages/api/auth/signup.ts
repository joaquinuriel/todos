import prisma from "@prisma";
import { to } from "await-to-js";
import type { NextApiRequest, NextApiResponse } from "next";

interface Data {
  email: string;
  username: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest & { body: Data },
  res: NextApiResponse
) {
  const { email, ...create } = req.body;
  const action = prisma.user.update({
    where: { email },
    data: { credentials: { create } },
  });
  const [err, data] = await to(action);
  if (err) res.status(500).json(err);
  else if (data) res.status(200).json(data);
  else res.status(404).send("Not found");
}
