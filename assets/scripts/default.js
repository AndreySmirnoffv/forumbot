import { adminKeyboard } from "../keyboard/keyboard.js";
import defaultPhoto from "../db/photos/defaultPhoto.json" with {type: "json"}
import links from '../db/links/links.json' with {type: "json"}
import forumText from "../db/texts/forumtext.json" with {type: "json"}


export async function defaultAction(bot, msg, user) {
    const chatId = msg.chat?.id || msg.message?.chat?.id;
    const username = msg.from?.username || msg.message?.from?.username;

    if (!user?.isAdmin) {
        return bot.sendPhoto(chatId, defaultPhoto[0].photo, {
            caption: forumText[0].text,
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Форум", callback_data: "forum" }],
                    [{ text: "Донат", callback_data: "donation"}],
                    [{ text: "Личный Кабинет", url: links[0].lk }],
                    [{ text: "Файлы", url: links[0].file}],
                    [{ text: "Сайт", url: links[0].website }]
                ]
            }
        }).then(() => {
            console.log('Фото отправлено с клавиатурой');
        }).catch(err => {
            console.error('Ошибка при отправке фото:', err);
        });
    }

    await bot.sendMessage(chatId, `Привет ${username}, Ты админ`, adminKeyboard);
   
}
