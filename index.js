import Telegraf from "telegraf";
import telegrafCommandParts from "telegraf-command-parts";
import Koa from "koa";
import Router from "@koa/router";
import koaBody from "koa-body";
import koajwt from "koa-jwt";
import jwt from "jsonwebtoken";

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(telegrafCommandParts());

const app = new Koa();
const router = new Router();

router.post("/push", (ctx) => {
  bot.telegram.sendMessage(ctx.state.user.id, ctx.request.body);
  ctx.status = 200;
});

app.use(koajwt({ secret: process.env.APP_SECRET }));
app.use(koaBody());
app.use(router.allowedMethods());
app.use(router.routes());
app.listen(process.env.PORT);

bot.start((ctx) => {
  ctx.reply("Welcome");
});

bot.command("whatismyjwt", (ctx) => {
  if (ctx.state.command.args === process.env.APP_TOKEN) {
    ctx.reply(jwt.sign(ctx.from, process.env.APP_SECRET));
  } else {
    ctx.reply("403 Forbidden");
  }
});

bot.launch();
