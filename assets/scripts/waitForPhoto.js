export async function waitForPhoto(bot, chatId) {
    return new Promise((resolve) => {
        const listener = (msg) => {
            if (msg.chat.id === chatId && msg.photo) {
                const photoId = msg.photo[msg.photo.length - 1].file_id;
                
                bot.removeListener('message', listener);
                
                resolve(photoId);
            }
        };
        
        bot.on('message', listener);
    });
}
