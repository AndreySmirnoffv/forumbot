export async function waitForText(bot, chatId) {
    return new Promise((resolve, reject) => {
        const uniqueMsgIds = new Set();
        const messages = [];
        const timeout = 60000;

        const onMessage = (msg) => {
            if (msg.chat.id === chatId && msg.text) {
                if (!uniqueMsgIds.has(msg.message_id)) {
                    uniqueMsgIds.add(msg.message_id);
                    messages.push(msg.text);
                    console.log(`Received message with ID: ${msg.message_id}`)
                    resolve(messages[0]);
                }
            }
        };

        bot.on('message', onMessage);

        setTimeout(() => {
            console.log("Тайм-аут ожидания текста.");
            bot.removeListener('message', onMessage);
        }, timeout);
    });
}

export async function waitForMedia(bot, chatId) {
    return new Promise((resolve, reject) => {
        const listener = (msg) => {
            if (msg.chat.id === chatId && (msg.photo || msg.video || msg.animation)) {
                bot.removeListener('message', listener);
                if (msg.photo) {
                    resolve(msg.photo[0].file_id);
                    console.log("Получено фото: " + msg.photo[0].file_id);
                } else if (msg.video) {
                    resolve(msg.video.file_id);
                    console.log("Получено видео: " + msg.video.file_id);
                } else if (msg.animation) {
                    resolve(msg.animation.file_id);
                    console.log("Получена анимация: " + msg.animation.file_id);
                }
            } else {
                console.log("Игнорируем сообщение, так как оно не соответствует критериям.");
            }
        };

        bot.on('message', listener);

        setTimeout(() => {
            console.log("Тайм-аут ожидания медиа.");
            bot.removeListener('message', listener);
        }, 60000);
    });
}

