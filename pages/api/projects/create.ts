import { to } from "await-to-js";
import prisma from "@prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, id } = req.body;
  const action = prisma.project.create({
    data: { name, users: { connect: { id } } },
  });
  const [err, data] = await to(action);
  if (err) res.status(500).json(err);
  else if (data) res.status(200).json(data);
  else res.status(404).send("Not found");
}
