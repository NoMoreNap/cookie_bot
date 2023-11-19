import express from 'express'
import {Telegraf} from 'telegraf'
import * as dotenv from 'dotenv'
import userModel from "./DB/scheme.js";
import mongoose from "mongoose";

dotenv.config();

const bot = new Telegraf(process.env.TOKEN);

const delay = async (ms) => {
    return new Promise(r => setTimeout(r, ms))
}

const updateLimit = async () => {
    try {
        const db = await mongoose.connect(`mongodb://127.0.0.1:27017/cookie_tg`);
        const data = await userModel.distinct('tid')
        const {modifiedCount} = await userModel.updateMany({tid: {$exists: true}}, {$inc: {'info.limit': 1}})
        for (const tid of data) {
            await bot.telegram.sendMessage(tid, `Я принес тебе одну печеньку 🥠`)
            await delay(100)

        }
        const date = new Date()
        await bot.telegram.sendMessage(756656853,`Обновил лимит в ${date.getHours()}:${date.getMinutes()}\n\nИзменено ${modifiedCount}\n\nРассылка звершена в ${data.length} аккаунтов`)
    } catch (e) {
        console.log(e)
    }
}

(async () => {
    while (true) {
        const date = new Date()
        const minutes = date.getMinutes()
        const hours = date.getHours()
        if (hours == 0 && minutes < 3) {
            await updateLimit()
            await delay(10*60*1000)
        }
        await delay(60*1000)
    }
})()

