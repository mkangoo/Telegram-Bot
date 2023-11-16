const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();

const commandList = require("./commands");
const commonGreeting = require("./greetings");
const buttonProcessing = require("./button");
const bot = new Telegraf(process.env.BOT_TOKEN);

// function even or odd week
Date.prototype.getWeek = function () {
  const target = new Date(this.valueOf());
  const dayNr = (this.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000);
};

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

function getCurrentWeek() {
  const currentDate = new Date();
  const weekNumber = currentDate.getWeek();
  return weekNumber % 2 === 0;
}

function addActionBot(name, button) {
  bot.action(name, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      await ctx.replyWithHTML(button, { disable_web_page_preview: true });
    } catch (error) {
      console.error(error);
    }
  });
}

addActionBot("btn1", buttonProcessing.monday);
addActionBot("btn2", buttonProcessing.tuesday);
addActionBot("btn3", buttonProcessing.wensday);
addActionBot("btn4", buttonProcessing.thursday);
addActionBot("btn5", buttonProcessing.friday);
addActionBot("btn6", buttonProcessing.saturday);

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
