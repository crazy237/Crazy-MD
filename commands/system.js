/**  Copyright (C) 2023. 
  Licensed under the  GPL-3.0 License; 
  You may not use this file except in compliance with the License. 
  It is supplied in the hope that it may be useful. 
  * @project_name : Blue_Lion_Bot 
  * @author : nipuna rangana
  * @description : Blue-Lion,A Multi-functional whatsapp bot. 
  * @version 0.0.2 **/
 
const { addnote,cmd, sck1, delnote, allnotes, delallnote, tlang, botpic, runtime, prefix, Config } = require('../lib')
const { TelegraPh } = require('../lib/scraper')   
//---------------------------------------------------------------------------
cmd({
            pattern: "addnote",
            category: "owner",
            desc: "Adds a note on db.",
            filename: __filename
        },
        async(Void, citel, text,{ isCreator }) => {
            if (!isCreator) return citel.reply(tlang().owner)
            if (!text) return citel.reply("🔍 Please provide me a valid gist url.")
            await addnote(text)
            return citel.reply(`New note ${text} added in mongodb.`)

        }
    )
 
    //---------------------------------------------------------------------------
cmd({
            pattern: "qr",
            category: "owner",
            filename: __filename,
            desc: "Sends CitelsVoid Qr code to scan and get your session id."
        },
        async(Void, citel, text) => {
            if (text) {
                let h = await getBuffer(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${text}`)
                await Void.sendMessage(citel.chat, { image: h })
                return
            }
            let buttonMessaged = {
                image: { url: 'citel-x.herokuapp.com/session' },
                caption: `*_Scannez le Qr dans les 15 secondes_*\nVous obtiendrez l'ID de session dans votre numéro de journal.`,
                footer: ` Session`,
                headerType: 4,
                contextInfo: {
                    externalAdReply: {
                        title: 'Secktor Session',
                        body: 'Get you Session ID',
                        thumbnail: log0,
                        mediaType: 2,
                        mediaUrl: ``,
                        sourceUrl: ``,
                    },

                },

            };
            await Void.sendMessage(citel.chat, buttonMessaged, {
                quoted: citel,

            });
            await sleep(20 * 1000)
            return citel.reply('Votre session est terminée maintenant.')


        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "unban",
            category: "misc",
            filename: __filename,
            desc: "Unbans banned user (from using bot)."
        },
        async(Void, citel, text,{ isCreator }) => {
            if (!isCreator) return citel.reply("Fonction réservée uniquement au Owner")
            try {
                let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
                if (!users) return citel.reply("Veuillez mentionner un utilisateur.❌")
                let pushnamer = Void.getName(users);
                sck1.findOne({ id: users }).then(async(usr) => {
                    if (!usr) {
                        console.log(usr.ban)
                        return citel.reply(`${pushnamer} est banni.`)
                    } else {
                        console.log(usr.ban)
                        if (usr.ban !== "true") return citel.reply(`${usr.name} déjà banni.`)
                        await sck1.updateOne({ id: users }, { ban: "false" })
                        return citel.reply(`${usr.name} Libre comme un oiseaux désormais`)
                    }
                })
            } catch {
                return citel.reply("Veuillez mentionner un utilisateu.❌")
            }


        }
    )
    //---------------------------------------------------------------------------
    cmd({
        pattern: "url",
        alias : ['createurl'],
        category: "misc",
        filename: __filename,
        desc: "image to url."
    },
    async(Void, citel, text) => {
        if (!citel.quoted) return await citel.reply(`*Tagez à une image/video pour obtenir le lien*`)
        let mime = citel.quoted.mtype
        if(mime !='videoMessage' && mime !='imageMessage' ) return await citel.reply("Veuillez tagger une Image/Video")
        let media = await Void.downloadAndSaveMediaMessage(citel.quoted);
        let anu = await TelegraPh(media);
        await citel.reply('*OK, le lien de votre média est là.\n'+util.format(anu));
        return await fs.unlinkSync(media);
    })

    //---------------------------------------------------------------------------
//---------------------------------------------------------------------------
cmd({
    pattern: "trt",
    alias :['translate'],
    category: "misc",
    filename: __filename,
    desc: "Translate\'s given text in desird language."
},
async(Void, citel, text) => {
    if(!text && !citel.quoted) return await citel.reply(`*Veuillez entrer un texte. Ex: _${prefix}trt en Who be you comrade_*`);
    const translatte = require("translatte");
    let lang = text ? text.split(" ")[0].toLowerCase() : 'en';
    if (!citel.quoted)  { text = text.replace( lang , "");  }
    else { text = citel.quoted.text; }
    var whole = await translatte(text, { from:"auto",  to: lang , });
    if ("text" in whole) { return await citel.reply('*Texte traduit:*\n'+whole.text); }
}
)
    //---------------------------------------------------------------------------
cmd({
            pattern: "shell",
            category: "owner",
            filename: __filename,
            desc: "Runs command in Heroku(server) shell."
        },
        async(Void, citel, text,{ isCreator }) => {
            if (!isCreator) return citel.reply(tlang().owner)
            const { exec } = require("child_process")
            exec(text, (err, stdout) => {
                if (err) return citel.reply(`----${tlang().title}----\n\n` + err)
                if (stdout) {
                    return citel.reply(`----${tlang().title}----\n\n` + stdout)
                }
            })
        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "eval",
            category: "owner",
            filename: __filename,
            desc: "Runs js code on node server."
        },
        async(Void, citel, text,{ isCreator }) => {
            if (!isCreator) return
            try {
                let resultTest = eval('const a = async()=>{\n' + text + '\n}\na()');
                if (typeof resultTest === "object")
                    citel.reply(JSON.stringify(resultTest));
                else citel.reply(resultTest.toString());
            } catch (err) {
                return  citel.reply(err.toString());
            }
        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "delnote",
            category: "owner",
            filename: __filename,
            desc: "Deletes note from db."
        },
        async(Void, citel, text,{ isCreator }) => {
            const { tlang } = require('../lib/scraper')
            if (!isCreator) return citel.reply(tlang().owner)
            await delnote(text.split(" ")[0])
             return citel.reply(`Id: ${text.split(" ")[0]}\'s note has been deleted from mongodb.`)

        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "delallnotes",
            category: "owner",
            filename: __filename,
            desc: "Deletes all notes from db."
        },
        async(Void, citel, text, isCreator) => {
            const { tlang } = require('../lib/scraper')
            if (!isCreator) return citel.reply(tlang().owner)
            await delallnote()
             return citel.reply(`All notes deleted from mongodb.`)

        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "ban",
            category: "owner",
            filename: __filename,
            desc: "Bans user from using bot."
        },
        async(Void, citel, text,{ isCreator}) => {
            if (!isCreator) return citel.reply(tlang().owner)
            try {
                let users = citel.mentionedJid ? citel.mentionedJid[0] : citel.msg.contextInfo.participant || false;
                if (!users) return citel.reply(`❌ Veuillez mentionner un utilisateur ${tlang().greet}.`)
                let pushnamer = Void.getName(users);
                sck1.findOne({ id: users }).then(async(usr) => {
                    if (!usr) {
                        await new sck1({ id: users, ban: "true" }).save()
                        return citel.reply(`_ ${usr.name} est banni d' utilisation des cmds._`)
                    } else {
                        if (usr.ban == "true") return citel.reply(`${pushnamer} déjà banni`)
                        await sck1.updateOne({ id: users }, { ban: "true" })
                        return citel.reply(`_ ${usr.name} banni avec succès d' utilisation des cmds._`)
                    }
                })
            } catch (e) {
                console.log(e)
                return citel.reply("Veuillez mentionner un utilisateu.❌ ")
            }


        }
    )
    //---------------------------------------------------------------------------
cmd({
            pattern: "alive",
            category: "general",
            filename: __filename,
            desc: "is bot alive??"
        },
        async(Void, citel, text, isAdmins) => {
Void.sendMessage(citel.chat, { 
              react: { 
                  text: "❤️", 
                  key: citel.key 
              } 
          }) 
          await Void.sendPresenceUpdate('recording', citel.chat);
          await Void.sendMessage(citel.chat, { audio: {url : 'https://github.com/nipuna15/Voice/raw/main/Alive.mp3',}, mimetype: 'audio/mpeg', ptt: true }, { quoted: citel, });
            let alivemessage = Config.ALIVE_MESSAGE || `*Developpé par CRAZY_PRINCE.*`
            const alivtxt = `
*Salut, ${citel.pushName},*
ceci est  ${tlang().title}.
${alivemessage}

🍧Version:-* 0.0.2
🆙Uptime:-* ${runtime(process.uptime())}
👤Proprio:-* ${Config.ownername}
🎧Branche:-* ${Config.BRANCH}

● Type ${prefix}Menu de la liste des cmds.

📗Powered by ${Config.ownername}`;
            let aliveMessage = {
                image: {
                 url:  await botpic(),
                       },
                caption: alivtxt,
                footer: tlang().footer,
                headerType: 4,
            };
             return Void.sendMessage(citel.chat, aliveMessage, {
                quoted: citel,
            });     

        }
    )
    //---------------------------------------------------------------------------
cmd({
        pattern: "allnotes",
        category: "owner",
        filename: __filename,
        desc: "Shows list of all notes."
    },
    async(Void, citel, text,{ isCreator }) => {
        const { tlang } = require('../lib')
        if (!isCreator) return citel.reply(tlang().owner)
        const note_store = new Array()
        let leadtext = `Toutes les notes disponibles:-\n\n`
        leadtext += await allnotes()
        return citel.reply(leadtext)

    }
)
