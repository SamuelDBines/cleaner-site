import { Hono } from "hono";
import { User } from "../../packages/models/User";

export const UserRouter = new Hono();

UserRouter.get("/", async (c) => {
  const users = await User.find();
  return c.json(users);
});