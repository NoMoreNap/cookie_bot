import express from 'express'
import {Telegraf} from 'telegraf'
import * as dotenv from 'dotenv'
import userModel from "../DB/scheme.js";
import mongoose from "mongoose";

dotenv.config();

const bot = new Telegraf(process.env.TOKEN);

const delay = async (ms) => {
    return new Promise(r => setTimeout(r, ms))
}

const db = await mongoose.connect(`mongodb://89.108.103.239:27017/cookie_tg`);

function getHiddenLink(url, parse_mode = "markdown") {
    const emptyChar = "‎";

    switch (parse_mode) {
        case "markdown":
            return `[${emptyChar}](${url})`;
        case "HTML":
            return `<a href="${url}">${emptyChar}</a>`;
        default:
            throw new Error("invalid parse_mode");
    }
}

const startMailing = async (text) => {
    try {
        const data = await userModel.distinct('tid')
        let c = 0
        console.log('Начинаю')
        for (const tid of data) {
            // if (tid !== 756656853 && tid !== 386715412) {
            //     continue
            // }
            const reffer_text = `
✨💕 Конкурс от Печеньки\nПриз - коробка печенья с предсказанием 🥠\n\n
Разыграем коробку с печеньем среди тех, кто пригласит в бота друзей 💓\n\n
Твоя ссылка для приглашения -\nhttps://t.me/cookie_slave_bot?start=${tid}\n\n
Просто отправь ее друзьям или в любой чат 💬`
           try {
               await bot.telegram.sendPhoto(tid, 'https://sun9-70.userapi.com/impg/JMpOTCzAIx6A9gkMYUI57wwl5kZJsjDzpuqsHg/kMgPs2SgnWU.jpg?size=1024x1024&quality=95&sign=dc60beb86bbaba08259266a7454354bc&type=album', {parse_mode: 'HTML', caption: reffer_text})
               c++
               console.log(`Отправлено ${c} из ${data.length}`)
               await delay(50)
           } catch (e) {
                console.log('пропускаем')
           }
        }
        console.log('Все')
    } catch (e) {
        console.log(e)
    }
}
const text = 'test'

startMailing(text)


