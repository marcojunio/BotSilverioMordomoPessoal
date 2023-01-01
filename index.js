const { Telegraf } = require('telegraf');
const func = require('./functions/scrapPageFundsExplorer');

const dotenv = require('dotenv');
dotenv.config();

const bot = new Telegraf(process.env.API_KEY_BOT, {
    polling: true
});

bot.use(async (ctx, next) => {
    console.time(`Processing update ${ctx.update.update_id}`);
    await next();
    console.timeEnd(`Processing update ${ctx.update.update_id}`);
})

bot.on('message', async (ctx) => {
    const response = await func.searchInfoAboutTicket({ ticket: ctx.message.text });

    if (!response.data.length) {
        ctx.reply('Nenhuma ação encontrada com o ticket informado.');
        return;
    }

    ctx.reply(func.formatResponse(response));
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));