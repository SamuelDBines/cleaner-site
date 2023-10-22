import { User } from "@/packages/models/User";
import { Account } from "@/packages/models/Account";

import { renderToReadableStream } from "react-dom/server";
// import Test from "./test.tsx";
// import { Server } from "@/api/index.ts";
import { Router } from "@/api/models/Router";


export function second() {
  return function (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
    console.log('=>', target, propertyKey, descriptor);
    console.log('==>', Object.getOwnPropertyNames(target));
  };
}


const builds = await Bun.build({
  entrypoints: ['./main.tsx'],
  target: "browser",
  minify: {
    identifiers: true,
    syntax: true,
    whitespace: true,
  },
});

// const user = new User();
// user.find();
// console.log(user.name);
// console.log(user.method());


// const serverConfig = new Server("My Server", 3000, [
//   {
//     path: "/",
//     method: "GET",
//     handler: "",
//   },
// ]);

const indexFile = Bun.file('index.html');

const router = new Router('/api');

// class AnewTest {
//   @second()
//   users(req, res) {
//     return {
//       message: 'You knob'
//     };
//   };
// }

// const routes = new AnewTest();
// router.use('middleware', "users", routes.users);

// router.use('query', "/", (req, data) => {
//   console.log('Hey there');
//   return 'Hey';
// });

// router.use('query', "/users", (req, data) => {
//   console.log('Hey there from users');
//   return 'Hey';
// });

const server = Bun.serve({
  port: 3005,
  async fetch(req) {
    try {
      const { pathname } = new URL(req.url);

      if (pathname === "/main.js" && req.method === "GET") {
        return new Response(builds.outputs[0].stream(), {
          headers: {
            'Content-Type': builds.outputs[0].type,
          },
        });
      };
      if (pathname === "/" && req.method === "GET") {
        const indexContent = await indexFile.text();
        return new Response(indexContent, {
          headers: {
            'Content-Type': 'text/html',
          },
        });
      }
      // const result = await router.HandleRequest(req);
      // const result = await user.router.HandleRequest(req);
      // return new Response(JSON.stringify(result), {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
    } catch (err: any) {
      return new Response(err.message, { status: 404 });
    }
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
