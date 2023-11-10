const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();
const commandList = require("./commands");
const commonGreeting = require("./greetings");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  const name = ctx.message.from.first_name;
  const userGreeting = `Привет, ${name ? name : "User!"}!`;
  const fullGreeting = `${userGreeting}\n\n${commonGreeting}`;
  ctx.reply(fullGreeting);
});

bot.help((ctx) => ctx.reply(commandList.commands));

bot.command("schedule", async (ctx) => {
  try {
    await ctx.replyWithHTML(
      "<b>Выберите день:</b>",
      Markup.inlineKeyboard([
        [Markup.button.callback("Понедельник", "btn1")],
        [Markup.button.callback("Вторник", "btn2")],
        [Markup.button.callback("Среда", "btn3")],
        [Markup.button.callback("Четверг", "btn4")],
        [Markup.button.callback("Пятница", "btn5")],
        [Markup.button.callback("Суббота", "btn6")],
      ])
    );
  } catch (error) {
    console.error(error);
  }
});

function addActionBot(name, src, text) {
  bot.action(name, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      if (src) {
        await ctx.replyWithPhoto(
          { source: src },
          { caption: text, disable_web_page_preview: true }
        );
      } else {
        await ctx.replyWithHTML(text, { disable_web_page_preview: true });
      }
    } catch (error) {
      console.error(error);
    }
  });
}

addActionBot("btn1", "./img/1.jpg", commandList.text1);
addActionBot("btn2", "./img/2.jpg", commandList.text2);
addActionBot("btn3", false, commandList.text3);
addActionBot("btn4", false, commandList.text4);
addActionBot("btn5", false, commandList.text5);
addActionBot("btn6", false, commandList.text6);

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
