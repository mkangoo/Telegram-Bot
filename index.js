const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

const commandList = require('./commands');
const commonGreeting = require('./greetings');
const buttonProcessing = require('./button');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  const name = ctx.message.from.first_name;
  const userGreeting = `Привет, ${name ? name : 'User!'}!`;
  const fullGreeting = `${userGreeting}\n${commonGreeting}`;
  ctx.reply(fullGreeting);
});

bot.help((ctx) => ctx.reply(commandList.commands));

bot.command('schedule', async (ctx) => {
  try {
    const isEvenWeek = new Date().getWeek() % 2 === 0;

    const dayButtons = [
      [Markup.button.callback('Понедельник', 'mondayButton')],
      [Markup.button.callback('Вторник', isEvenWeek ? 'btnE2' : 'btnOdd2')],
      [Markup.button.callback('Среда', isEvenWeek ? 'btnE3' : 'btnOdd3')],
      [Markup.button.callback('Четверг', isEvenWeek ? 'btnE4' : 'btnOdd4')],
      [Markup.button.callback('Пятница', isEvenWeek ? 'btnE5' : 'btnOdd5')],
      [Markup.button.callback('Суббота', isEvenWeek ? 'btnE6' : 'btnOdd6')]
    ];

    await ctx.replyWithHTML(
      `<b>Выберите день:</b>`,
      Markup.inlineKeyboard(dayButtons)
    );
  } catch (error) {
    console.error(error);
  }
});


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

addActionBot('mondayButton', buttonProcessing.schedule.monday.lessons);

addActionBot('btnE2', buttonProcessing.tuesday);
addActionBot('btnE3', buttonProcessing.wensday);
addActionBot('btnE4', buttonProcessing.thursday);
addActionBot('btnE5', buttonProcessing.friday);
addActionBot('btnE6', buttonProcessing.saturday);

addActionBot('btnOdd2', buttonProcessing.oddTuesday);
addActionBot('btnOdd3', buttonProcessing.oddWednesday);
addActionBot('btnOdd4', buttonProcessing.oddThursday);
addActionBot('btnOdd5', buttonProcessing.oddFriday);
addActionBot('btnOdd6', buttonProcessing.oddSaturday);

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
