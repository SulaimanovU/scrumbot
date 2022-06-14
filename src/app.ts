// external imports
import TelegramBot from 'node-telegram-bot-api';

// internal imports
import DataSourceConnect from './db/datasource';
import CommandHandler from './module/cmdhandler';
import { telegram } from './config';

const bot = new TelegramBot(telegram.token, {
    polling: true
});

async function bootstrap() {
    let dataSource = await DataSourceConnect.connect();
    let cmdHandler = new CommandHandler(bot, dataSource);

    bot.on('message', async (msg) => {
        cmdHandler.start(msg)
    });
}

bootstrap();