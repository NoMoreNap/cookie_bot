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
✨ Привет! Спасибо, что читаешь мои предсказания, у меня для тебя есть подарок ❤\n\n
🎧Промокод на VK Музыку бесплатно до конца года (и даже больше!) \n\n
🌟Твой промокод 👉 GET90ZAKS\n🌟Активируй тут 👉 https://gtblg.ru/prgbZr?erid=Kra23ZP4e\n\n
❗он дейсвует всего несколько дней, лучше активируй сейчас ✨`
           try {
               await bot.telegram.sendPhoto(tid, 'https://sun9-76.userapi.com/impg/bY0IBLB09wFaJNOtNlmGa4M1P-kcQJyDAF3a-Q/5T_P9VX1ABg.jpg?size=1920x1080&quality=95&sign=475993c263e3bb93e13f7ed1375aec05&type=album', {parse_mode: 'HTML', caption: reffer_text})
               c++
               console.log(`Отправлено ${c} из ${data.length}`)
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


