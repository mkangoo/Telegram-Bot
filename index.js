const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();
const commandsList = require("./commands");

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
  const name = ctx.message.from.first_name;
  ctx.reply(`Привет, ${name ? name : "User!"}!`);
});
bot.help((ctx) => ctx.reply(commandsList.commands));

bot.command("schedule", (ctx) => {
  try {
    ctx.replyWithHTML(
      "<b>Расписание:</b>",
      Markup.inlineKeyboard([
        [Markup.button.callback("Понедельник", "btn1")],
        [Markup.button.callback("Вторник", "btn2")],
        [Markup.button.callback("Среда", "btn3")],
        [Markup.button.callback("Четверг", "btn4")],
        [Markup.button.callback("Пятница", "btn5")],
        [Markup.button.callback("Суббота", "btn6")],
      ])
    );
  } catch (Error) {
    console.error(Error);
  }
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
