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
    await DataSourceConnect.connect();
    // let cmdHandler = new CommandHandler();

    // bot.on('message', async (msg) => {
    //     console.log('msg ->', msg);
    //     cmdHandler.start(msg);
    // });
}

bootstrap();