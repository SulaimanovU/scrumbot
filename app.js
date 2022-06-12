// EXTERNALL IMPORTS
import TelegramBot from 'node-telegram-bot-api';
import { Sequelize } from "sequelize";

// INTERNALL IMPORTS
import ValidateMessage from './modules/validate.message.js';
import DB from './db/database.js'
import Chronos from './modules/chronos.js';

// CONFIGS
const token = '5301003425:AAGhQG3La4WvEWX88gxzNMXZXnOg8hfN2sk'
const uri = 'postgres://gyzxxvsr:QULh8YIL6kW6EdJir2ouqk36QNE8EdKw@hattie.db.elephantsql.com/gyzxxvsr'

// CREATING CLASS INSTANCE
const bot = new TelegramBot(token, {
    polling: true
});
const db = new DB(uri, Sequelize);
const chronos = new Chronos();

const validateMessage = new ValidateMessage(bot, db, chronos);


bot.on('message', async (msg) => {
    validateMessage.start(msg)
});