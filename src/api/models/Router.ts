import {
  BunRequest,
  Handler,
} from "./Request";
import path from "path";
// import { encodeBase64 } from "../utils/base64";

export interface RouterHandler {
  handler: Handler;
  path: string;
}

export class Router {

  private _path: string = "";
  private _subRouters: Router[] = [];
  private _relatedRouters: Router[] = [];
  private parentRouter: Router | null = null;

  private _middleware: RouterHandler[] = [];
  private _queries: RouterHandler[] = [];
  private _mutations: RouterHandler[] = [];

  constructor(path: string, parentRouter: Router | null = null, relatedRouters: Router[] = []) {
    this._path = path;
    this.parentRouter = parentRouter;
    this._relatedRouters = relatedRouters;
  }

  public use(type: 'query' | 'mutate' | 'middleware' | 'none', name: string, handler: Handler) {
    const routerHandler: RouterHandler = {
      handler,
      path: path.join(this._path, name)
    };
    if (type === 'query') {
      this._queries.push(routerHandler);
    } else if (type === 'mutate') {
      this._mutations.push(routerHandler);
    } else if (type === 'middleware') {
      this._middleware.push(routerHandler);
    }
  }

  get middleware() {
    return this._middleware;
  }

  private addSubRouters(routers: string[]) {
    this._subRouters = routers.map((router) => (new Router(path.join(this._path, router), this)));
  }

  private get subRouters() {
    return this._subRouters;
  }

  private async bunRequest(req: Request): Promise<BunRequest> {
    const { searchParams, pathname } = new URL(req.url);
    const newReq: BunRequest = {
      method: req.method,
      path: pathname,
      request: req,
      query: {},
      params: {},
      headers: {},
      originalUrl: req.url,
    };

    // append query params
    const query = {};
    searchParams.forEach((v, k) => {
      newReq.query[k] = v;
    });

    // receive request body as string
    const bodyStr = await req.text();
    try {
      newReq.body = JSON.parse(bodyStr);
    } catch (err) {
      newReq.body = bodyStr;
    }
    req.arrayBuffer;
    newReq.blob = req.blob();

    req.headers.forEach((v, k) => {
      newReq.headers[k] = v;
    });

    return newReq;
  }


  public async HandleRequest(req: Request) {
    const data = {};
    await Promise.all(this._middleware.map(async (middleware) => {
      console.log(middleware);
      const request = await this.bunRequest(req);
      data[middleware.path] = await middleware.handler(request);
    }));

    let handler: RouterHandler | undefined;
    let request: BunRequest = await this.bunRequest(req);
    const { pathname } = new URL(req.url);

    console.log(req.method, pathname);
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
      handler = await this._queries.find((query) => query.path === pathname);
      console.log(this._queries);
      console.log("This is a handler", handler);
      if (handler) {
        return await handler.handler(request, data);
      }
    } else {
      handler = await this._mutations.find((mutations) => mutations.path === pathname);
      if (handler) {
        return await handler.handler(request, data);
      }
    }
    return null;
  }
}