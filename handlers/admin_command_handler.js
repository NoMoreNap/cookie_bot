export const adminCommandsHandler = async (ctx, dbUsers) => {

    switch (ctx.command) {
        case 'info':
            const [users, reffers] = await dbUsers.getAllInfo()
            let msg = `Всего игроков: ${users.length}\n\nВсего рефералов: ${reffers.length}`
            if (ctx.payload === '') {
                return msg
            } else {
                switch (ctx.payload) {
                    case 'many':
                        const ts = Date.now()
                        const month = ts - 31*24*60*60*1000
                        const week = ts - 7*24*60*60*1000
                        const day = ts - 24*60*60*1000
                        const monthData = await dbUsers.find('reg_ts', {$gt: month})
                        const weekData = await dbUsers.find('reg_ts', {$gt: week})
                        const dayData = await dbUsers.find('reg_ts', {$gt: day})

                        msg += `\n\nНовых игроков за месяц: ${monthData.length}\nНовых игроков за неделю: ${weekData.length}\nНовых игроков за день: ${dayData.length}`
                        return msg
                    default:
                        break;
                }
            }
            break;
        case 'add':
            const count = ctx.payload !== '' ? +ctx.payload : 1
            await dbUsers.updateLimit(count)
            return `Добавил всем ${count} печенек`
        default:
            break;
    }
}
