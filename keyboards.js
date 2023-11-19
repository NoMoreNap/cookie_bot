import {Markup} from 'telegraf'
import {channels} from "./parthners.js";

export function getMainMenu() {
    return Markup.keyboard([
        ['Разломить печеньку 🥠'],
        //['Кинуть кубик🎲'],
        ['Инфо ℹ️']
    ]).resize()
}

export function getSecondMenu() {
    return Markup.keyboard([
        ['Разломить еще печеньку 🥠'],
        //['Кинуть кубик🎲'],
        ['Инфо ℹ️']

    ]).resize()
}

export function adminsKeyboard() {
    return [Markup.keyboard([
        ['Разломить печеньку 🥠'],
        //['Кинуть кубик🎲'],
        ['Инфо ℹ️', 'Админ-команды']
    ]).resize(),
        Markup.keyboard([
        ['Разломить еще печеньку 🥠'],
        //['Кинуть кубик🎲'],
        ['Инфо ℹ️', 'Админ-команды']
    ]).resize()]
}

export function getAdminsCommand() {
    return Markup.keyboard([
        ['Общая информация'],
        ['Назад']
    ]).resize()
}

export function subsKeyboard() {
    const buttons = []
    channels.forEach(el => {
        if (typeof  el !== 'string') {
            buttons.push(Markup.button.url('Подписаться',el.url))
        } else {
            buttons.push(Markup.button.url('Подписаться', `https://t.me/${el}`))
        }

    })
    return Markup.inlineKeyboard(buttons, {columns: 2})
}
