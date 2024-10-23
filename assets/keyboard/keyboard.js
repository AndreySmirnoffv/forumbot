import buttonsData from '../db/buttons/buttons.json' with {type: "json"};
import links from '../db/links/links.json' with {type: "json"};

export const startKeyboard = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Форум", callback_data: "forum" }],
            [{ text: "Донат", callback_data: "donation" }],
            [{ text: "Личный Кабинет", url: links[0].lk }],
            [{ text: "Файлы", url: links[0].file }],
            [{ text: "Сайт", url: links[0].website }]
        ]
    })
};

export const forumKeyboard = {
    reply_markup: {
        inline_keyboard: []
    }
};

const buttonsPerRow = 2;
let currentRow = [];

console.log("buttonsData:", buttonsData);

if (!buttonsData || !Array.isArray(buttonsData.buttons)) {
    console.error("buttonsData.buttons is not an array or is undefined");
    throw new Error("Invalid buttons data structure.");
}

const buttons = buttonsData.buttons;

for (const button of buttons) {
    currentRow.push({ text: button.text, callback_data: button.callback_data });

    if (currentRow.length === buttonsPerRow) {
        forumKeyboard.reply_markup.inline_keyboard.push(currentRow);
        currentRow = [];
    }
}

if (currentRow.length > 0) {
    forumKeyboard.reply_markup.inline_keyboard.push(currentRow);
}

forumKeyboard.reply_markup.inline_keyboard.push([{ text: "Главная", callback_data: "main" }]);

export const adminKeyboard = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: "Изменить текст форума", callback_data: "changenum" }],
            [{ text: "Изменить медия для текстов форума", callback_data: "changemedia" }],
            [{ text: "Изменить текст у кнопок форума", callback_data: "changebuttontext" }],
            [{ text: "Изменить текст для доната", callback_data: "setdonationtext" }],
            [{ text: "Изменить фото главной страницы", callback_data: "setdefaultphoto" }],
            [{ text: "Изменить ссылки", callback_data: "changelink" }],
            [{ text: "Задать интервал для отправки сообщения в группу", callback_data: "groupinterval" }],
            [{ text: "Изменить имя или текст группы", callback_data: "changegroupnameortext" }],
            [{ text: "Изменить текст главной", callback_data: "changemainforumtext" }]
        ]
    })
};
