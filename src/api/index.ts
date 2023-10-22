import { IServer } from "@/packages/interfaces/IServer";


export function ServerHandler(req: Request) {
  console.log(req.url);
  const { pathname } = new URL(req.url);
}