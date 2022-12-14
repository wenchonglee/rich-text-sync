import { cors, mongoose, oak } from "./deps.ts";
import { router } from "./router.ts";
import "./watch.ts";

if (typeof Deno.env.get("MONGO_URI") !== "string") throw "Env var MONGO_URI is required";
await mongoose.connect(Deno.env.get("MONGO_URI") as string);
mongoose.set("debug", true);

const app = new oak.Application();
const PORT = 3000;

app.use(cors.oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

// not recommended, purely done because this is a POC
app.use(async (ctx, next) => {
  try {
    // ref: https://deno.com/blog/deploy-static-files
    await ctx.send({
      root: `${Deno.cwd()}/dist`,
      index: "index.html",
    });
  } catch {
    // function must return a promise: https://github.com/oakserver/oak/issues/148
    await next();
  }
});

// hacky solution to fallthrough all remaining paths to webapp
app.use(async (ctx, next) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/dist`,
      index: "index.html",
      path: "/",
    });
  } catch {
    await next();
  }
});

console.log(`Server listening on port ${PORT}`);
await app.listen({ port: PORT });
