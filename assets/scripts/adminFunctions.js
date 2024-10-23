import fs from 'fs';
import { waitForMedia, waitForText } from './waitForText.js';
import buttonTexts from '../db/texts/buttontexts.json' with {type: "json"};
import managerText from '../db/texts/managerText.json' with {type: "json"}
import donationText from '../db/texts/donationText.json' with {type: "json"}
import defaultPhoto from '../db/photos/defaultPhoto.json' with {type: "json"}
import buttons from '../db/buttons/buttons.json' with {type: "json"}
import buttonMedia from '../db/texts/mediaButtonTexts.json' with {type: "json"}
import links from '../db/links/links.json' with {type: "json"}
import intervalFile from '../db/interval/interval.json' with {type: "json"}
import group from '../db/group/group.json' with {type: "json"}
import { waitForPhoto } from './waitForPhoto.js';
import forumText from '../db/texts/forumtext.json' with {type: "json"}


export async function addButtonTexts(bot, msg) {
    await bot.sendMessage(msg.message.chat.id, "Введите номер кнопки, которую хотите изменить:");

    const buttonNumberInput = await waitForText(bot, msg.message.chat.id);
    const buttonNumber = parseInt(buttonNumberInput.trim(), 10);

    if (isNaN(buttonNumber) || buttonNumber <= 0 || buttonNumber > 20) {
        return await bot.sendMessage(msg.message.chat.id, "Неверный номер кнопки. Пожалуйста, введите корректный номер.");
    }

    const textsArray = buttonTexts.buttons[buttonNumber]; 

    while (true) {
        await bot.sendMessage(msg.message.chat.id, `Введите текст для кнопки ${buttonNumber}:`);
        const newText = await waitForText(bot, msg.message.chat.id);
        
        console.log(`Получен текст: ${newText}`); 
        textsArray.push(newText.trim());

        await bot.sendMessage(msg.message.chat.id, `Сообщение "${newText}" принято! Хотите ввести еще один текст? Введите 'да' для продолжения или 'нет' для завершения.`);
        const userResponse = await waitForText(bot, msg.message.chat.id);

        console.log(`Ответ пользователя: ${userResponse}`); 
        if (userResponse.toLowerCase() !== 'да') {
            break; 
        }
    }

    fs.writeFileSync('./assets/db/texts/buttontexts.json', JSON.stringify(buttonTexts, null, 2));

    await bot.sendMessage(msg.message.chat.id, `Тексты для кнопки ${buttonNumber} успешно обновлены:\n"${textsArray.join('\n')}"`);
}1

export async function addMediaButtonTexts(bot, msg) {
    await bot.sendMessage(msg.message.chat.id, "Введите номер кнопки, которую хотите изменить:");

    const buttonNumberInput = await waitForText(bot, msg.message.chat.id);
    let buttonNumber = parseInt(buttonNumberInput, 10);

    if (isNaN(buttonNumber) || buttonNumber <= 0 || buttonNumber > 20) {
        return await bot.sendMessage(msg.message.chat.id, "Неверный номер кнопки. Пожалуйста, введите корректный номер.");
    }

    await bot.sendMessage(msg.message.chat.id, `Что вы хотите добавить на кнопку ${buttonNumber}? Введите 'gif', 'видео' или 'фото':`);
    let mediaType = await waitForText(bot, msg.message.chat.id);
    console.log(`Тип медиа: ${mediaType}`);

    const validMediaTypes = ['gif', 'video', 'photo'];
    if (!validMediaTypes.includes(mediaType.toLowerCase())) {
        return await bot.sendMessage(msg.message.chat.id, "Неверный тип медиа. Пожалуйста, введите 'gif', 'видео' или 'фото'.");
    }

    while (true) {
        try {
            await bot.sendMessage(msg.message.chat.id, `Пожалуйста, отправьте ${mediaType}:`);
            const media = await waitForMedia(bot, msg.message.chat.id);
            buttonMedia.buttons[buttonNumber][mediaType] = []

            if (media) {
                if (mediaType === 'gif') {
                    buttonMedia.buttons[buttonNumber][mediaType].push(media)
                    console.log(buttonMedia.buttons[buttonNumber][mediaType])
                    await bot.sendAnimation(msg.message.chat.id, media);
                } else if (mediaType === 'video') {
                    buttonMedia.buttons[buttonNumber][mediaType].push(media)
                    await bot.sendVideo(msg.message.chat.id, media);
                } else if (mediaType === 'photo') {
                    buttonMedia.buttons[buttonNumber][mediaType].push(media)
                    console.log(buttonMedia.buttons[buttonNumber].photo)
                    await bot.sendPhoto(msg.message.chat.id, media);
                }

                await bot.sendMessage(msg.message.chat.id, `${mediaType} принято! Хотите ввести еще один текст? Введите 'да' для продолжения или 'нет' для завершения.`);
                const userResponse = await waitForText(bot, msg.message.chat.id);
                if (userResponse.toLowerCase() !== 'да') {
                    break;
                }
            } else {
                console.log("Не удалось получить медиа. Завершение...");
                await bot.sendMessage(msg.message.chat.id, "Не удалось получить медиа. Пожалуйста, попробуйте снова.");
                break;
            }
        } catch (error) {
            console.error("Ошибка в процессе: ", error);
            await bot.sendMessage(msg.message.chat.id, "Произошла ошибка. Пожалуйста, попробуйте снова.");
            break;
        }
    }
    fs.writeFileSync('./assets/db/texts/mediaButtonTexts.json', JSON.stringify(buttonMedia, null, '\t'));
    await bot.sendMessage(msg.message.chat.id, `Медиа для кнопки ${buttonNumber} успешно обновлено.`);
}

export async function setManagerText(bot, msg) {
    await bot.sendMessage(msg.message.chat.id, "Пришлите мне фото для менеджера");

    const photo = await waitForPhoto(bot, msg.message.chat.id);
    console.log("Полученное фото:", photo);

    managerText[0].photo = photo;

    await bot.sendMessage(msg.message.chat.id, "Пришлите мне фото для менеджера");

    const newText = await waitForText(bot, msg.message.chat.id);

    managerText[0].text = newText;

    fs.writeFileSync('./assets/db/texts/managerText.json', JSON.stringify(managerText, null, 2));
    await bot.sendMessage(msg.message.chat.id, "Текст для менеджера успешно обновлён!");
}

export async function setDonationText(bot, msg) {
    await bot.sendMessage(msg.message.chat.id, "Пришлите мне фото для доната");

    const photo = await waitForPhoto(bot, msg.message.chat.id);
    console.log("Полученное фото:", photo);

    donationText[0].photo = photo;

    await bot.sendMessage(msg.message.chat.id, "Теперь пришлите текст для доната");

    const text = await waitForText(bot, msg.message.chat.id);
    console.log("Полученный текст:", text);

    donationText[0].text = text;

    fs.writeFileSync('./assets/db/texts/donationText.json', JSON.stringify(donationText, null, 2));

    await bot.sendMessage(msg.message.chat.id, "Фото и текст для менеджера успешно обновлены!");
}

export async function setDefaultPhoto(bot, msg){
    await bot.sendMessage(msg.message.chat.id, "Пришлите мне фото для главной страницы")

    const photo = await waitForPhoto(bot, msg.message.chat.id)

    defaultPhoto[0].photo = photo

    fs.writeFileSync('./assets/db/photos/defaultPhoto.json', JSON.stringify(defaultPhoto, null, 2))
}

export async function changeLink(bot, msg) {
    await bot.sendMessage(msg.message.chat.id, "Что вы хотите изменить? Введите 'file', 'website' или 'lk'.");

    const choice = await waitForText(bot, msg.message.chat.id);

    if (!['file', 'website', 'lk'].includes(choice.toLowerCase())) {
        return await bot.sendMessage(msg.message.chat.id, "Неверный выбор. Пожалуйста, введите 'file', 'website' или 'lk'.");
    }

    await bot.sendMessage(msg.message.chat.id, `Введите новую ссылку для ${choice}:`);
    const newLink = await waitForText(bot, msg.message.chat.id);

    links[0][choice] = newLink;

    fs.writeFileSync("./assets/db/links/links.json", JSON.stringify(links, null, 2));
    await bot.sendMessage(msg.message.chat.id, `Ссылка для ${choice} успешно обновлена на ${newLink}!`);
}

export async function changeForumButtonsText(bot, msg) {
    await bot.sendMessage(msg.message.chat.id, "У какой кнопки хотите заменить текст? (введите номер от 1 до 20)");

    const choice = await waitForText(bot, msg.message.chat.id);
    const index = Number(choice) - 1;

    if (isNaN(index) || index < 0 || index >= buttons.buttons.length) {
        return await bot.sendMessage(msg.message.chat.id, "Неверный номер кнопки. Пожалуйста, введите номер от 1 до 20."); 
    }

    await bot.sendMessage(msg.message.chat.id, "Введите новый текст для кнопки:");

    const newText = await waitForText(bot, msg.message.chat.id);

    if (!buttons.buttons[index]) {
        return await bot.sendMessage(msg.message.chat.id, "Ошибка: кнопка не найдена.");
    }

    buttons.buttons[index].text = newText;

    fs.writeFileSync('./assets/db/buttons/buttons.json', JSON.stringify(buttons, null, 2))

    await bot.sendMessage(msg.message.chat.id, `Текст кнопки "${choice}" успешно изменён на "${newText}".`);
}

export async function changeIntervalTime(bot, msg) {
    await bot.sendMessage(msg.message.chat.id, "Пришлите мне время для отправки сообщений в группу в минутах");

    const newIntervalMinutes = Number(await waitForText(bot, msg.message.chat.id));

    intervalFile.interval = newIntervalMinutes * 60 * 1000; 

    fs.writeFileSync('./assets/db/interval/interval.json', JSON.stringify(intervalFile, null, 2))

    await bot.sendMessage(msg.message.chat.id, `Вы обновили интервал, текущее значение: ${newIntervalMinutes}`);

}

export async function changeGroupNameOrMessage(bot, msg) {
    await bot.sendMessage(msg.message.chat.id, "Выберите, что хотите поменять (имя группы или текст)");

    const choice = await waitForText(bot, msg.message.chat.id);
    const normalizedChoice = choice.toLowerCase();

    if (!["имя", "текст"].includes(normalizedChoice)) {
        return await bot.sendMessage(msg.message.chat.id, "Пожалуйста, выберите 'имя' или 'текст'.", {reply_markup: {
            inline_keyboard: [
                [{text: "Попробовать снова", callback_data: "changegroupnameortextonemoretime"}]
            ]
        }});
    }

    await bot.sendMessage(msg.message.chat.id, "Теперь введите то, на что хотите заменить:");

    const input = await waitForText(bot, msg.message.chat.id);
    
    normalizedChoice === "имя" ? group.groupName = input : group.groupMessage = input

    fs.writeFileSync("./assets/db/group/group.json", JSON.stringify(group, null, 2));

    await bot.sendMessage(msg.message.chat.id, `Успешно обновлено! Имя группы: ${group.groupName}, Текст сообщения: ${group.groupMessage}`);
}

export async function changeForumText(bot, msg){
    await bot.sendMessage(msg.message.chat.id, "Пришли мне текст на который хочешь заминить")

    const newText = await waitForText(bot, msg.message.chat.id)

    forumText[0].text = newText

    fs.writeFileSync("./assets/db/texts/forumtext.json", JSON.stringify(forumText, null, "\t"))

    await bot.sendMessage(msg.message.chat.id, "Текст успешно изменен")
}
