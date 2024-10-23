import TelegramBot from "node-telegram-bot-api";
import dotenv from 'dotenv';
import fs from 'fs';
import users from './assets/db/users.json' with {type: "json"};
import buttonTexts from './assets/db/texts/buttontexts.json' with {type: "json"};
import donationText from './assets/db/texts/donationText.json' with {type: "json"}
import interval from './assets/db/interval/interval.json' with {type: "json"}
import group from './assets/db/group/group.json' with {type: "json"}
import { forumKeyboard } from "./assets/keyboard/keyboard.js";
import { defaultAction } from "./assets/scripts/default.js";
import { addButtonTexts, addMediaButtonTexts, changeForumButtonsText, changeGroupNameOrMessage, changeIntervalTime, changeLink, setDefaultPhoto, setDonationText, setManagerText } from "./assets/scripts/adminFunctions.js";
import buttonMedia from './assets/db/texts/mediaButtonTexts.json' with {type: "json"}
import {changeForumText} from "./assets/scripts/adminFunctions.js";
import forumTexts from './assets/db/texts/forumtext.json' with {type: "json"}

dotenv.config({ path: "./assets/modules/.env" });

const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const commands = JSON.parse(fs.readFileSync('./assets/db/commands/commands.json', 'utf8'));

bot.setMyCommands(commands);

setInterval(() => {
    if (group?.groupName && group.groupName.trim() !== '') {
      bot.sendMessage(group.groupName, group.groupMessage)
        .catch(() => {});
    }
  }, interval?.interval);

bot.on('message', async msg => {
    const user = users.find(user => user.username === msg.from.username);
    
    if (msg.text === '/start') {
        if (!user) {
            users.push({
                username: msg.from.username,
                firstName: msg.from.first_name,
                lastName: msg.from.last_name,
                isAdmin: false
            });
            fs.writeFileSync("./assets/db/users.json", JSON.stringify(users, null, 2)); 
        }

        await defaultAction(bot, msg, user);
    }
});

bot.on('callback_query', async msg => {
    switch (msg.data) {
        case "forum":
	    try {
        	await bot.sendPhoto(msg.message.chat.id, "./photo.jpg");
            await bot.sendMessage(msg.message.chat.id, "Выбери раздел", forumKeyboard)
    	} catch (error) {
            console.error("Ошибка при отправке фото:", error);
    	} 
            break;
	case "main":
            await bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
            const user = users.find(user => user.username === msg.message.from.username);
            await defaultAction(bot, msg, user);
            break;
        case "changenum":
            await bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
            await addButtonTexts(bot, msg)
            break
        case "setmanagertext":
            await bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
            await setManagerText(bot, msg)
            break
        case "setdonationtext":
            await bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
            await setDonationText(bot, msg)
            break
        case "donation":
            await bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
            await bot.sendPhoto(msg.message.chat.id, donationText[0].photo, {
                caption: donationText[0].text,
                reply_markup: {
                    inline_keyboard: [
                        [{text: "Назад", callback_data: "main"}]
                    ]
                }
            });
            break
        case "setdefaultphoto":
            await bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
            await setDefaultPhoto(bot, msg)
            break
        case "changelink":
            await bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
            await changeLink(bot, msg)
            break
        case "changebuttontext":
            await bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
            await changeForumButtonsText(bot, msg)
            break
        case "groupinterval":
            await bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
            await changeIntervalTime(bot, msg)
            break
        case "changegroupnameortext":
            await bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
            changeGroupNameOrMessage(bot, msg)
            break
        case "changegroupnameortextonemoretime":
            await bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
            changeGroupNameOrMessage(bot, msg)
            break
        case "changemedia":
            await bot.deleteMessage(msg.message.chat.id, msg.message.message_id)
            addMediaButtonTexts(bot, msg)
            break
        case "changemainforumtext":
            await changeForumText(bot, msg)
            break
        default:
            console.log("default started");

            const match = msg.data.match(/(\d+)/);
            console.log(match);
            if (!match) return; 
            
            const buttonNumber = Number(match[1]);
            console.log("buttonNumber:", buttonNumber);
            
            if (!buttonMedia || typeof buttonMedia[0]?.buttons !== 'object') {
                console.error("Invalid buttonMedia structure:", buttonMedia);
                return;
            }
            
            const button = buttonMedia[0].buttons[buttonNumber];
            if (!button) {
                console.log("Button not found for number:", buttonNumber);
                return;
            }
            
            const { video, photo, gif } = button;
            console.log("деструктуризация");
            
            const texts = buttonTexts.buttons[buttonNumber]; 
            
            if (!texts || texts.length === 0) {
                await bot.sendMessage(msg.message.chat.id, `Кнопка ${buttonNumber} не содержит текстов.`);
            } else {
                const hasValidMedia =
                    (Array.isArray(photo) && photo.length > 0) ||
                    (Array.isArray(video) && video.length > 0) ||
                    (Array.isArray(gif) && gif.length > 0);
            
                if (hasValidMedia) {
                    console.log('Обрабатываем медиа:', { video, photo, gif });
            
                    if (photo.length > 0) {
                        console.log(photo);
                        await bot.sendPhoto(msg.message.chat.id, photo[0]);
                    } else if (video.length > 0) {
                        console.log(video);
                        await bot.sendVideo(msg.message.chat.id, video[0]);
                    } else if (gif.length > 0) {
                        console.log(gif);
                        await bot.sendDocument(msg.message.chat.id, gif[0]);
                    }
                } else {
                    console.log('Пустой медиа-объект для кнопки:', buttonNumber);
                }
            
                for (const text of texts) {
                    await bot.sendMessage(msg.message.chat.id, text);
                }
            
                console.log("hello world");
            }
            
            await bot.sendMessage(msg.message.chat.id, "Выберите действие:", {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Назад", callback_data: "forum" }]
                    ]
                }
            });
            

        break; 
    }})                    
                    
bot.on('polling_error', console.log);
