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
    const isEvenWeek = getCurrentWeek();

    const dayButtons = [
      [Markup.button.callback("Понедельник",isEvenWeek ? "btnEven1" : "btnOdd1")],
      [Markup.button.callback("Вторник", isEvenWeek ? "btnEven2" : "btnOdd2")],
      [Markup.button.callback("Среда", isEvenWeek ? "btnEven3" : "btnOdd3")],
      [Markup.button.callback("Четверг", isEvenWeek ? "btnEven4" : "btnOdd4")],
      [Markup.button.callback("Пятница", isEvenWeek ? "btnEven5" : "btnOdd5")],
      [Markup.button.callback("Суббота", isEvenWeek ? "btnEven6" : "btnOdd6")],
    ];

    await ctx.replyWithHTML(
      `<b>Выберите день:</b>`,
      Markup.inlineKeyboard(dayButtons)
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

addActionBot("btnEven1", buttonProcessing.monday);
addActionBot("btnEven2", buttonProcessing.tuesday);
addActionBot("btnEven3", buttonProcessing.wensday);
addActionBot("btnEven4", buttonProcessing.thursday);
addActionBot("btnEven5", buttonProcessing.friday);
addActionBot("btnEven6", buttonProcessing.saturday);

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
