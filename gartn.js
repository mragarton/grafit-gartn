const gartnDB = require('./gartnDB');
const { cfg, e_music, e_photos, e_shit, arr1, arr2, arr3, arr4, poemKat, regions, permissions, events } = gartnDB;

const gartnDeps = require('./gartnDeps');
const { Discord, moment, request, sql, _, Kaori, Jimp, PastebinAPI, dogeify, imgur, fortniteClient, random_dog, bot_util, osu, convert, giphy,
  bh, BrawlStars, twitchStreams, fs, DBL } = gartnDeps;

const osuApi = new osu.Api(cfg.tokens.osu);
const dog = new random_dog();
const client = new Discord.Client();
const kaori = new Kaori();
const fortnite = new fortniteClient(cfg.tokens.fortnite);
const pastebin = new PastebinAPI(cfg.tokens.pastebin);
const bsClient = new BrawlStars.Client({ token: cfg.tokens.brawlstars });
const antiSpam = new Set();

const setP = (name, status) => client.user.setPresence({ game: { name, type: name === 'Spotify' ? 'LISTENING' : 'PLAYING' }, status });
const randomPresence = () => client.user.setPresence({ game: { name: `${random([client.guilds.get(cfg.defaults.devServerID).members.random().displayName, 'github.com/mragarton/grafit-gartn'])}`, type: 'WATCHING' }, status: 'idle' });
const reportChannel = () => client.channels.get(cfg.defaults.reportChannelID);

let config = {};
let afk = {};

const cHandler = {
  'help': {
    cmd: message => {
      const prefix = message.prefix;
      const everyone = Object.values(cHandler).filter(c => c.type === 'everyone').map(c => `\`${prefix}${_.findKey(cHandler, { ex: c.ex })}\``).join(' ');
      const gamestats = Object.values(cHandler).filter(c => c.type === 'gamestats').map(c => `\`${prefix}${_.findKey(cHandler, { ex: c.ex })}\``).join(' ');
      const admin = Object.values(cHandler).filter(c => c.type === 'admin').map(c => `\`${prefix}${_.findKey(cHandler, { ex: c.ex })}\``).join(' ');
      const dev = Object.values(cHandler).filter(c => c.type === 'dev').map(c => `\`${prefix}${_.findKey(cHandler, { ex: c.ex })}\``).join(' ');
      const nsfw = cfg.defaults.nsfwSites.map(s => `\`${prefix}${s}\``).join(' ');
      const custom = config['customTags'].some(e => e.guildID === message.guild.id) ? config['customTags'].filter(e => e.guildID === message.guild.id).map(e => `\`${prefix}${e.tag}\``).join(' ') : '`Ezen a szerveren nincs beállítva egyéni parancs!`';
      const command = {
        pub: Object.values(cHandler).filter(c => c.type !== 'dev').length + cfg.defaults.nsfwSites.length - 1,
        cus: config['customTags'].some(e => e.guildID === message.guild.id) ? config['customTags'].filter(e => e.guildID === message.guild.id).length : 0,
        dev: Object.values(cHandler).filter(c => c.type === 'dev').length
      }
      const embed = embedBuilder(message.prefix + 'help');
      embed.addField('❯ Általános parancsok', everyone, true);
      embed.addField('❯ Játék integrációs parancsok', gamestats, true);
      embed.addField('❯ NSFW parancsok', nsfw, true);
      embed.addField('❯ Egyéni parancsok', custom, true);
      embed.addField('❯ Adminisztratív parancsok', admin, true);
      embed.addField('❯ Fejlesztői parancsok', dev, true);
      embed.addField('❯ További parancs információk', `\`${prefix}help <parancs-neve>\``);
      embed.addField('❯ Bot információk', `Parancsok száma: ${command.pub + command.cus + command.dev} (**Publikus:** ${command.pub} **Egyéni:** ${command.cus} **Dev:** ${command.dev})
Szerverek száma: ${client.guilds.size} (**Nagy:** ${client.guilds.filter(g => g.large).size})
Felhasználók száma: ${client.users.size} (**Online:** ${client.users.filter(u => u.presence.status !== 'offline').size} **Offline:** ${client.users.filter(u => u.presence.status === 'offline').size})
Bot meghívása saját szerverünkre: \`${message.prefix}invite\`
Bot support szerver: [discord.gg/C83h4Sk](${cfg.defaults.support})
Bot web: ${cfg.defaults.website}
Bot fejlesztője: *${client.users.get(cfg.defaults.ownerID) ? client.users.get(cfg.defaults.ownerID).tag : 'garton#8800'}*`, true);
      message.channel.send(embed).catch(() => { });
    },
    info: 'Bottal kapcsolatos információk összegzése.',
    ex: message => `${message.prefix}help esco`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'invite': {
    cmd: message => {
      const embed = embedBuilder(message.prefix + 'invite');
      embed.setDescription(`[\`🌐Megnyitás böngészőben\`](https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)`);
      message.channel.send(embed).catch(() => { });
    },
    info: 'Bot meghívása saját szerverünkre.',
    ex: message => `${message.prefix}invite`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'ping': {
    cmd: message => message.channel.send('`Lekérdezés...`').then(sent => sent.edit(`:ping_pong:**Ping:** ${sent.createdTimestamp - message.createdTimestamp}ms`)),
    info: 'Bot saját válaszideje lekérése.',
    ex: message => `${message.prefix}ping`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'features': {
    cmd: message => {
      const featureList = client.channels.get(cfg.defaults.featuresChannelID).topic;
      const embed = embedBuilder(message.prefix + 'features');
      embed.setDescription(featureList);
      embed.setThumbnail(client.user.displayAvatarURL);
      message.channel.send(embed).catch(_ => { });
    },
    info: 'A bot tulajdonságairól való leírás.',
    ex: message => `${message.prefix}features`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'avatar': {
    cmd: (message, args) => {
      let member = getMember(message, args.join(" "));
      if (!member || !args.join(" ")) member = message.member;
      const embed = embedBuilder(message.prefix + 'avatar');
      embed.setDescription(`${member.user.tag}\n[\`🌐Megnyitás böngészőben\`](${member.user.displayAvatarURL})`);
      embed.setImage(member.user.displayAvatarURL);
      message.channel.send(embed).catch(() => { });
    },
    info: 'Avatar kép lekérése.',
    ex: message => `${message.prefix}avatar ${client.user.tag}`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'stats': {
    cmd: (message, args) => {
      let member = getMember(message, args.join(" "));
      if (!member || !args.join(" ")) member = message.member;
      const embed = embedBuilder(message.prefix + 'stats');

      const status = {
        'online': 'Elérhető',
        'offline': 'Nem elérhető',
        'invisible': 'Elrejtve',
        'dnd': 'Ne zavarj',
        'idle': 'Nincs gépnél'
      };

      embed.addField('❯ Felhasználó információ', `**ID:** ${member.user.id}
**Tag:** ${member.user.tag}
**Regisztrált:** ${moment(member.user.createdAt).format(`YYYY/MM/DD, HH:mm:ss`)}
**Avatar link:** [\`🌐Megnyitás böngészőben\`](${member.user.displayAvatarURL})
**Státusz:** ${member.user.presence.status ? status[member.user.presence.status] : 'nem olvasható'}
**Elfoglaltság:** ${member.user.presence.game ? member.user.presence.game.name : 'nincs'}`, true);

      embed.addField('❯ Tag információ', `**Role:** ${member.roles.map(r => `\`${r.name}\``).join(' ')}
**Csatlakozott:** ${moment(member.joinedAt).format(`YYYY/MM/DD, HH:mm:ss`)}
**Bot által kickelhető:** ${member.kickable ? 'igen' : 'nem'}
**Bot által bannolható:** ${member.bannable ? 'igen' : 'nem'}
**Szín:** ${member.displayHexColor}
**Voice:** ${member.voiceChannel ? member.voiceChannel.name : 'nincs'}`, true);

      //embed.addField('❯ Szintezés', 'HAMAROSAN!', true);
      embed.setThumbnail(member.user.displayAvatarURL);
      message.channel.send(embed).catch(() => { });
    },
    info: 'Discord felhasználói statisztikák.',
    ex: message => `${message.prefix}stats ${client.user.tag}`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'serverinfo': {
    cmd: message => {
      const guild = message.guild;
      const embed = embedBuilder(message.prefix + 'serverinfo');
      embed.setThumbnail(guild.iconURL ? guild.iconURL : client.user.displayAvatarURL);
      embed.addField(`❯ Összegzés`, `**Név:** ${guild.name}
**ID:** ${guild.id}
**Létrehozva:** ${moment(guild.createdAt).format(`YYYY/MM/DD, HH:mm:ss`)}
**Tulajdonos:** ${guild.owner.user.tag}
**Régió:** ${regions[guild.region]}`, true);

      embed.addField('❯ Statisztika', `**Felhasználók száma:** ${guild.memberCount}
**Botok száma:** ${guild.members.filter(m => m.user.bot).size}
**Saját Emoji-k száma:** ${guild.emojis.size}
**Csatornák száma:** ${guild.channels.size}
**Csoportok száma:** ${guild.roles.size}`, true);
      const roles = guild.roles.map(r => `\`${r.name}\``).join(' ');
      if (roles.length < 1000) embed.addField('❯ Csoportok', roles, true);
      message.channel.send(embed).catch(() => { });
    },
    info: 'Discord szerver információk.',
    ex: message => `${message.prefix}serverinfo`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'esco': {
    cmd: (message, args) => {
      const content = args.includes('zene') ? random(e_music) : random(e_shit);
      const attachment = new Discord.Attachment(random(e_photos));
      message.channel.send(content, attachment).catch(_ => { });
    },
    info: 'Escobarro\'s soul lives in our heart...',
    ex: message => `${message.prefix}esco / ${message.prefix}esco zene`,
    memberNeededPerms: [],
    meNeededPerms: ['ATTACH_FILES'],
    type: 'everyone'
  },
  'bullshit': {
    cmd: message => {
      message.channel.send(bullshit()).catch(() => { });
    },
    info: 'A jól ismert bullshit generátor.',
    ex: message => `${message.prefix}bullshit`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'dogebs': {
    cmd: message => {
      message.channel.send(dogeify(bullshit())).catch(() => { });
    },
    info: '*Doge-osított* bs generálás.',
    ex: message => `${message.prefix}dogebs`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'puppy': {
    cmd: async message => {
      const link = await dog.getDog();
      const attachment = new Discord.Attachment(link);
      message.channel.send(attachment).catch(() => { });
    },
    info: 'Random kutyás kép.',
    ex: message => `${message.prefix}puppy`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  /*
  'aeb99': {
    cmd: async message => {
      const msg = await message.channel.send('`Lekérdezés...`').catch(_ => { });
      const id = await bot_util.facebook.AddPage(cfg.defaults.fbpage, cfg.tokens.fb);
      const res = await bot_util.facebook.pages[id].get.posts.latest();
      const postID = res.id.split('_')[1];
      msg.edit(`**Utolsó ÁtlagEgyetemistaBot99 Facebook poszt**\nhttps://www.facebook.com/atlagegyetemistabot99/posts/${postID}`).catch(() => { });
    },
    info: 'Kijelzi az utoljára generált ÁEB99 Facebook poszt direkt linkjét.',
    ex: message => `${message.prefix}aeb99`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  */
  'flipcoin': {
    cmd: async message => {
      const arr = [{ text: 'Fej', img: cfg.images.fej }, { text: 'Írás', img: cfg.images.iras }];
      const r = random(arr);
      const embed = embedBuilder(message.prefix + 'flipcoin');
      embed.setAuthor('❯ ' + r.text, cfg.images.flip)
      embed.setImage(r.img);
      message.channel.send(embed).catch(_ => { });
    },
    info: 'Fej vagy írás? Döntsön a bot!',
    ex: message => `${message.prefix}flipcoin`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'rolldice': {
    cmd: async message => {
      const r = getRndInteger(1, 7);
      const embed = embedBuilder(message.prefix + 'rolldice');
      embed.setAuthor(`❯ ${r}`, `https://www.random.org/dice/dice${r}.png`)
      message.channel.send(embed).catch(_ => { });
    },
    info: 'Dobj egy számot!',
    ex: message => `${message.prefix}rolldice`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'hug': {
    cmd: async (message, args) => {
      const res = await giphy.random('hug').catch(_ => { })
      const member = getMember(message, args[0]);
      if (!member || !args[0]) return message.reply('nem található személy!').catch(_ => { });

      const embed = embedBuilder(message.prefix + 'hug');
      embed.setAuthor(`${message.member.displayName} megöleli őt: ${member.displayName}`, cfg.images.hug);
      embed.setImage(res.data.image_original_url);
      message.channel.send(embed).catch(_ => { });
    },
    info: 'Megölelni egy említett felhasználót.',
    ex: message => `${message.prefix}hug <felhasználó>`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'slap': {
    cmd: async (message, args) => {
      const res = await giphy.random('faceslap').catch(_ => { })
      const member = getMember(message, args[0]);
      if (!member || !args[0]) return message.reply('nem található személy!').catch(_ => { });

      const embed = embedBuilder(message.prefix + 'slap');
      embed.setAuthor(`${message.member.displayName} felpofozza őt: ${member.displayName}`, cfg.images.slap);
      embed.setImage(res.data.image_original_url);
      message.channel.send(embed).catch(_ => { });
    },
    info: 'Felpofozni egy említett felhasználót.',
    ex: message => `${message.prefix}slap <felhasználó>`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'poem': {
    cmd: async (message, args) => {
      const categories = poemKat.map(k => `\`${k}\``).join(' ');
      const embed = embedBuilder(message.prefix + 'poem');

      if (args[0] === 'kat') {
        embed.setDescription(categories);
        embed.addField('❯ Lekérés', `\`${message.prefix}poem <kat>\``);
        return message.channel.send(embed).catch(_ => { });
      };

      const msg = await message.channel.send('`Lekérdezés...`').catch(_ => { });

      try {
        const kat = args[0] && poemKat.some(k => k.toLowerCase() === args[0].toLowerCase()) ? args[0] : random(poemKat);
        const poetResponse = await request(`https://api.poet.hu/vers.php?f=${cfg.tokens.poetUser}&j=${cfg.tokens.poetPass}&kat=${kat}&rendez=veletlen`);
        const poetObj = convert.xml2json(poetResponse, { compact: true, spaces: 2 });
        embed.setAuthor(JSON.parse(poetObj).versek.vers.szerzo._text);
        embed.setTitle(JSON.parse(poetObj).versek.vers.cim._text);
        embed.setURL(JSON.parse(poetObj).versek.vers.url._text);
        embed.setDescription(JSON.parse(poetObj).versek.vers.versszoveg._text);
        //if (JSON.parse(poetObj).versek.vers.kategoria) embed.addField('❯ Kategória', JSON.parse(poetObj).versek.vers.kategoria.map(k => `\`${k._text}\``).join(' '));
        msg.edit(`**Lekérdezve:** ${moment(Date.now() - message.createdTimestamp).format('mm:ss')}`, embed).catch(() => { });
      } catch (err) {
        msg.edit('Kezeletlen hiba történt.\**Próbáld újra!**').catch(_ => { });
      }
    },
    info: 'Véletlenszerű vers lekérése random vagy adott kategóriából.\nKategóriák áttekintése a parancs után "kat" szó írásával megtekinthető.',
    ex: message => `${message.prefix}poem <kat (opcionális)>`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'emotes': {
    cmd: message => {
      const emotes = message.guild.emojis.map(e => `${e}`).join(" ");
      message.channel.send(emotes ? emotes : 'Ezen a szerveren nincs emote feltöltve!', { split: true }).catch(() => { });
    },
    info: 'Szerveren lévő emote-ok.',
    ex: message => `${message.prefix}emotes`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'afk': {
    cmd: (message, args) => {
      const reason = args.join(' ') ? args.join(' ') : '(Nem hagyott üzenetet)';
      afk[message.author.id] = reason;
      message.react(cfg.defaults.tick).catch(_ => { });
    },
    info: 'AFK státusz bejelentése.',
    ex: message => `${message.prefix}afk <indok (opcionális)>`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'twitchvoice': {
    cmd: async (message, args) => {
      let channel = args.join(' ');
      channel = channel.includes('twitch') ? channel.split('/').pop() : channel;
      const msg = await message.channel.send('`Lekérdezés...`').catch(_ => { });
      const stream = await twitchStreams.get(channel).catch(_ => { });
      if (!stream) return msg.edit('**Hiba:** Nincs találat a megadott csatornára, vagy éppen nem közvetít élőben.').catch(_ => { });
      if (!message.member.voiceChannel) return msg.edit('**Hiba:** Nem talállak hang-csatornán!').catch(_ => { });
      if (!message.member.voiceChannel.joinable) return msg.edit('**Hiba:** Nem tudok csatlakozni a hang-csatornádra!').catch(_ => { });

      if (message.guild.me.voiceChannel) await message.guild.me.voiceChannel.leave();

      const connection = await message.member.voiceChannel.join();
      const find = stream.find(entry => entry.quality === 'Audio Only');
      const dispatcher = connection.playStream(find.url);

      const embed = embedBuilder(message.prefix + 'twitchvoice');
      embed.addField('❯ Csatorna', `[${channel}](https://twitch.com/${channel})`);
      if (!message.guild.members.has(cfg.defaults.radioClientID)) embed.addField('❯ További információ', `Ha további szabályozást szeretnél a lejátszással kapcsolatosan, próbáld ki másik botunkat, ami a Discord-os hang csatornán való média lejátszására lett fejlesztve.
[Itt](${cfg.defaults.support}) tesztelheted és akár meg is hívhatod saját szerveredre!`);
      embed.addField('❯ Kilépéshez', `\`${message.prefix}leavevoice\``)
      msg.edit(embed).catch(_ => { });

    },
    info: 'Twitch élő közvetítés hallgatása hang-csatornán.',
    ex: message => `${message.prefix}twitchvoice`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'leavevoice': {
    cmd: async message => {
      if (message.guild.me.voiceChannel && message.guild.me.voiceChannel.members.size === 1) {
        message.guild.me.voiceChannel.leave();
        message.react(cfg.defaults.tick).catch(_ => { });
        return;
      }
      if (!message.guild.me.voiceChannel) return message.channel.send('**Hiba:** Nem vagyok hang-csatornán!').catch(_ => { });
      if (!message.member.voiceChannel) return message.channel.send('**Hiba:** Nem vagy hang-csatornán!').catch(_ => { });
      if (message.member.voiceChannel.id !== message.guild.me.voiceChannel.id) return message.channel.send('**Hiba:** Nem vagyunk közös hang-csatornán').catch(_ => { });

      message.guild.me.voiceChannel.leave();
      message.react(cfg.defaults.tick).catch(_ => { });
    },
    info: 'A bot elküldése hang-csatornáról.',
    ex: message => `${message.prefix}leavevoice`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'everyone'
  },
  'fortnite': {
    cmd: async (message, args) => {
      const validPlatforms = ['xbl', 'pc', 'psn']
      const platform = args[0].toLowerCase();
      const player = args.slice(1).join(' ');

      if (!validPlatforms.includes(platform)) return message.reply(`ismeretlen platform nevet adtál meg!\n**Kérlek válassz a következő lehetőségek közül:** ${validPlatforms.map(p => `\`${p}\``).join(' ')}`).catch(_ => { });
      if (!player) return message.reply('kérlek adj meg egy játékos nevet a platform után!').catch(_ => { });
      const m = await message.channel.send('`Lekérdezés alatt...`').catch(_ => { });
      try {
        const data = await fortnite.user(player, platform);
        const embed = embedBuilder(message.prefix + 'fortnite');
        embed.setAuthor(`${data.username} (${data.platform})`);
        embed.setTitle('❯ További adatok 🌐');
        embed.setURL(data.url);

        if (data.stats.solo) embed.addField('❯ Solo (All)', `Score: ${data.stats.solo.score}
K/D Ratio: ${data.stats.solo.kd}
Matches: ${data.stats.solo.matches}
Kills: ${data.stats.solo.kills}
Kills/Match: ${data.stats.solo.kills_per_match}
Score/Match: ${data.stats.solo.score_per_match}
Wins: ${data.stats.solo.wins}
Top 3: ${data.stats.solo.top_3}
Top 5: ${data.stats.solo.top_5}
Top 6: ${data.stats.solo.top_6}
Top 12: ${data.stats.solo.top_12}
Top 25: ${data.stats.solo.top_25}`, true);
        if (data.stats.duo) embed.addField('❯ Duo (All)', `Score: ${data.stats.duo.score}
K/D Ratio: ${data.stats.duo.kd}
Matches: ${data.stats.duo.matches}
Kills: ${data.stats.duo.kills}
Kills/Match: ${data.stats.duo.kills_per_match}
Score/Match: ${data.stats.duo.score_per_match}
Wins: ${data.stats.duo.wins}
Top 3: ${data.stats.duo.top_3}
Top 5: ${data.stats.duo.top_5}
Top 6: ${data.stats.duo.top_6}
Top 12: ${data.stats.duo.top_12}
Top 25: ${data.stats.duo.top_25}`, true);
        if (data.stats.squad) embed.addField('❯ Squad (All)', `Score: ${data.stats.squad.score}
K/D Ratio: ${data.stats.squad.kd}
Matches: ${data.stats.squad.matches}
Kills: ${data.stats.squad.kills}
Kills/Match: ${data.stats.squad.kills_per_match}
Score/Match: ${data.stats.squad.score_per_match}
Wins: ${data.stats.squad.wins}
Top 3: ${data.stats.squad.top_3}
Top 5: ${data.stats.squad.top_5}
Top 6: ${data.stats.squad.top_6}
Top 12: ${data.stats.squad.top_12}
Top 25: ${data.stats.squad.top_25}`, true);
        embed.addBlankField();
        if (data.stats.current_solo) embed.addField('❯ Solo (Season)', `Score: ${data.stats.current_solo.score}
K/D Ratio: ${data.stats.current_solo.kd}
Matches: ${data.stats.current_solo.matches}
Kills: ${data.stats.current_solo.kills}
Kills/Match: ${data.stats.current_solo.kills_per_match}
Score/Match: ${data.stats.current_solo.score_per_match}
Wins: ${data.stats.current_solo.wins}
Top 3: ${data.stats.current_solo.top_3}
Top 5: ${data.stats.current_solo.top_5}
Top 6: ${data.stats.current_solo.top_6}
Top 12: ${data.stats.current_solo.top_12}
Top 25: ${data.stats.current_solo.top_25}`, true);
        if (data.stats.current_duo) embed.addField('❯ Duo (Season)', `Score: ${data.stats.current_duo.score}
K/D Ratio: ${data.stats.current_duo.kd}
Matches: ${data.stats.current_duo.matches}
Kills: ${data.stats.current_duo.kills}
Kills/Match: ${data.stats.current_duo.kills_per_match}
Score/Match: ${data.stats.current_duo.score_per_match}
Wins: ${data.stats.current_duo.wins}
Top 3: ${data.stats.current_duo.top_3}
Top 5: ${data.stats.current_duo.top_5}
Top 6: ${data.stats.current_duo.top_6}
Top 12: ${data.stats.current_duo.top_12}
Top 25: ${data.stats.current_duo.top_25}`, true);
        if (data.stats.current_squad) embed.addField('❯ Squad (Season)', `Score: ${data.stats.current_squad.score}
K/D Ratio: ${data.stats.current_squad.kd}
Matches: ${data.stats.current_squad.matches}
Kills: ${data.stats.current_squad.kills}
Kills/Match: ${data.stats.current_squad.kills_per_match}
Score/Match: ${data.stats.current_squad.score_per_match}
Wins: ${data.stats.current_squad.wins}
Top 3: ${data.stats.current_squad.top_3}
Top 5: ${data.stats.current_squad.top_5}
Top 6: ${data.stats.current_squad.top_6}
Top 12: ${data.stats.current_squad.top_12}
Top 25: ${data.stats.current_squad.top_25}`, true);
        m.edit(embed).catch(_ => { });
      } catch (e) {
        console.log(e);
        m.edit('**Hiba:** Nem találom a megadott felhasználót!').catch(_ => { });
      };
    },
    info: 'Fornite játékos statisztika lekérése.\nPlatformok: psn, xbl, pc',
    ex: message => `${message.prefix}fortnite <platform> <név>`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'gamestats'
  },
  'brawlhalla': {
    cmd: async (message, args) => {
      let brawlUser = args.join(' ');
      if (!brawlUser) return message.reply('kérlek adj meg egy feltételt a kereséshez!').catch(_ => { });
      const msg = await message.channel.send('`Lekérdezés...`').catch(_ => { });
      const embed = embedBuilder(message.prefix + 'brawlhalla');
      brawlUser.includes('steam') ? brawlUser = await bh.getBhidBySteamUrl(brawlUser).catch(_ => { }) : brawlUser = await bh.getPlayerStats(isNaN(brawlUser) ? null : brawlUser).catch(_ => { });
      brawlUser ? brawlUser = brawlUser.brawlhalla_id : null;
      if (brawlUser) {
        const user = await bh.getPlayerStats(brawlUser).catch(_ => { });
        const ranked = await bh.getPlayerRanked(brawlUser).catch(_ => { });

        const topLegendXP = user['legends'] ? Math.max(...user.legends.map(legend => legend.xp)) : null;
        const topLegend = user['legends'] ? user.legends.find(legend => legend.xp == topLegendXP) : null;
        const topLegendAvatar = user['legends'] ? `http://garton.ga/botvar/legends/${topLegend.legend_id}.png` : null;

        const topRankedXP = ranked["2v2"] ? Math.max(...ranked['2v2'].map(team => team.peak_rating)) : null;
        const topRanked = ranked["2v2"] ? ranked['2v2'].find(team => team.peak_rating === topRankedXP) : null;
        let players;
        topRanked ? players = topRanked.teamname.split('+') : null;

        embed.setAuthor(`${user.name} (${user.brawlhalla_id})`, topLegendAvatar);
        //embed.setThumbnail(topLegendAvatar);
        embed.addField('❯ Játékos', `Level: ${user.level} (**XP:** ${user.xp})
Games: ${user.games} (**W:** ${user.wins} **L:** ${user.games - user.wins})
Win Ratio: ${user.wins} / ${user.games - user.wins} (**${Math.floor(user.wins / user.games * 100)}%**)`, true);

        if (user["clan"]) embed.addField('❯ Klán', `__**${user['clan'].clan_name}**__ (${user['clan'].clan_id})
Clan XP: ${user['clan'].clan_xp}
Own XP: ${user['clan'].personal_xp}`, true);

        embed.addField('❯ KO', `Bomb: ${user.kobomb} | Mine: ${user.komine}
Spikeball: ${user.kospikeball} | Sidekick: ${user.kosidekick}
Snowball: ${user.kosnowball} | All: ${user.kobomb + user.komine + user.kospikeball + user.kosidekick + user.kosnowball}`, true);
        embed.addBlankField();

        if (user['legends']) embed.addField('❯ Best Legend (Top XP)', `__**${topLegend.legend_name_key.toUpperCase()}**__ (${topLegend.legend_id})
Level: ${topLegend.level} (**XP:** ${topLegend.xp})
KOs: ${topLegend.kos}
Falls: ${topLegend.falls}
Suicides: ${topLegend.suicides}
Win Ratio: ${topLegend.wins} / ${topLegend.games - topLegend.wins} (**${Math.floor(topLegend.wins / topLegend.games * 100)}%**)
Matchtime: ${parseInt(topLegend.matchtime / 60 / 60)}h`, true);

        if (ranked.tier) embed.addField('❯ Ranked 1v1', `__**${ranked.tier}**__ (${ranked.rating} / ${ranked.peak_rating})
Region: ${ranked.region}
Games: ${ranked.games} (**W:** ${ranked.wins} **L:** ${ranked.games - ranked.wins})
Win Ratio: ${ranked.wins} / ${ranked.games - ranked.wins} (**${Math.floor(ranked.wins / ranked.games * 100)}%**)
Rank: **Global:** ${ranked.global_rank} | **Region:** ${ranked.region_rank}`, true);

        if (topRanked) embed.addField('❯ Ranked 2v2 (Top Rating)', `__**${topRanked.tier}**__ (${topRanked.rating} / ${topRanked.peak_rating})
Games: ${topRanked.games} (**W:** ${topRanked.wins} **L:** ${topRanked.games - topRanked.wins})
Win Ratio: ${topRanked.wins} / ${topRanked.games - topRanked.wins} (**${Math.floor(topRanked.wins / topRanked.games * 100)}%**)
Global Rank: ${topRanked.global_rank}
**Team**\n${players[0]} (${topRanked.brawlhalla_id_one})\n${players[1]} (${topRanked.brawlhalla_id_two})`, true);

        msg.edit(embed).catch(_ => { });
      } else {
        bh.getBhidByName(args.join(' ')).then(users => {
          const results = users.map(m => `${m.name} (${m.brawlhalla_id}) (**R:** ${m.region} **E:** ${m.rating}/${m.peak_rating} | __${m.tier}__)`).join('\n');
          embed.setDescription(results);
          embed.addField('❯ Lekérdezés', `\`${message.prefix}brawlhalla <ID>\``);
          msg.edit(embed).catch(_ => { });
        }).catch(error => {
          msg.edit('**Hiba:** Nincs találat a megadott felhasználóra!').catch(_ => { });
        });
      };
    },
    info: 'Brawlhalla játékos statisztika lekérése.\n\nTovábbi lekérdezésért látogass el a **Magyar Brawlhalla** Discord szerverére!\n[🌐discord.gg/V9QVaR4](https://discord.gg/V9QVaR4)',
    ex: message => `${message.prefix}brawlhalla <név / Brawlhalla ID / steamURL>`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'gamestats'
  },
  'brawlstars': {
    cmd: async (message, args) => {
      const tag = args.join(' ');
      if (!tag) return message.reply('kérlek adj meg egy Tag-et!').catch(_ => { });
      const msg = await message.channel.send('`Lekérdezés...`').catch(_ => { });
      const player = await bsClient.getPlayer(tag).catch(_ => { });
      if (!player) return msg.edit('**Hiba:** Nincs találat a megadott TAG-re!').catch(_ => { });

      const emojis = {
        bigbrawl: client.emojis.get('596385247495585819'),
        duo: client.emojis.get('596385256680980502'),
        robo: client.emojis.get('596385263933194260'),
        solo: client.emojis.get('596385271595925514'),
        trophie: client.emojis.get('596385279493931019'),
        victory: client.emojis.get('596385288562016264'),
        xp: client.emojis.get('596385303099473933')
      };

      const embed = embedBuilder(message.prefix + 'brawlstars');
      embed.setAuthor(`${player.name} (#${player.tag})`, player.avatarUrl);
      embed.addField('❯ Trophies', `${player.trophies}/${player.highestTrophies} ${emojis.trophie}`);
      embed.addField('❯ Victories', `${player.victories} ${emojis.victory}`, true);
      embed.addField('❯ Solo Victories', `${player.soloShowdownVictories} ${emojis.solo}`, true);
      embed.addField('❯ Duo Victories', `${player.duoShowdownVictories} ${emojis.duo}`, true);
      embed.addField('❯ [Best Time] Big Brawler', `${player.bestTimeAsBigBrawler} ${emojis.bigbrawl}`, true);
      embed.addField('❯ [Best Time] Robo Rumble', `${player.bestRoboRumbleTime} ${emojis.robo}`, true);
      embed.addField('❯ XP', `${player.expLevel} (${player.expFmt}) ${emojis.xp}`, true);
      if (player.club) {
        embed.addField('❯ Club Name', player.club.name, true);
        embed.addField('❯ Club Tag', `#${player.club.tag}`, true);
        embed.addField('❯ Club Role', player.club.role, true);
      }
      msg.edit(embed).catch(_ => { });
    },
    info: 'BrawlStars játékos statisztika lekérése.\nA lekérés #BrawlTag alapján lehetséges!',
    ex: message => `${message.prefix}brawlstars <#tag>`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'gamestats'
  },
  'osu': {
    cmd: async (message, args) => {
      const u = args.join(' ');
      const user = await osuApi.getUser({ u }).catch(_ => { });
      if (!user || !user.name) return message.reply('felhasználó nem található!').catch(_ => { });
      const embed = embedBuilder(message.prefix + 'osu');
      embed.setAuthor(`${user.name} (${user.id})`, cfg.images.osu);
      embed.addField('❯ Összegzés', `Scores: **Ranked:** ${user.scores.ranked} (**Total:** ${user.scores.total})
PP: ${user.pp.raw} (**Rank:** ${user.pp.rank} / **Country:** ${user.pp.countryRank})
Country: ${user.country}
Level: ${Math.floor(user.level)}
Accuracy: ${Math.floor(user.accuracy)}%`);
      message.channel.send(embed).catch(_ => { });
    },
    info: 'Osu! játékos statisztika lekérése.',
    ex: message => `${message.prefix}osu <név>`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'gamestats'
  },
  'purge': {
    cmd: message => {
      const amount = !!parseInt(message.content.split(' ')[1]) ? parseInt(message.content.split(' ')[1]) : null;
      const embed = embedBuilder(message.prefix + 'purge');
      if (!amount || amount > 100 || amount < 2) {
        embed.setDescription('Nem sikerült az üzenetek törlése.\nA megadott értéknek 2 és 100 között kell lennie!');
        return message.channel.send(embed).catch(() => { });
      };
      message.channel.fetchMessages({ limit: amount }).then(messages => {
        message.channel.bulkDelete(messages)
          .then(() => {
            embed.setDescription(`Törölve lett **${amount}** üzenet!\n${message.author.tag} által.`);
            message.channel.send(embed).catch(() => { });
          })
          .catch(() => {
            embed.setDescription('Nem sikerült az üzenetek törlése.\nFeltehető, hogy a botnak nincs joga az üzenetek törlésére.');
            message.channel.send(embed).catch(() => { });
          });
      });
    },
    info: 'Több üzenet törlése egyszerre! (2-100)',
    ex: message => `${message.prefix}purge 50`,
    memberNeededPerms: ['MANAGE_MESSAGES'],
    meNeededPerms: ['MANAGE_MESSAGES'],
    type: 'admin'
  },
  'kick': {
    cmd: async (message, args) => {
      const member = getMember(message, args[0]);
      if (!member || !args[0]) return message.reply('nem található személy!').catch(_ => { });
      if (!member.kickable) return message.reply('ezt a személyt nem tudom kirúgni!').catch(_ => { });

      if (message.member.highestRole.position <= member.highestRole.position || member.user.id === message.guild.ownerID) return message.reply('ezt a parancsot nem hajthatod végre nálad magasabb vagy ugyanolyan rangon lévő felhasználón!').catch(_ => { });

      let reason = args.slice(1).join(" ");
      reason = reason ? reason : 'Nincs megadott indok!';
      const gotMSG = await member.send(`Ki lettél rúgva a(z) **${message.guild.name}** szerverről!
Kirúgást végrehajtotta: ${message.author.tag}
Indok: ${reason}`).catch(_ => { });

      await member.kick(reason).catch(_ => { });

      const embed = embedBuilder(message.prefix + 'kick');
      embed.setDescription(`**${member.user.tag}** ki lett rúgva **${message.author.tag}** által!
Indok: ${reason}
Privátot megkapta: ${gotMSG ? 'igen' : 'nem'}`);
      await message.channel.send(embed).catch(_ => { });
    },
    info: 'Szerverről való kirúgás indokkal ellátva!\nA kirúgott fél megkapja az indokot privát üzenetben.',
    ex: message => `${message.prefix}kick <felhasználó> <indok (opcionális)>`,
    memberNeededPerms: ['KICK_MEMBERS'],
    meNeededPerms: ['KICK_MEMBERS'],
    type: 'admin'
  },
  'ban': {
    cmd: async (message, args) => {
      const member = getMember(message, args[0]);
      if (!member || !args[0]) return message.reply('nem található személy!\nHa offline/hackban-t szeretnél alkalmazni, akkor használd a `g.oban <id>` parancsot!').catch(_ => { });
      if (!member.bannable) return message.reply('ezt a személyt nem tudom kitiltani!').catch(_ => { });

      if (message.member.highestRole.position <= member.highestRole.position || member.user.id === message.guild.ownerID) return message.reply('ezt a parancsot nem hajthatod végre nálad magasabb vagy ugyanolyan rangon lévő felhasználón!').catch(_ => { });

      let reason = args.slice(1).join(" ");
      reason = reason ? reason : 'Nincs megadott indok!';
      const gotMSG = await member.send(`Ki lettél tiltva a(z) **${message.guild.name}** szerverről!
kitiltást végrehajtotta: ${message.author.tag}
Indok: ${reason}`).catch(_ => { });

      await member.ban(reason).catch(_ => { });

      const embed = embedBuilder(message.prefix + 'ban');
      embed.setDescription(`**${member.user.tag}** ki lett tiltva **${message.author.tag}** által!
Indok: ${reason}
Privátot megkapta: ${gotMSG ? 'igen' : 'nem'}`);
      await message.channel.send(embed).catch(_ => { });
    },
    info: 'Szerverről való kitiltás indokkal ellátva!\nA kirúgott fél megkapja az indokot privát üzenetben.',
    ex: message => `${message.prefix}ban <felhasználó> <indok (opcionális)>`,
    memberNeededPerms: ['BAN_MEMBERS'],
    meNeededPerms: ['BAN_MEMBERS'],
    type: 'admin'
  },
  'softban': {
    cmd: async (message, args) => {
      const member = getMember(message, args[0]);
      if (!member || !args[0]) return message.reply('nem található személy!\nHa offline/hackban-t szeretnél alkalmazni, akkor használd a `g.oban <id>` parancsot!').catch(_ => { });
      if (!member.bannable) return message.reply('ezt a személyt nem tudom kitiltani!').catch(_ => { });

      if (message.member.highestRole.position <= member.highestRole.position || member.user.id === message.guild.ownerID) return message.reply('ezt a parancsot nem hajthatod végre nálad magasabb vagy ugyanolyan rangon lévő felhasználón!').catch(_ => { });


      let reason = args.slice(1).join(" ");
      reason = reason ? reason : 'Nincs megadott indok!';
      const gotMSG = await member.send(`Ki lettél tiltva a(z) **${message.guild.name}** szerverről!
kitiltást végrehajtotta: ${message.author.tag}
Indok: ${reason}`).catch(_ => { });

      await member.ban({ reason, days: 7 }).catch(_ => { });
      await message.guild.unban(member.user.id).catch(_ => { });

      const embed = embedBuilder(message.prefix + 'softban');
      embed.setDescription(`**${member.user.tag}** soft - bannolva lett **${message.author.tag}** által!
Indok: ${reason}
Privátot megkapta: ${gotMSG ? 'igen' : 'nem'}`);
      await message.channel.send(embed).catch(_ => { });
    },
    info: 'Szerverről való kitiltás és instant feloldás indokkal ellátva!\nA tag által küldött üzenetek törölve lesznek.\nA kirúgott fél megkapja az indokot privát üzenetben.',
    ex: message => `${message.prefix}softban <felhasználó> <indok (opcionális)>`,
    memberNeededPerms: ['BAN_MEMBERS'],
    meNeededPerms: ['BAN_MEMBERS'],
    type: 'admin'
  },
  'oban': {
    cmd: async (message, args) => {
      const ID = args[0];
      let reason = args.slice(1).join(" ");
      reason = reason ? reason : 'Nincs megadott indok!';

      message.guild.ban(ID).then(_ => {
        const embed = embedBuilder(message.prefix + 'ban');
        embed.setDescription(`**(${ID})** ki lett tiltva **${message.author.tag}** által!
Indok: ${reason}`);
        message.channel.send(embed).catch(_ => { });
      }).catch(_ => {
        message.reply('nem sikerült a kitiltás!\nHibás ID, vagy a személy még a szerveren tartózkodik egy magasabb rangon, mint a bot.').catch(_ => { });
      })
    },
    info: 'Szerverről való offline kitiltás!\nA kirúgott személy nem kap privátban üzenetet az indokról!',
    ex: message => `${message.prefix}oban <felhasználó> <indok (opcionális)>`,
    memberNeededPerms: ['BAN_MEMBERS'],
    meNeededPerms: ['BAN_MEMBERS'],
    type: 'admin'
  },
  'logconfig': {
    cmd: async (message, args) => {

      if (args[0] === 'setchannel') {

        const channel = getGuildChannel(message, args.slice(1).join(" "));
        if (!channel || !args.join(" ")) return message.reply('nem találom a megadott csatornát!').catch(_ => { });

        config.logChannels[message.guild.id] = channel.id;
        try {
          await saveConfig({ type: 'logChannels', channelID: channel.id, guildID: message.guild.id });
          message.channel.send(`Log csatorna sikeresen beállítva!\n**Csatorna:** ${channel}`).catch(_ => { });
        }
        catch (e) {
          console.error('Konfig mentése sikertelen! (logChannels)');
          console.error(e);
          message.channel.send("Konfiguráció véglegesítése sikertelen.\n**Kérlek keress fel egy fejlesztőt!**").catch(_ => { });
        }
        return;
      } else if (args[0] === 'set') {
        const logs = args.slice(1).join('|').split('|');
        if (logs.some(value => value !== 'join' && value !== 'leave' && value !== 'delete' && value !== 'update')) return message.reply('hibás paramétereket adtál meg!').catch(_ => { });

        config.logs[message.guild.id] = logs;
        try {
          await saveConfig({ type: 'logs', logBlocks: logs.join('|'), guildID: message.guild.id });
          message.channel.send(`Log blokkok sikeresen beállítva!\n**Log:** ${logs.map(l => `\`${l}\``).join(' ')}`).catch(_ => { });
        }
        catch (e) {
          console.error('Konfig mentése sikertelen! (logs)');
          console.error(e);
          message.channel.send("Konfiguráció véglegesítése sikertelen.\n**Kérlek keress fel egy fejlesztőt!**").catch(_ => { });
        }
        return;
      };

      const logChannelID = Object.keys(config['logChannels']).includes(message.guild.id) ? config['logChannels'][message.guild.id] : 'Nincs adat.'
      const logValues = Object.keys(config['logs']).includes(message.guild.id) ? config['logs'][message.guild.id].map(e => `\`${e}\``).join(' ') : 'Nincs adat.';

      const findChannel = message.guild.channels.get(logChannelID) ? `${message.guild.channels.get(logChannelID).name} (${logChannelID})` : `Csatorna nem található! (${logChannelID})`

      const embed = embedBuilder(message.prefix + 'logconfig');
      embed.addField('❯ Log csatorna', findChannel);
      embed.addField('❯ Engedélyezett logolás', logValues);
      embed.addField('❯ Konfig parancsok', `\`${message.prefix}logconfig set <join|leave|update|delete>\`
\`${message.prefix}logconfig setchannel <csatorna - <ID/Név/Tag>\``);

      message.channel.send(embed).catch(_ => { });
    },
    info: 'Szerver log konfiguráció listázása.',
    ex: message => `${message.prefix}logconfig set update|delete`,
    memberNeededPerms: ['ADMINISTRATOR'],
    meNeededPerms: [],
    type: 'admin'
  },
  'welcomeconfig': {
    cmd: async (message, args) => {

      if (args[0] === 'setchannel') {

        const channel = getGuildChannel(message, args.slice(1).join(" "));
        if (!channel || !args.join(" ")) return message.reply('nem találom a megadott csatornát!').catch(_ => { });

        config.welcomeChannels[message.guild.id] = channel.id;
        try {
          await saveConfig({ type: 'welcomeChannels', channelID: channel.id, guildID: message.guild.id });
          message.channel.send(`Üdvözlő csatorna sikeresen beállítva!\n**Csatorna:** ${channel}`).catch(_ => { });
        }
        catch (e) {
          console.error('Konfig mentése sikertelen! (welcomeChannels)');
          console.error(e);
          message.channel.send("Konfiguráció véglegesítése sikertelen.\n**Kérlek keress fel egy fejlesztőt!**").catch(_ => { });
        }
        return;
      } else if (args[0] === 'background') {
        const attachment = message.attachments.first();
        if (!attachment) return message.reply('fel kell töltened egy képet az üzenettel együtt!').catch(_ => { });
        if (attachment.width !== 200 || attachment.height !== 300) return message.reply('hibás kép méret!\n**Elvárt:** 200 x 300px')
        try {

          const imgurData = await imgur.uploadUrl(attachment.url);
          const imgurURL = imgurData.data.link;
          config.welcomeBG[message.guild.id] = imgurURL;

          await saveConfig({ type: 'welcomeBG', link: imgurURL, guildID: message.guild.id });
          message.channel.send(`Üdvözlő háttérkép sikeresen beállítva!`).catch(_ => { });
        }
        catch (e) {
          console.error('Konfig mentése sikertelen! (welcomeBG)');
          console.error(e);
          message.channel.send("Konfiguráció véglegesítése sikertelen.\n**Kérlek keress fel egy fejlesztőt!**").catch(_ => { });
        }
        return;
      };

      const logChannelID = Object.keys(config['welcomeChannels']).includes(message.guild.id) ? config['welcomeChannels'][message.guild.id] : 'Nincs adat.'
      const findChannel = message.guild.channels.get(logChannelID) ? `${message.guild.channels.get(logChannelID).name} (${logChannelID})` : `Csatorna nem található! (${logChannelID})`

      const embed = embedBuilder(message.prefix + 'welcomeconfig');
      embed.addField('❯ Üdvözlő csatorna', findChannel);
      embed.addField('❯ Konfig parancsok', `\`${message.prefix}welcomeconfig setchannel <csatorna - <ID/Név/Tag>\`
      \`${message.prefix}welcomeconfig background\` **--**  200 x 300px -es képpel csatolva.`);

      message.channel.send(embed).catch(_ => { });
    },
    info: 'Üdvözlő üzenet konfiguráció listázása.',
    ex: message => `${message.prefix}welcomeconfig setchannel talking`,
    memberNeededPerms: ['ADMINISTRATOR'],
    meNeededPerms: [],
    type: 'admin'
  },
  'setprefix': {
    cmd: async (message, args) => {
      const newPrefix = args.join(' ');
      if (!newPrefix) return message.reply('kérlek adj meg egy prefixet a parancs után!').catch(_ => { });

      config.prefixes[message.guild.id] = newPrefix;
      try {
        await saveConfig({ type: 'prefixes', prefix: newPrefix, guildID: message.guild.id });
        message.channel.send(`Új prefix sikeresen beállítva!\n**Prefix:** \`${newPrefix}\``).catch(_ => { });
      }
      catch (e) {
        console.error('Konfig mentése sikertelen! (prefixes)');
        console.error(e);
        message.channel.send("Konfiguráció véglegesítése sikertelen.\n**Kérlek keress fel egy fejlesztőt!**").catch(_ => { });
      };
    },
    info: 'Egyéni prefix beállítása.',
    ex: message => `${message.prefix}setprefix ?`,
    memberNeededPerms: ['ADMINISTRATOR'],
    meNeededPerms: [],
    type: 'admin'
  },
  'nfo': {
    cmd: async message => {
      if (!message.channel.topic) return message.reply('ennek a csatornának nincs leírás beállítva!').catch(_ => { });
      const embed = embedBuilder(message.prefix + 'nfo');
      embed.setTitle(`#${message.channel.name}`);
      embed.setDescription(message.channel.topic);
      message.channel.send(embed).catch(_ => { });
    },
    info: 'Csatorna topikjának megjelenítése beágyazva.',
    ex: message => `${message.prefix}nfo`,
    memberNeededPerms: ['MANAGE_MESSAGES'],
    meNeededPerms: [],
    type: 'admin'
  },
  'say': {
    cmd: async (message, args) => {
      const content = args.join(' ');
      if (!content) return message.reply('kérlek írj valami szöveget is.');
      message.channel.send(content).catch(_ => { });
    },
    info: 'A bot által üzenetet küldeni az adott csatornára.',
    ex: message => `${message.prefix}say <szöveg>`,
    memberNeededPerms: ['MANAGE_MESSAGES'],
    meNeededPerms: [],
    type: 'admin'
  },
  'embed': {
    cmd: async (message, args) => {
      const content = args.join(' ');
      if (!content) return message.reply('kérlek írj valami szöveget is.');
      const embed = embedBuilder(message.prefix + 'say');
      embed.setAuthor(message.author.tag, message.author.displayAvatarURL);
      embed.setDescription(content);
      message.channel.send(embed).catch(_ => { });
    },
    info: 'A bot által beágyazott üzenetet küldeni az adott csatornára.',
    ex: message => `${message.prefix}embed <szöveg>`,
    memberNeededPerms: ['MANAGE_MESSAGES'],
    meNeededPerms: [],
    type: 'admin'
  },
  'mute': {
    cmd: async (message, args) => {
      const member = getMember(message, args[0]);
      if (!member || !args[0]) return message.reply('nem található személy!').catch(_ => { });

      if (message.member.highestRole.position <= member.highestRole.position || member.user.id === message.guild.ownerID) return message.reply('ezt a parancsot nem hajthatod végre nálad magasabb vagy ugyanolyan rangon lévő felhasználón!').catch(_ => { });

      const embed = embedBuilder(message.prefix + 'mute');

      message.channel.overwritePermissions(member.user.id, {
        SEND_MESSAGES: false
      }).then(_ => {
        embed.setDescription(`**${member.user.tag}** sikeresen le lett tiltva erről a csatornáról!\n${message.author.tag} által.`);
        message.channel.send(embed).catch(() => { });
      }).catch(_ => {
        embed.setDescription('Nem sikerült felülírni a csatorna beállitásait.\nFeltehető, hogy a botnak nincs joga az adott személyt vagy csatornát módosítani.');
        message.channel.send(embed).catch(() => { });
      });
    },
    info: 'Felhasználó írás jogának megvonása.',
    ex: message => `${message.prefix}mute ${client.user.tag}`,
    memberNeededPerms: ['MANAGE_MESSAGES'],
    meNeededPerms: ['MANAGE_CHANNELS'],
    type: 'admin'
  },
  'unmute': {
    cmd: async (message, args) => {
      const member = getMember(message, args[0]);
      if (!member || !args[0]) return message.reply('nem található személy!').catch(_ => { });

      if (message.member.highestRole.position <= member.highestRole.position || member.user.id === message.guild.ownerID) return message.reply('ezt a parancsot nem hajthatod végre nálad magasabb vagy ugyanolyan rangon lévő felhasználón!').catch(_ => { });

      const embed = embedBuilder(message.prefix + 'unmute');

      message.channel.overwritePermissions(member.user.id, {
        SEND_MESSAGES: false
      }).then(_ => {
        embed.setDescription(`**${member.user.tag}** írás joga sikeresen engedélyezve lett ezen a csatornán!\n${message.author.tag} által.`);
        message.channel.send(embed).catch(() => { });
      }).catch(_ => {
        embed.setDescription('Nem sikerült felülírni a csatorna beállitásait.\nFeltehető, hogy a botnak nincs joga az adott személyt vagy csatornát módosítani.');
        message.channel.send(embed).catch(() => { });
      });
    },
    info: 'Felhasználó írás jogának engedélyezése.',
    ex: message => `${message.prefix}unmute ${client.user.tag}`,
    memberNeededPerms: ['MANAGE_MESSAGES'],
    meNeededPerms: ['MANAGE_CHANNELS'],
    type: 'admin'
  },
  'autorole': {
    cmd: async (message, args) => {
      const role = getGuildRole(message, args[0]);
      if (!role || !args[0]) return message.reply('nem található role!').catch(_ => { });

      config.autoRole[message.guild.id] = role.id;
      try {
        await saveConfig({ type: 'autoRole', roleID: role.id, guildID: message.guild.id });
        message.channel.send(`AutoRole sikeresen beállítva!\n**Role:** \`${role.name}\``).catch(_ => { });
      }
      catch (e) {
        console.error('Konfig mentése sikertelen! (autoRole)');
        console.error(e);
        message.channel.send("Konfiguráció véglegesítése sikertelen.\n**Kérlek keress fel egy fejlesztőt!**").catch(_ => { });
      };
    },
    info: 'Automatikus role adás szerverre való belépéskor!',
    ex: message => `${message.prefix}autorole Újonc`,
    memberNeededPerms: ['ADMINISTRATOR'],
    meNeededPerms: [],
    type: 'admin'
  },
  'nameprefix': {
    cmd: async (message, args) => {
      const p = args.join(' ');
      if (!p) return message.reply('adj meg egy név prefixet!').catch(_ => { });

      config.namePrefix[message.guild.id] = p;
      try {
        await saveConfig({ type: 'namePrefix', namePrefix: p, guildID: message.guild.id });
        message.channel.send(`Név Prefix sikeresen beállítva!\n**Prefix:** \`${p}\``).catch(_ => { });
      }
      catch (e) {
        console.error('Konfig mentése sikertelen! (namePrefix)');
        console.error(e);
        message.channel.send("Konfiguráció véglegesítése sikertelen.\n**Kérlek keress fel egy fejlesztőt!**").catch(_ => { });
      };
    },
    info: 'Automatikus név prefix adás szerverre való belépéskor!',
    ex: message => `${message.prefix}nameprefix Újonc -`,
    memberNeededPerms: ['ADMINISTRATOR'],
    meNeededPerms: [],
    type: 'admin'
  },
  'addtag': {
    cmd: async (message, args) => {
      const tag = args[0];
      const text = args.slice(1).join(' ');
      if (!tag) return message.reply('kérlek adj meg egy tag-et és szöveget a parancs használatához!').catch(_ => { });
      if (!text) return message.reply('kérlek adj meg egy szöveget a parancs használatához!').catch(_ => { });

      config.customTags.push({ tag, text, guildID: message.guild.id });
      try {
        await saveConfig({ type: 'customTags', text, tag, guildID: message.guild.id });
        message.channel.send(`Új parancs(tag) sikeresen hozzáadva!\n**Tag:** \`${message.prefix}${tag}\`\n**Szöveg:** \`${text}\``).catch(_ => { });
      }
      catch (e) {
        console.error('Konfig mentése sikertelen! (customTags)');
        console.error(e);
        message.channel.send("Konfiguráció véglegesítése sikertelen.\n**Kérlek keress fel egy fejlesztőt!**").catch(_ => { });
      };
    },
    info: 'Saját parancs hozzáadása a bothoz.',
    ex: message => `${message.prefix}addtag <tag> <szöveg>`,
    memberNeededPerms: ['ADMINISTRATOR'],
    meNeededPerms: [],
    type: 'admin'
  },
  'deltag': {
    cmd: async (message, args) => {
      const tag = args[0];
      if (!tag) return message.reply('kérlek add meg a törlésre kívánt tag nevét!').catch(_ => { });
      if (!config['customTags'].some(e => e.guildID === message.guild.id && e.tag === tag)) return message.reply('nincs ilyen tag a szerveren!').catch(_ => { });

      try {
        await trimConfig({ type: 'tags', tag, guildID: message.guild.id });
        message.channel.send(`Egyéni parancs törölve!`).catch(_ => { });
      }
      catch (e) {
        console.error('Konfig mentése sikertelen! (customTags)');
        console.error(e);
        message.channel.send("Konfiguráció véglegesítése sikertelen.\n**Kérlek keress fel egy fejlesztőt!**").catch(_ => { });
      };
    },
    info: 'Egyénileg hozzáadott parancs törlése.',
    ex: message => `${message.prefix}deltag <tag>`,
    memberNeededPerms: ['ADMINISTRATOR'],
    meNeededPerms: [],
    type: 'admin'
  },
  'resetconfig': {
    cmd: async message => {
      const embed = embedBuilder(message.prefix + 'resetconfig');
      embed.setDescription('Ez a parancs törölni fogja a szervernek bottal kapcsolatos beállításait.\nBiztosan ezt szeretnéd?')
      message.channel.send(embed).then(async m => {
        const accept = cfg.defaults.tick;
        const decline = cfg.defaults.cross;
        const aReact = await m.react(accept);
        const dReact = await m.react(decline);
        const filter = (reaction, user) => reaction.emoji.name === accept || reaction.emoji.name === decline && user.id === message.author.id;
        const collector = m.createReactionCollector(filter, { time: 10000 });

        collector.on('collect', async r => {
          switch (r.emoji.name) {
            case accept:
              const msg = await message.channel.send('Konfig törlésének kezdeményezése...').catch(_ => { });
              collector.stop();
              try {
                trimConfig({ guildID: message.guild.id, type: 'config' });
                msg.edit('Konfiguráció sikeresen törölve!').catch(_ => { });
              } catch (e) {
                console.error('Konfig mentése sikertelen! (trimConfig - Config)');
                console.error(e);
                msg.edit("Konfiguráció véglegesítése sikertelen.\n**Kérlek keress fel egy fejlesztőt!**").catch(_ => { });
              }
              break;
            case decline:
              message.channel.send('A konfig nem lesz törölve.').catch(_ => { });
              collector.stop();
              break;
          };
        });
        collector.on('end', async collected => {
          if (collected.size === 0) {
            await message.channel.send("Lejárt a választásra szánt idő!").catch(_ => { });
          };
          await aReact.remove(m.author).catch(() => { });
          await dReact.remove(m.author).catch(() => { });
        });
      }).catch(_ => { });
    },
    info: 'Ezzel a paranccsal alaphelyzetbe állíthatod a szervereden lévő bot konfigot!\n**Figyelem!** Ez a lépés nem visszavonható!',
    ex: message => `${message.prefix}resetconfig`,
    memberNeededPerms: ['ADMINISTRATOR'],
    meNeededPerms: [],
    type: 'admin'
  },
  nsfw: {
    cmd: async (message, args, site) => {
      args = args.join(' ').split(',');
      const msg = await message.channel.send('Lekérdezés...').catch(() => { });
      try {
        const images = await kaori.search(site, { tags: args, limit: 10000, random: true });
        const arr = images.map(i => i.common.fileURL);
        const pick = random(arr);
        if (!pick) return msg.edit('Nincs találat!');
        msg.edit(`**Találat:** ${pick}`);
      } catch (err) {
        msg.edit('Nincs találat!');
      };
    },
    info: site => `Lekérdezés A(z) \`${site}\` oldalról.`,
    ex: (message, site) => `${message.prefix}${site} <tag>`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'nsfw'
  },
  'eval': {
    cmd: message => {
      const args = message.content.split(" ").slice(1);
      message.delete(100).catch(() => { });
      try {
        const code = args.join(" ");
        eval(code);
        message.channel.send(code, { code: 'js' }).then(m => m.react(cfg.defaults.tick).catch(_ => { })).catch(() => { });
      } catch (err) {
        console.log(err)
      };
    },
    info: 'Eval - Fejlesztői parancs.',
    ex: message => `${message.prefix}eval console.log('hello');`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'dev'
  },
  'guilds': {
    cmd: async message => {
      const guilds = client.guilds.map(g => `${g.name} (${g.id} / ${g.memberCount}) - Owner Tag: ${g.owner ? g.owner.user.tag : 'unable to fetch'}`).join('\n');
      const link = await pastebin.createPaste({ text: guilds, title: `${client.user.tag}: Guilds`, format: null, privacy: 1, expiration: '10M' });
      message.channel.send(`**G:** ${client.guilds.size} **U:** ${client.users.size}\n${link}`).catch(() => { });
    },
    info: 'Guilds - Fejlesztői parancs.',
    ex: message => `${message.prefix}guilds`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'dev'
  },
  'leaveguild': {
    cmd: (message, args) => {
      const guildID = args[0];
      const guild = client.guilds.get(guildID);
      if (!guild) return message.reply('ismeretlen guild!').catch(() => { });
      guild.leave().then(() => message.channel.send(`**Kilépés** \`${guild.name}\``).catch(() => { })).catch(err => {
        message.reply('kezeletlen hiba történt!').catch(() => { });
        console.log(err);
      });
    },
    info: 'leaveguild - Fejlesztői parancs.',
    ex: message => `${message.prefix}leaveguild <guildID>`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'dev'
  },
  'destroy': {
    cmd: message => {
      message.channel.send('Viszlát!').then(_ => client.destroy().catch(_ => { })).catch(_ => { });
    },
    info: 'Logs out, terminates the connection to Discord, and destroys the client. - Fejlesztői parancs',
    ex: message => `${message.prefix}destroy`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'dev'
  },
  'ginfo': {
    cmd: (message, args) => {
      const guild = client.guilds.get(args[0]) || client.guilds.find(g => g.name.toLowerCase().includes(args.join(' ').toLowerCase())) || null;
      if (!guild) return message.reply('hibás gID / Név!').catch(_ => { });

      const embed = embedBuilder(message.prefix + 'ginfo');
      embed.setThumbnail(guild.iconURL ? guild.iconURL : client.user.displayAvatarURL);
      embed.addField(`❯ Összegzés`, `**Név:** ${guild.name}
**ID:** ${guild.id}
**Létrehozva:** ${moment(guild.createdAt).format(`YYYY/MM/DD, HH:mm:ss`)}
**Tulajdonos:** ${guild.owner.user.tag}
**Régió:** ${regions[guild.region]}`, true);

      embed.addField('❯ Statisztika', `**Felhasználók száma:** ${guild.memberCount}
**Botok száma:** ${guild.members.filter(m => m.user.bot).size}
**Saját Emoji-k száma:** ${guild.emojis.size}
**Csatornák száma:** ${guild.channels.size}
**Csoportok száma:** ${guild.roles.size}`, true);
      const roles = guild.roles.map(r => `\`${r.name}\``).join(' ');
      if (roles.length < 1000) embed.addField('❯ Csoportok', roles, true);
      message.channel.send(embed).catch(() => { });
    },
    info: 'Guild / Szerver információk. - Fejlesztői parancs',
    ex: message => `${message.prefix}ginfo <ID>`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'dev'
  },
  'ann': {
    cmd: (message, args) => {
      const ann = args.join(' ');
      if (!ann) return message.reply('szöveg nélkül nehéz lesz.');
      client.guilds.forEach(g => {
        const channel = g.channels.filter(c => c.type === 'text' && c.permissionsFor(client.user).has('SEND_MESSAGES')).first();
        if (!channel) return;
        const embed = embedBuilder('Fejlesztői bejelentés');
        embed.setDescription(ann);
        channel.send(embed).catch(_ => { });
      });
      message.react(cfg.defaults.tick).catch(_ => { });
    },
    info: 'Bejelentés küldése minden szerverre. - Fejlesztői parancs',
    ex: message => `${message.prefix}ann <ID>`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'dev'
  },
  /*
  'aebtop': {
    cmd: async (message, args) => {
      const msg = await message.channel.send('`Lekérdezés...`').catch(_ => { });
      const number = !isNaN(args[0]) && args[0] > 1 && args[0] < 6 ? args[0] : 3;
      const text = await getTopAEBPosts(number);
      const embed = embedBuilder(message.prefix + 'aebtop');
      embed.setDescription(text);
      embed.setThumbnail(cfg.images.aeblogo);
      msg.edit(`**Lekérdezve:** ${moment(Date.now() - message.createdTimestamp).format('mm:ss')}`, embed).catch(() => { });
    },
    info: 'ÁEB99 Top posztok lekérése. - Fejlesztői parancs',
    ex: message => `${message.prefix}aebtop <3-5>`,
    memberNeededPerms: [],
    meNeededPerms: [],
    type: 'dev'
  }
  */
};

const random = array => {
  return array[(Math.random() * array.length) | 0];
};

const getRndInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const embedBuilder = cmd => {
  return new Discord.RichEmbed()
    .setFooter(`${cmd} - ${client.user.username}`, client.user.displayAvatarURL)
    .setColor(cfg.defaults.DEC)
    .setTimestamp();
};

const getMember = (message, arg) => {
  return message.mentions.members.first() || message.guild.members.find(member => member.displayName.toLowerCase().includes(arg.toLowerCase())) || message.guild.members.find(member => member.user.tag.toLowerCase().includes(arg.toLowerCase())) || null;
};

const getGuildChannel = (message, arg) => {
  return message.mentions.channels.first() || message.guild.channels.get(arg) || message.guild.channels.find(c => c.name.toLowerCase() === arg.toLowerCase()) || null;
};

const getGuildRole = (message, arg) => {
  return message.mentions.roles.first() || message.guild.roles.get(arg) || message.guild.roles.find(r => r.name.toLowerCase() === arg.toLowerCase()) || null;
};

const loadConfig = async () => {
  await sql.run('CREATE TABLE IF NOT EXISTS logChannels (guildID TEXT, channelID TEXT)').catch(console.error);
  await sql.run('CREATE TABLE IF NOT EXISTS logs (guildID TEXT, logBlocks TEXT)').catch(console.error);
  await sql.run('CREATE TABLE IF NOT EXISTS prefixes (guildID TEXT, prefix TEXT)').catch(console.error);
  await sql.run('CREATE TABLE IF NOT EXISTS welcomeChannels (guildID TEXT, channelID TEXT)').catch(console.error);
  await sql.run('CREATE TABLE IF NOT EXISTS welcomeBG (guildID TEXT, link TEXT)').catch(console.error);
  await sql.run('CREATE TABLE IF NOT EXISTS autoRole (guildID TEXT, roleID TEXT)').catch(console.error);
  await sql.run('CREATE TABLE IF NOT EXISTS namePrefix (guildID TEXT, namePrefix TEXT)').catch(console.error);
  await sql.run('CREATE TABLE IF NOT EXISTS customTags (guildID TEXT, tag TEXT, text TEXT)').catch(console.error);
  let logChannels = {};
  let prefixes = {};
  let logs = {};
  let welcomeChannels = {};
  let welcomeBG = {};
  let autoRole = {};
  let namePrefix = {};
  let customTags = [];
  await Promise.all([
    sql.all('SELECT * FROM logChannels').then(rows => rows.forEach(row => logChannels[row.guildID] = row.channelID)),
    sql.all('SELECT * FROM prefixes').then(rows => rows.forEach(row => prefixes[row.guildID] = row.prefix)),
    sql.all('SELECT * FROM logs').then(rows => rows.forEach(row => logs[row.guildID] = row.logBlocks.split('|'))),
    sql.all('SELECT * FROM welcomeChannels').then(rows => rows.forEach(row => welcomeChannels[row.guildID] = row.channelID)),
    sql.all('SELECT * FROM welcomeBG').then(rows => rows.forEach(row => welcomeBG[row.guildID] = row.link)),
    sql.all('SELECT * FROM autoRole').then(rows => rows.forEach(row => autoRole[row.guildID] = row.roleID)),
    sql.all('SELECT * FROM namePrefix').then(rows => rows.forEach(row => namePrefix[row.guildID] = row.namePrefix)),
    sql.all('SELECT * FROM customTags').then(rows => rows.forEach(row => customTags.push({ tag: row.tag, text: row.text, guildID: row.guildID })))
  ]).catch(console.error);
  config = { logChannels, prefixes, logs, welcomeChannels, welcomeBG, autoRole, namePrefix, customTags };
};

const saveConfig = async data => {
  switch (data.type) {
    case 'logChannels':
      await sql.run(`DELETE FROM ${data.type} WHERE guildID = ?`, data.guildID);
      await sql.run(`INSERT INTO ${data.type} (guildID, channelID) VALUES (?, ?)`, [data.guildID, data.channelID]);
      break;
    case 'logs':
      await sql.run(`DELETE FROM ${data.type} WHERE guildID = ?`, data.guildID);
      await sql.run(`INSERT INTO ${data.type} (guildID, logBlocks) VALUES (?, ?)`, [data.guildID, data.logBlocks]);
      break;
    case 'prefixes':
      await sql.run(`DELETE FROM ${data.type} WHERE guildID = ?`, data.guildID);
      await sql.run(`INSERT INTO ${data.type} (guildID, prefix) VALUES (?, ?)`, [data.guildID, data.prefix]);
      break;
    case 'welcomeChannels':
      await sql.run(`DELETE FROM ${data.type} WHERE guildID = ?`, data.guildID);
      await sql.run(`INSERT INTO ${data.type} (guildID, channelID) VALUES (?, ?)`, [data.guildID, data.channelID]);
      break;
    case 'welcomeBG':
      await sql.run(`DELETE FROM ${data.type} WHERE guildID = ?`, data.guildID);
      await sql.run(`INSERT INTO ${data.type} (guildID, link) VALUES (?, ?)`, [data.guildID, data.link]);
      break;
    case 'autoRole':
      await sql.run(`DELETE FROM ${data.type} WHERE guildID = ?`, data.guildID);
      await sql.run(`INSERT INTO ${data.type} (guildID, roleID) VALUES (?, ?)`, [data.guildID, data.roleID]);
      break;
    case 'namePrefix':
      await sql.run(`DELETE FROM ${data.type} WHERE guildID = ?`, data.guildID);
      await sql.run(`INSERT INTO ${data.type} (guildID, namePrefix) VALUES (?, ?)`, [data.guildID, data.namePrefix]);
      break;
    case 'customTags':
      await sql.run(`DELETE FROM ${data.type} WHERE guildID = ? AND tag = ?`, [data.guildID, data.tag]);
      await sql.run(`INSERT INTO ${data.type} (guildID, tag, text) VALUES (?, ?, ?)`, [data.guildID, data.tag, data.text]);
      break;
  };
};

const trimConfig = async data => {
  switch (data.type) {
    case 'config':
      const logTypes = ['logChannels', 'logs', 'welcomeChannels', 'welcomeBG', 'autoRole', 'namePrefix', 'customTags'];
      for (const type in logTypes) {
        await sql.run(`DELETE FROM ${logTypes[type]} WHERE guildID = ?`, data.guildID).catch(console.error);
      };
      break;
    case 'tags':
      await sql.run(`DELETE FROM customTags WHERE guildID = ? AND tag = ?`, [data.guildID, data.tag]);
      break;
  }
  loadConfig();
};

const bullshit = () => {
  const first = random(arr1);
  const second = random(arr2);
  const third = random(arr3);
  const fourth = random(arr4);
  return `${first} ${second} ${third} ${fourth}.`;
};

const getImageBuffer = (img, format) => {
  return new Promise((resolve, reject) => {
    img.getBuffer(format, (err, buffer) => void (err ? reject(err) : resolve(buffer)));
  });
};

const updateStatusChannels = () => {
  client.channels.get('557517823254200341').setName(`${client.user.username} (${client.guilds.size}) szerveren`).catch(_ => { }); // guilds
  client.channels.get('557517772519636993').setName(`${client.user.username} (${client.users.size}) felhasználóval`).catch(_ => { }); // users

  const guild = client.guilds.get('461219465657450496');
  const botCount = guild.members.filter(member => member.user.bot).size;
  const memberCount = guild.members.filter(member => !member.user.bot).size;
  client.channels.get('467048743565525003').setName(`Dev. DC tagok száma: ${memberCount}`).catch(_ => { });
  client.channels.get('467048845461684224').setName(`Dev. DC botok száma: ${botCount}`).catch(_ => { });
};
// Egyéni bot kiegészítő funkciók
const getTopAEBPosts = async number => {
  const reactsArr = [];
  const finishDate = new Date();
  const startDate = new Date(Date.now() - (7 * 24 * 60 * 60 * 1000));
  const id = await bot_util.facebook.AddPage(cfg.defaults.fbpage, cfg.tokens.fb).catch(console.error);
  const posts = await bot_util.facebook.pages[id].get.posts.range(startDate, finishDate).catch(console.error);
  const filter = posts.filter(p => !p.message.includes('Heti top 5 epikus egyetemi jelenetek'));
  for (let i = 0; i < filter.length; i++) {
    const post = filter[i];
    const reacts = await bot_util.facebook.pages[id].get.reactions(post.id).catch(console.error);
    const reactType = {
      sad: reacts.filter(r => r.type === 'SAD'),
      haha: reacts.filter(r => r.type === 'HAHA'),
      love: reacts.filter(r => r.type === 'LOVE'),
      like: reacts.filter(r => r.type === 'LIKE'),
      wow: reacts.filter(r => r.type === 'WOW'),
      angry: reacts.filter(r => r.type === 'ANGRY')
    };
    reactsArr.push({
      postID: post.id,
      message: post.message,
      reactions: { Like: reactType.like.length, Love: reactType.love.length, Haha: reactType.haha.length, Wow: reactType.wow.length, Sad: reactType.sad.length, Angry: reactType.angry.length, All: reacts.length }
    });
  };
  const orderReacts = reactsArr.sort((r1, r2) => r2.reactions.All - r1.reactions.All);
  const top = orderReacts.splice(0, number);
  const replaceWith = {
    'Sad': '😢',
    'Haha': '😆',
    'Love': '❤️',
    'Like': '👍',
    'Wow': '😮',
    'Angry': '😠'
  };
  let index = 0;
  const text = top.map(elem => {
    index = index + 1;

    const r = `Összes reagálás száma: ${elem.reactions.All}\n${Object.entries(elem.reactions).filter(entry => entry[0] != 'All' && entry[1] > 0).map(entry => `${replaceWith[entry[0]]} ❯ ${entry[1]}`).join(' ')}`;
    return `${index}. helyezés\n${elem.message}\n\n${r}\nhttps://fb.com/${cfg.defaults.fbpage}/posts/${elem.postID.split('_')[1]}\n`;
  });
  return 'Heti top 5 epikus egyetemi jelenetek:\n\n' + text.join('\n');
};

const makeDescription = () => {

  const commandSize = {
    pub: Object.values(cHandler).filter(c => c.type !== 'dev').length + cfg.defaults.nsfwSites.length - 1,
    dev: Object.values(cHandler).filter(c => c.type === 'dev').length
  };

  const commandDesc = Object.values(cHandler).filter(c => c.type !== 'dev');
  const commandSizes = `Parancsok száma: ${commandSize.pub + commandSize.dev} (Publikus: ${commandSize.pub} Dev: ${commandSize.dev})`
  const guilds = `Szerverek száma: ${client.guilds.size} (Nagy: ${client.guilds.filter(g => g.large).size})`;
  const users = `Felhasználók száma: ${client.users.size} (Online: ${client.users.filter(u => u.presence.status !== 'offline').size} Offline: ${client.users.filter(u => u.presence.status === 'offline').size})`
  const date = `Utoljára frissítve: ${moment().format(`YYYY/MM/DD, HH:mm:ss`)}`
  const compose = `${commandSizes}
${guilds}
${users}
${date}`
  fs.writeFileSync('./description.txt', compose, { mode: 0o755 });
};
// Vége
client.on('raw', async event => {
  if (!events.hasOwnProperty(event.t)) return;

  const { d: data } = event;
  const user = client.users.get(data.user_id);
  const channel = client.channels.get(data.channel_id) || await user.createDM();

  if (channel.messages.has(data.message_id)) return;

  const message = await channel.fetchMessage(data.message_id);
  const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
  let reaction = message.reactions.get(emojiKey);

  if (!reaction) {
    const emoji = new Discord.Emoji(client.guilds.get(data.guild_id), data.emoji);
    reaction = new Discord.MessageReaction(message, emoji, 1, data.user_id === client.user.id);
  }

  client.emit(events[event.t], reaction, user);
});

client.on('messageReactionAdd', async (r, user) => {
  if (r.message.author.bot || !r.message.content || antiSpam.has(r.message.id)) return;
  if (r.emoji.toString() === '🐕' || r.emoji.toString() === '🐶') {
    antiSpam.add(r.message.id);
    r.message.channel.send(dogeify(r.message.content)).then(m => setTimeout(_ => m.delete().catch(_ => { }), 30 * 1000)).catch(_ => { });
  };
});

client.on("message", m => {
  if (m.author.bot) return;
  if (m.channel.type !== 'text') return;

  if (Object.keys(afk).includes(m.author.id)) delete afk[m.author.id];
  if (m.mentions.users) {
    m.mentions.users.forEach(mention => {
      if (mention && Object.keys(afk).includes(mention.id)) {
        const embed = embedBuilder('Away from keyboard');
        embed.setAuthor(mention.tag, mention.displayAvatarURL);
        embed.setDescription(afk[mention.id]);
        m.reply('a megjelölt személy jelenleg nincs gépnél!', embed).catch(_ => { });
      };

    });
  }

  const prefix = !Object.keys(config['prefixes']).includes(m.guild.id) ? cfg.defaults.prefix : config['prefixes'][m.guild.id];

  if (m.mentions.users.has(client.user.id)) m.channel.send(`Jelenlegi prefix: \`${prefix}\`\nTovábbi infó: \`${prefix}help\``).catch(_ => { });

  if (!m.content.startsWith(prefix)) return;

  m.prefix = prefix;

  const args = m.content.split(" ").slice(1);
  const object = m.content.toLowerCase().slice(prefix.length).split(' ')[0];

  if (cfg.defaults.nsfwSites.includes(object)) {
    if (!m.channel.nsfw) return m.reply('ez a parancs csak `NSFW` csatornán használható!').catch(() => { });
    return cHandler.nsfw.cmd(m, args, object);
  };

  if (config['customTags'].some(e => e.guildID === m.guild.id && e.tag === object)) {
    const tag = config['customTags'].find(e => e.guildID === m.guild.id && e.tag === object);
    m.channel.send(tag.text).catch(_ => { });
  };

  if (!cHandler.hasOwnProperty(object)) return;

  /*
  if (!cHandler[object].memberNeededPerms === 0 || !m.channel.permissionsFor(m.member).has(cHandler[object].memberNeededPerms) || !m.member.hasPermission(cHandler[object].memberNeededPerms)) return m.reply('nincs jogod ehhez a parancshoz!').catch(() => { });
  if (!cHandler[object].meNeededPerms === 0 || !m.channel.permissionsFor(m.guild.me).has(cHandler[object].meNeededPerms) || !m.guild.me.hasPermission(cHandler[object].meNeededPerms)) return m.reply('nincs jogom végrehajtani ezt a parancsot!').catch(() => { });
  */


  if (cHandler[object].memberNeededPerms) {
    if (m.channel.permissionsFor(m.member).has(cHandler[object].memberNeededPerms) || m.member.hasPermission(cHandler[object].memberNeededPerms)) { }
    else return m.reply('nincs jogod ehhez a parancshoz!').catch(() => { });
  }

  if (cHandler[object].meNeededPerms) {
    if (m.channel.permissionsFor(m.guild.me).has(cHandler[object].meNeededPerms) || m.guild.me.hasPermission(cHandler[object].meNeededPerms)) { }
    else return m.reply('nincs jogom végrehajtani ezt a parancsot!').catch(() => { });
  }


  if (cHandler[object].type === 'dev' && m.author.id !== cfg.defaults.ownerID) return m.reply('te nem használhatsz fejlesztői parancsot!').catch(() => { });

  const cmd = args[0] ? args[0].replace(prefix, '') : null;

  const normal = cHandler.hasOwnProperty(cmd);
  const nsfw = cfg.defaults.nsfwSites.includes(cmd);

  if (object === 'help' && cmd && normal || nsfw) {
    const memberPerms = normal ? cHandler[cmd].memberNeededPerms : cHandler.nsfw.memberNeededPerms;
    const mePerms = normal ? cHandler[cmd].meNeededPerms : cHandler.nsfw.meNeededPerms;
    const embed = embedBuilder(`${m.prefix}help ${cmd}`);
    embed.addField('❯ Leírás', normal ? cHandler[cmd].info : cHandler.nsfw.info(cmd));
    embed.addField('❯ Parancs példa', `\`${normal ? cHandler[cmd].ex(m) : cHandler.nsfw.ex(m, cmd)}\``);
    embed.addField('❯ Szükséges engedélyek [Meghívó]', memberPerms.length !== 0 ? memberPerms.map(p => `\`${p}\` - \`${permissions[p]}\``).join('\n') : 'Nincs szükséges engedély.');
    embed.addField('❯ Szükséges engedélyek [BOT]', mePerms.length !== 0 ? mePerms.map(p => `\`${p}\` - \`${permissions[p]}\``).join('\n') : 'Nincs szükséges engedély.');
    m.channel.send(embed).catch(() => { });

  } else {
    cHandler[object].cmd(m, args);
  };

});

client.on('presenceUpdate', (__, member) => {
  if (member.user.id === '419447790675165195') member.presence.game ? setP(member.presence.game.name, member.presence.status) : randomPresence();
});

client.on('messageUpdate', async (oldM, newM) => {
  if (oldM.channel.type !== 'text' || oldM.author.bot || !oldM.content || oldM.content == newM.content) return;

  if (!Object.keys(config['logs']).includes(oldM.guild.id)) return;
  if (!Object.keys(config['logChannels']).includes(oldM.guild.id)) return;
  if (!config['logs'][oldM.guild.id].includes('update')) return;

  const logChannelID = config['logChannels'][oldM.guild.id];

  const embed = new Discord.RichEmbed();
  embed.setColor(cfg.defaults.DEC);
  embed.setTimestamp();
  embed.setAuthor(`${oldM.author.tag} (${oldM.author.id})`, oldM.author.displayAvatarURL);

  embed.setDescription(oldM.content);
  embed.setFooter(`Üzenet változás [Régi üzenet] (Csatorna: ${oldM.channel.name})`);
  await oldM.guild.channels.get(logChannelID).send(embed).catch(_ => { });

  embed.setDescription(newM.content);
  embed.setFooter(`Üzenet változás [Új üzenet] (Csatorna: ${newM.channel.name})`);
  await newM.guild.channels.get(logChannelID).send(embed).catch(_ => { });
});

client.on('messageDelete', message => {
  if (message.channel.type !== 'text' || message.author.bot || !message.content) return;

  if (!Object.keys(config['logs']).includes(message.guild.id)) return;
  if (!Object.keys(config['logChannels']).includes(message.guild.id)) return;
  if (!config['logs'][message.guild.id].includes('delete')) return;

  const logChannelID = config['logChannels'][message.guild.id];

  const embed = new Discord.RichEmbed();
  embed.setColor(cfg.defaults.DEC);
  embed.setTimestamp();
  embed.setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL);
  embed.setDescription(message.content);
  embed.setFooter(`Törölt üzenet (Csatorna: ${message.channel.name})`);

  message.guild.channels.get(logChannelID).send(embed).catch(_ => { });
});

client.on('guildMemberAdd', async member => {


  /*
  if (!Object.keys(config['logs']).includes(member.guild.id)) return;
  if (!Object.keys(config['logChannels']).includes(member.guild.id)) return;
  if (!config['logs'][member.guild.id].includes('join')) return;
  */

  if (Object.keys(config['welcomeChannels']).includes(member.guild.id)) {
    const welcomeChannelID = config['welcomeChannels'][member.guild.id];

    const bgURL = Object.keys(config['welcomeBG']).includes(member.guild.id) ? config['welcomeBG'][member.guild.id] : cfg.images.defaultBG

    const bg = await Jimp.read(bgURL);
    const avatar = await Jimp.read(member.user.displayAvatarURL);
    avatar.resize(100, 100);
    bg.composite(avatar, 50, 10, [Jimp.BLEND_MULTIPLY, 0.5, 0.9]);
    const buffer = await getImageBuffer(bg, 'image/png');
    member.guild.channels.get(welcomeChannelID).send(`**${member.user.tag}** Csatlakozott!`, { files: [{ attachment: buffer, name: `csatlakozas.png` }] }).catch(_ => { });

  };

  if (Object.keys(config['autoRole']).includes(member.guild.id)) {
    const roleID = config['autoRole'][member.guild.id];
    member.addRole(roleID).catch(_ => { });
  };

  if (Object.keys(config['namePrefix']).includes(member.guild.id)) {
    const p = config['namePrefix'][member.guild.id];
    member.setNickname(`${p} ${member.user.username}`).catch(_ => { });
  };

  if (Object.keys(config['logs']).includes(member.guild.id) && Object.keys(config['logChannels']).includes(member.guild.id) && config['logs'][member.guild.id].includes('join')) {
    const logChannelID = config['logChannels'][member.guild.id];

    const embed = new Discord.RichEmbed();
    embed.setAuthor(`${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL);
    embed.setColor(cfg.defaults.DEC);
    embed.setDescription(`**Regisztráció:** \`${moment(member.user.createdAt).format(`YYYY/MM/DD, HH:mm:ss`)}\``);
    embed.setFooter('Felhasználó csatlakozott');
    embed.setTimestamp();

    member.guild.channels.get(logChannelID).send(embed).catch(_ => { });
  };
});

client.on('guildMemberRemove', member => {

  if (!Object.keys(config['logs']).includes(member.guild.id)) return;
  if (!Object.keys(config['logChannels']).includes(member.guild.id)) return;
  if (!config['logs'][member.guild.id].includes('leave')) return;

  const logChannelID = config['logChannels'][member.guild.id];

  const embed = new Discord.RichEmbed();
  embed.setAuthor(`${member.user.tag} (${member.user.id})`, member.user.displayAvatarURL);
  embed.setColor(cfg.defaults.DEC);
  embed.setFooter('Felhasználó lecsatlakozott');
  embed.setTimestamp();

  member.guild.channels.get(logChannelID).send(embed).catch(_ => { });
});

client.on('guildCreate', async guild => {
  updateStatusChannels();
  const randChannel = guild.channels.filter(c => c.type === 'text' && c.permissionsFor(client.user).has('SEND_MESSAGES')).first();
  const greetEmbed = embedBuilder('Üdvözlet');
  greetEmbed.setDescription(`Köszönjük, hogy a(z) ${client.user.username} botot választottad!
További információkért látogass el a weboldalunkra (${cfg.defaults.website}), vagy nézz fel a [support](${cfg.defaults.support}) szerverünkre!`);
  const send = randChannel ? await randChannel.send(`**(@here)** ${cfg.defaults.support}`, { embed: greetEmbed }).catch(_ => { }) : false;

  const feedbackEmbed = embedBuilder('Feedback');
  feedbackEmbed.setDescription(`Üdvözlő üzenet elküldve: ${send ? 'Igen' : 'Nem'}
Tulajdonos: ${guild.owner ? guild.owner.user.tag : 'Nem lehet lekérni!'}
Felhasználók száma: ${guild.members.size}
Szobák száma: ${guild.channels.size}
Role-ok száma: ${guild.roles.size}
Emote-ok száma: ${guild.emojis.size}
Létrehozva: ${moment(guild.createdAt).format(`YYYY/MM/DD, HH:mm:ss`)}
Régio: ${regions[guild.region]}`)
  reportChannel().send(`**[Csatlakozás]** ${guild.name} (${guild.id})`, { embed: feedbackEmbed }).catch(_ => { });
});

client.on('guildDelete', guild => {
  updateStatusChannels();
  reportChannel().send(`**[Lecsatlakozás]** ${guild.name} (${guild.id})`).catch(_ => { });
});

client.on('error', console.error);

sql.open(cfg.defaults.sqlitePath).then(async _ => {
  console.log('[c:gartn] SQL opened!');
  await loadConfig();
  console.log('[c:gartn] DB loaded!');
  await client.login(cfg.tokens.bot).catch(console.error);
  if (!client) return console.log('Log-In Error!');
  console.log(`${client.user.tag}: Logged in!`);
  const dbl = new DBL(cfg.tokens.dbl, client);
  dbl.postStats(client.guilds.size);
  randomPresence();
  updateStatusChannels();
  makeDescription();
  imgur.setAPIUrl('https://api.imgur.com/3/');
}).catch(console.error);
