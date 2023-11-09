const { Telegraf } = require("telegraf");
require("dotenv").config();
const commandsList = require("./commands");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
  const name = ctx.message.from.first_name;
  ctx.reply(`Привет, ${name ? name : "User!"}!`);
});
bot.help((ctx) => ctx.reply(commandsList.commands));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
