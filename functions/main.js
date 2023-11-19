import {channels} from "../parthners.js";

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
    const mocks = [
        'ближайший год будет наполнен романтикой',
        "скоро тебя ждет свидание",
        'не сомневайся, это правильный выбор',
        'самое время загадать желание',
        "вас ожидает радостное известие",
        'все точно получится, не останавливайся'
    ]
    if (ids.length) {
        for (const index of ids) {
            mocks.splice(index,1)
        }
    }




    const id = Math.floor(Math.random()*mocks.length)
    return [mocks[id],id]
}

