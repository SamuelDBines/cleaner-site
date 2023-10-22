import { Server, WebSocketHandler } from "bun";
import { BunResponse } from "./Response";
import {
  RequestMethod,
  Handler,
  BunRequest,
  SSLOptions,
  RequestMapper,
  RequestMethodType,
} from "./Request";
import { ExtraHandler, RestSocketHandler } from "./Websocket";
import { Router } from "./Router";
import { Chain } from "./Chain";

export function server() {
  return BunServer.instance;
}


const router = new Router('/');
router.use((req: Request, res: Response, next) => {
  console.log('middleware');
  next();
});
class BunServer {
  // singleton bun server
  private static server?: BunServer;

  constructor() {
    if (BunServer.server) {
      throw new Error(
        "DONT use this constructor to create bun server, try Server()"
      );
    }
    BunServer.server = this;
  }

  static get instance() {
    return BunServer.server ?? (BunServer.server = new BunServer());
  }

  private readonly errorHandlers: Handler[] = [];
  private readonly routers: Router[] = [];
  private webSocketHandler: WebSocketHandler | undefined;


  ws(msgHandler: RestSocketHandler, extra: ExtraHandler | null = null) {
    this.webSocketHandler = {
      message: msgHandler,
      open: extra?.open,
      close: extra?.close,
      drain: extra?.drain,
    };
  }

  use(middleware: Handler): void;

  use(path: string, router: Router): void;

  /**
   * Attch middleware or router or global error handler
   * @param arg1
   * @param arg2
   */
  use(arg1: string | Handler, arg2?: Router) {
    // pass router
    if (arg2 && typeof arg1 === "string") {
      arg2.attach(arg1);
    }
    // pass middleware or global error handler
    else {
      if (arg1.length === 3) {
        this.middlewares.push({
          path: "*",
          middlewareFunc: arg1 as Handler,
        });
      } else if (arg1.length === 4) {
        this.errorHandlers.push(arg1 as Handler);
      }
    }
  }

  router() {
    return new Router(this.requestMap, this.middlewares, this.submitToMap);
  }

  listen(
    port: string | number,
    callback?: () => void,
    options?: SSLOptions
  ): Server {
    const baseUrl = "http://localhost:" + port;
    callback?.call(null);
    return this.openServer(port, baseUrl, options);
  }

  private openServer(
    port: string | number,
    baseUrl: string,
    options?: SSLOptions
  ): Server {
    const that = this;
    return Bun.serve({
      port,
      keyFile: options?.keyFile,
      certFile: options?.certFile,
      passphrase: options?.passphrase,
      caFile: options?.caFile,
      dhParamsFile: options?.dhParamsFile,
      lowMemoryMode: options?.lowMemoryMode,
      development: process.env.SERVER_ENV !== "production",
      async fetch(req1: Request) {

        return Response('hello world');
      },
      websocket: this.webSocketHandler,
      error(err: Error) {
        const res = that.responseProxy();
        // basically, next here is to ignore the error
        const next = () => { };
        that.errorHandlers.forEach((handler) => {
          // * no request object pass to error handler
          handler.apply(that, [null, res, err, next]);
        });

        if (res.isReady()) {
          return res.getResponse();
        }
      },
    });
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

  private responseProxy(): BunResponse {
    const bunResponse = new BunResponse();
    return new Proxy(bunResponse, {
      get(target, prop, receiver) {
        if (
          typeof target[prop] === "function" &&
          (prop === "json" || prop === "send") &&
          target.isReady()
        ) {
          throw new Error("You cannot send response twice");
        } else {
          return Reflect.get(target, prop, receiver);
        }
      },
    });
  }
}