import { RequestMethodType } from "@/api/models/Request";

export function ServerHandler(req: Request) {
  console.log(req.url);
  const { pathname } = new URL(req.url);
  if (req.method === RequestMethodType.GET) {
    // Query 
  } else {
    // Mutating
  }
}