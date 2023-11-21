import express from 'express'
import {Telegraf} from 'telegraf'
import * as dotenv from 'dotenv'
import {Mongo} from "./DB/actions.js";
import {getMainMenu, subsKeyboard, getSecondMenu, adminsKeyboard} from './keyboards.js'
import {checkSubscribe, getPrediction, defferedMail} from "./functions/main.js";
import {adminCommandsHandler} from "./handlers/admin_command_handler.js";
import {mocks} from "./functions/cookies.js";

dotenv.config()

const app = express()
const bot = new Telegraf(process.env.TOKEN)
export const dbUsers = new Mongo("cookie_tg");

const admins_uid = [386715412,756656853]



bot.start(async (ctx) => {

    try {
        const {id, first_name, last_name, username } = ctx.update.message.from
        // defferedMail(id, ctx,0, dbUsers)

        const data = await dbUsers.find('tid', id)
        if (!data.length) {
            const reffer_tid = ctx.startPayload !== '' ? +ctx.startPayload : 0
            const newUser = {
                tid: id,
                reffer_tid,
                username,
                reg_ts: Date.now(),
                info: {
                    last_name,
                    first_name,
                    refferals: [],
                    oppend_cookie: 0,
                    cookies: [],
                    limit: 1,
                    promos: []
                },
            }
            if (reffer_tid) {
                const reffer = await dbUsers.find('tid', reffer_tid)
                if (reffer.length) {
                    await dbUsers.pushReffer(reffer_tid, id)
                    await dbUsers.addLimit(reffer_tid,1)
                    //await ctx.telegram.sendMessage(reffer_tid, `У вас новый реферал!\n\n${id}`)
                }

            }
            const insertedData = await dbUsers.insert(newUser)
            const keyboard = admins_uid.indexOf(id) === -1 ? getMainMenu() : adminsKeyboard()[0];
            try {
                defferedMail(id, ctx,15*60*1000, dbUsers)
                return await ctx.replyWithPhoto(
                    'https://sun9-25.userapi.com/impg/sKo9SLLPdWl8yNfx0VYrSkdp-zElDlWr7T3BmQ/LHgePzxzuwU.jpg?size=1024x1024&quality=95&sign=a74b7a0b4174180f2f5ec80e3686b607&type=album',
                    {
                        caption: 'Привет! Я бот - печенька с предсказанием. Просто разломи меня и я расскажу, что тебя ждет в ближайшем будущем 🌟',
                        pasre_mode: 'Markdown',
                        ...keyboard

                    },
                )
            } catch (e) {
                return console.log(e)
            }
        } else {
            try {

                const second_keyboard = admins_uid.indexOf(id) === -1 ? (data[0].info.oppend_cookie ? getSecondMenu() : getMainMenu()) : (data[0].info.oppend_cookie ? adminsKeyboard()[0] : adminsKeyboard()[0]);
                return await ctx.reply('Рады видеть вас снова!', second_keyboard)
            } catch (e) {
                return console.log(e)

            }
        }
    } catch (e) {
        console.log(e)
    }

})

bot.hears(/Разломить(.*)/, async (ctx) => {
    try {
        const {id, first_name, last_name, username } = ctx.update.message.from
        const data = await dbUsers.find('tid', id)
        if (!data.length) {
            const newUser = {
                tid: id,
                username,
                reg_ts: Date.now(),
                info: {
                    last_name,
                    first_name,
                    refferals: [],
                    oppend_cookie: 0,
                    cookies: [],
                    limit: 1,
                    promos: []
                }

            }
            await dbUsers.insert(newUser)
            const keyboard = admins_uid.indexOf(id) === -1 ? getMainMenu() : adminsKeyboard()[0];
            defferedMail(id,ctx,15*60*1000, dbUsers)
            return await ctx.replyWithPhoto(
                'https://sun9-25.userapi.com/impg/sKo9SLLPdWl8yNfx0VYrSkdp-zElDlWr7T3BmQ/LHgePzxzuwU.jpg?size=1024x1024&quality=95&sign=a74b7a0b4174180f2f5ec80e3686b607&type=album',
                {
                    caption: 'Привет! Я бот - печенька с предсказанием. Просто разломи меня и я расскажу, что тебя ждет в ближайшем будущем 🌟',
                    pasre_mode: 'Markdown',
                    ...keyboard

                },
            )
        }
        const isSuccessSubs = await checkSubscribe(ctx, id)

        if (!isSuccessSubs) {
            try {
                await ctx.reply('Необходимо подписаться на партнеров', subsKeyboard())
            } catch (e) {
                return console.log(e)
            }
        } else {
            const [user] = data
            const keyboard = admins_uid.indexOf(id) === -1 ? getSecondMenu() : adminsKeyboard()[1];
            if (user.info.limit <= 0) {
                try {
                    return await ctx.reply(`Следующее предсказание ты сможешь получить завтра ✨\n\nЕсли не хочешь ждать, отправь эту ссылку подруге, за КАЖДОГО друга ты будешь получать одно предсказание сверх лимита ❤\n\nhttps://t.me/cookie_slave_bot?start=${id}`,keyboard)
                } catch (e) {
                    return console.log(e)
                }
            } else {
                const [prediction,cid] = getPrediction(user.info.cookies)

                if (!prediction) {
                    try {

                        return await ctx.reply('На данный момент предсказания закончились :(', keyboard)
                    } catch (e) {
                        return console.log(e)
                    }
                }
                try {
                    await ctx.reply(prediction,keyboard)
                    await dbUsers.openCookie(id)
                    await dbUsers.pushCookie(id,cid)
                } catch (e) {
                    return console.log(e)
                } finally {

                }

            }
        }
    } catch (e) {
        console.log(e)
    }

})

bot.hears('Инфо ℹ️', async (ctx) => {
    try {
        const {id, first_name, last_name } = ctx.update.message.from
        const data = await dbUsers.find('tid', id)
        if (!data.length) {
            const newUser = {
                tid: id,
                info: {
                    last_name,
                    first_name,
                    refferals: [],
                    oppend_cookie: 0,
                    cookies: [],
                    limit: 1
                }

            }
            await dbUsers.insert(newUser)
        }
        const [user] = data
        const msg = `✨${user.info.first_name}✨\n\n🥠Печенек: ${user.info.limit}\n✉️Открыто: ${user.info.oppend_cookie}\n👫Приглашено: ${user.info.refferals.length}`
        await ctx.reply(msg)
    } catch (e) {
        console.log(e)
    }
})
bot.hears('Посмотреть мои печеньки 🍪', async (ctx) => {
    try {
        const {id, first_name, last_name } = ctx.update.message.from
        const [data] = await dbUsers.find('tid', id)
        let msg = ''
        if (data.info.cookies.length < 1) {
            msg = 'К сожалению, у вас нет открытых печенек :('
        } else {
            const cookies = Array.from(new Set(data.info.cookies))
            console.log(mocks.length)
            for (const cookiesId of cookies) {
                mocks[cookiesId] && (msg += `✨ ${mocks[cookiesId]}\n`)
            }
        }

        await ctx.reply(msg)
    } catch (e) {
        console.log(e)
    }
})

// bot.hears('Кинуть кубик🎲', async ctx => {
//     const result = await ctx.telegram.sendDice(ctx.update.message.from.id).then(res =>{
//         return res.dice.value
//     })
//     console.log(result)
// })

bot.hears('Админ-команды', async ctx => {
    try {
        const {id, first_name, last_name } = ctx.update.message.from
        if (admins_uid.indexOf(id) !== -1) {
            const msg = `/info - Общаяя информация\n/info many - Развернутая информация\n/add {число} - Добавить всем {число} печенек`
            ctx.reply(msg)
        }
    } catch (e) {
        console.log(e)
    }
})

bot.command(/(.*)/, async ctx => {
    try {
        const {id, first_name, last_name } = ctx.update.message.from
        if (admins_uid.indexOf(id) !== -1) {
            const msg = await adminCommandsHandler(ctx, dbUsers)
            await ctx.reply(msg)
        }
    } catch (e) {
        console.log(e)
    }
})

const option = {
    dropPendingUpdates: false
}

bot.launch(option)
app.listen(process.env.PORT, () => console.log(`My server is running on port ${process.env.PORT}`))

