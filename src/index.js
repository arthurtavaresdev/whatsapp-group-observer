const wa = require('@open-wa/wa-automate');
const path = require('path');
const fs = require('fs').promises;
const mime = require('mime-types');
const uuid = require('uuid').v4;

require('dotenv').config();

wa.create().then(client => start(client));


/**
 * 
 * @param {wa.Client} client 
 */
async function start(client) {
    const groups  = await client.getAllGroups();
    const groupSpecify  = groups.filter(group => group.formattedTitle.toUpperCase() === process.env.GROUP_NAME.toUpperCase())[0];

    await createLogFromChat(client, groupSpecify);

}

/**
 * 
 * @param {wa.Client} client 
 * @param {import('@open-wa/wa-automate').Chat} chat 
 */
async function createLogFromChat(client,chat){
    const file = path.resolve(__dirname,'..','tmp','messages.log');

    // Clear old content MSG.
    await fs.truncate(file);

    const messages = await client.getAllMessagesInChat(chat.contact.id);
    messages.forEach(async (message)=>{
        if(message.type === 'chat'){
            try{
                console.log('Escrita do log iniciada!');
                await fs.appendFile(file,message.body);
            }catch(e){
                console.log('Escrita do log, ocorreu um erro!')
                console.error(e);
            }finally{
                console.log('Escrita do log finalizada!')
            }
        }else{
            transformToImageOrDocument(message);
        }
    });
}

/**
 * 
 * @param {import('@open-wa/wa-automate').Message} message 
 */
async function transformToImageOrDocument(message){
    if(isValidateBase64(message.body)){
        const extension = mime.extension(message.mimetype);
        await fs.writeFile(path.resolve(__dirname,'..','tmp',`${uuid()}.${extension}`),  message.body, {encoding: 'base64'});
    }
}

/**
 * 
 * @param {String} str 
 */
function isValidateBase64(str){
      const notBase64 = /[^A-Z0-9+\/=]/i;
      assertString(str);

      const len = str.length;
      if (!len || len % 4 !== 0 || notBase64.test(str)) {
        return false;
      }
      const firstPaddingChar = str.indexOf('=');
      return firstPaddingChar === -1 ||
        firstPaddingChar === len - 1 ||
        (firstPaddingChar === len - 2 && str[len - 1] === '=');
    
}

function assertString(input) {
    const isString = (typeof input === 'string' || input instanceof String);
  
    if (!isString) {
      let invalidType;
      if (input === null) {
        invalidType = 'null';
      } else {
        invalidType = typeof input;
        if (invalidType === 'object' && input.constructor && input.constructor.hasOwnProperty('name')) {
          invalidType = input.constructor.name;
        } else {
          invalidType = `a ${invalidType}`;
        }
      }
      throw new TypeError(`Expected string but received ${invalidType}.`);
    }
}