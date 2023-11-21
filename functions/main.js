import {channels} from "../parthners.js";
import {dbUsers} from "../index.js";
import {mocks} from "./cookies.js";

export const checkSubscribe = async (ctx, id) =>{

    for (const channel of channels) {
        const isString = typeof channel == 'string'
        const tid = isString ? `@${channel}` : channel.tid
        const member = await ctx.telegram.getChatMember(tid, id);
        if (member.status != "member" && member.status != "administrator" && member.status != "creator"){
            return false;
        }
    }
    return true
}

export const getPrediction= (ids) => {

    const mocksWrapper = [...mocks]
    if (ids.length) {
        for (const index of ids) {
            mocksWrapper.splice(index,1)
        }
    }


    const id = Math.floor(Math.random()*mocksWrapper.length)
    const index = mocks.indexOf(mocksWrapper[id])
    return [mocksWrapper[id],index]
}

export const defferedMail = (tid,ctx, ms, ) => {
    const text = "🌞 Привет! Спасибо, что читаешь мои предсказания, у меня для тебя есть подарок 🔥\n\n🎥 Промокод на VK Музыку бесплатно до конца года (и даже больше!)\n\n🌟Твой промокод 👉 `GET90ZAKS`\n🌟Активируй тут ➡️ ТЫК (https://gtblg.ru/prgbZr?erid=Kra23ZP4e)\n\n❗️он дейсвует всего несколько дней, лучше активируй сейчас ✨"
    const img = 'https://sun9-76.userapi.com/impg/bY0IBLB09wFaJNOtNlmGa4M1P-kcQJyDAF3a-Q/5T_P9VX1ABg.jpg?size=1920x1080&quality=95&sign=475993c263e3bb93e13f7ed1375aec05&type=album'
    setTimeout(async () => {

        try {
            await ctx.telegram.sendPhoto(tid, img, {parse_mode: 'Markdown', caption: text})
            await dbUsers.pushPromo(tid, 'VK');
        } catch (e) {
            console.log(e)
        }
    },ms)
}

