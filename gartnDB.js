const cfg = {
  tokens: {
    bot: process.env.gartn, // Discord Bot
    giphy: process.env.giphy, // Giphy
    brawlhalla: process.env.brawlhalla, // Brawlhalla
    osu: process.env.osu, // Osu
    fortnite: process.env.fortnite, // Fortnite
    pastebin: process.env.pastebin, // Pastebin
    fb: process.env.fb, // Facebook
    poetUser: process.env.poetUser, // Poet.HU
    poetPass: process.env.poetPass, // Poet.HU
    brawlstars: process.env.brawlstars, // BrawlStars
    twitch: process.env.twitch, // Twitch
    dbl: process.env.dbl // Discord Bot List
  },
  images: {
    osu: 'https://imgur.com/gE7gy2b.png', // Osu logo.
    slap: 'https://i.imgur.com/v7oZ4qW.png', // Pofon képe. (g.slap)
    hug: 'https://i.imgur.com/Zd9j27z.png', // Ölelés képe. (g.hug)
    iras: 'https://imgur.com/eOXj21z.png', //Írás képe. (g.flipcoin)
    fej: 'https://imgur.com/pkbRA9T.png', // Fej képe. (g.flipcoin)
    flip: 'https://imgur.com/q5wjwVU.png', // Fej/Írás játék képe. (g.flipcoin)
    defaultBG: 'https://i.imgur.com/5q6FMq0.png', // Alap üdvözlő üzenet háttér.
    aeblogo: 'https://i.imgur.com/2JqtweM.png' // Facebook kiegészítés.

  },
  defaults: {
    sqlitePath: './gartn.sqlite', // Adatbázis útvonala.
    ownerID: '419447790675165195', // Tulajdonos ID / Egyéni parancsokhoz és jelzéshez.
    reportChannelID: '557291894011592704', // Dev szerverre való figyelmeztető csatorna. (guildCreate, guildDelete)
    featuresChannelID: '557519573822210078', // Features parancs lekéréséhez kell.
    devServerID: '461219465657450496', // Egyéni ellenőrzéshez kell.
    radioClientID: '430326522146979861', // Egyéni ellenőrzéshez kell.
    DEC: 0x36393f, // Alapértelmezett embed szín.
    prefix: 'g.', // Alapértelmezett prefix.
    fbpage: 'atlagegyetemistabot99', // Egyéni Facebook kiegészítéshez kellett.
    support: 'https://discord.gg/C83h4Sk', // Discord Support szerver meghívó linkje.
    website: '[github-repo](https://https://github.com/mragarton/grafit-gartn/)', // Weboldal
    nsfwSites: ['booru', 'danbooru', 'konachan', 'yandere', 'gelbooru', 'rule34', 'safebooru', 'tbib', 'xbooru', 'youhateus', 'lolibooru'], // Kaori által megadott nsfw oldalak.
    tick: '☑', // Reagáláshoz használt emoji. (Csak unicode)
    cross: '❎' // Reagáláshoz használt emoji. (Csak unicode)
  }
};

// Uncached emoji olvasáshoz eventek. (client.raw)
const events = {
  MESSAGE_REACTION_ADD: 'messageReactionAdd',
  MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
};

// Jogok honosítva.
const permissions = {
  'ADMINISTRATOR': 'Adminisztrátor',
  'CREATE_INSTANT_INVITE': 'Meghívó link létrehozása',
  'KICK_MEMBERS': 'Felhasználó kirúgása',
  'BAN_MEMBERS': 'Felhasználó kitiltása',
  'MANAGE_CHANNELS': 'Csatornák módosítása',
  'MANAGE_GUILD': 'Szerver módosítása',
  'ADD_REACTIONS': 'Új reakció osztása',
  'VIEW_AUDIT_LOG': 'Szerver Audit Log olvasása',
  'PRIORITY_SPEAKER': 'Elsőbbségi beszéd',
  'VIEW_CHANNEL': 'Csatorna megtekintése',
  'READ_MESSAGES': 'Csatorna üzeneteinek olvasása',
  'SEND_MESSAGES': 'Csatornára való üzenetküldés',
  'SEND_TTS_MESSAGES': 'Csatornára való TTS üzenetküldés',
  'MANAGE_MESSAGES': 'Csatornán lévő üzenetek felügyelete/törlése',
  'EMBED_LINKS': 'Link beágyazása',
  'ATTACH_FILES': 'Fájlok megosztása',
  'READ_MESSAGE_HISTORY': 'Csatorna régi üzenetinek olvasása',
  'MENTION_EVERYONE': 'Mindenkit tagelhet (@everyone)',
  'USE_EXTERNAL_EMOJIS': 'Globális emoji-k használata',
  'CONNECT': 'Csatlakozás',
  'SPEAK': 'Beszéd',
  'MUTE_MEMBERS': 'Mások némítása (Mikrofon)',
  'DEAFEN_MEMBERS': 'Mások némítása (Hangszóró)',
  'MOVE_MEMBERS': 'Felhasználó áthúzása másik hang csatornára',
  'USE_VAD': 'Használjon hang alapján aktiválandó mikrofon bemenetet',
  'CHANGE_NICKNAME': 'Saját becenév változtatása',
  'MANAGE_NICKNAMES': 'Mások becenevének változtatása',
  'MANAGE_ROLES': 'Role-ok módosítása',
  'MANAGE_WEBHOOKS': 'Webhook-hoz való hozzáférés',
  'MANAGE_EMOJIS': 'Emoji-k módosítása'
};

// Régiók honosítva.
const regions = {
  'eu-central': 'Közép-Európa',
  'brazil': 'Brazil',
  'hongkong': 'Hong Kong',
  'japan': 'Japán',
  'russia': 'Oroszország',
  'singapore': 'Szingapúr',
  'southafrica': 'Dél-Afrika',
  'sydney': 'Sydney',
  'us-central': 'Közép-Amerika',
  'us-east': 'Kelet-Amerika',
  'us-south': 'Dél-Amerika',
  'us-west': 'Nyugat-Amerika',
  'eu-west': 'Nyugat-Európa'
};

//Escobar Modul
const e_music = [
  'https://www.youtube.com/watch?v=GSfllNo2ZYs',
  'https://www.youtube.com/watch?v=HNTzvhoWieE',
  'https://www.youtube.com/watch?v=gfyLgiWt2Ms',
  'https://www.youtube.com/watch?v=gIpXClAI9XM',
  'https://www.youtube.com/watch?v=WjCCW8TPIII',
  'https://www.youtube.com/watch?v=xBevEZokjVs',
  'https://www.youtube.com/watch?v=70Bq0w-kYNA',
  'https://www.youtube.com/watch?v=kyXNV-IzZW0',
  'https://www.youtube.com/watch?v=Uk7290Pisac',
  'https://www.youtube.com/watch?v=E0Byp8dSxLY',
  'https://www.youtube.com/watch?v=1T9mMKVlR0E',
  'https://www.youtube.com/watch?v=vW_OXl7HFRo',
  'https://www.youtube.com/watch?v=z5P_x_JXvqs',
  'https://www.youtube.com/watch?v=ReK7dC5Vo70',
  'https://www.youtube.com/watch?v=ZmPgxTqQ3fY',
  'https://www.youtube.com/watch?v=2F7s1eqOBzg',
  'https://www.youtube.com/watch?v=oNNJgpKq9i0',
  'https://www.youtube.com/watch?v=1aOcWm39ivQ',
  'https://www.youtube.com/watch?v=BZug5qcMk6U',
  'https://www.youtube.com/watch?v=llCw3VNhtoE',
  'https://www.youtube.com/watch?v=ZQJZhuc73Rs',
  'https://www.youtube.com/watch?v=YL01qLAdJyg',
  'https://www.youtube.com/watch?v=K0jlPQ25Gkk',
  'https://www.youtube.com/watch?v=TrGPtX9lxa4',
  'https://www.youtube.com/watch?v=NEKzoXQbYjw',
  'https://www.youtube.com/watch?v=KujzcEiJkLs',
  'https://www.youtube.com/watch?v=qEHcaPAyGfQ',
  'https://www.youtube.com/watch?v=Jk2mOnodZxc',
  'https://www.youtube.com/watch?v=xCwA8CVfMZM',
  'https://www.youtube.com/watch?v=hoGIGOtSD5Y',
  'https://www.youtube.com/watch?v=vXechfohH6w',
  'https://www.youtube.com/watch?v=ksMsDp0O16E',
  'https://www.youtube.com/watch?v=xrjSmoCRklI',
  'https://www.youtube.com/watch?v=Gwhyie63lnY', ,
  'https://www.youtube.com/watch?v=JvVDiJ4WzPw',
  'https://www.youtube.com/watch?v=XkhJhfevW_g',
  'https://www.youtube.com/watch?v=nL20FKGT65o'];

const e_photos = ['https://i.imgur.com/VkVuM6I.jpg',
  'https://i.imgur.com/xgJLtRE.jpg',
  'https://i.imgur.com/fpw41i3.jpg',
  'https://i.imgur.com/Ddi4kIq.jpg',
  'https://i.imgur.com/TgKOxzE.jpg',
  'https://i.imgur.com/D81Le7Y.jpg',
  'https://i.imgur.com/Pwznjnz.jpg',
  'https://i.imgur.com/Gl6Us5C.jpg',
  'https://i.imgur.com/R2dnJdg.jpg',
  'https://i.imgur.com/G2oYCEd.jpg',
  'https://i.imgur.com/wnHrnnl.jpg',
  'https://i.imgur.com/YplYLJt.jpg',
  'https://i.imgur.com/E3QDMsU.jpg',
  'https://i.imgur.com/zZaRaq8.jpg',
  'https://i.imgur.com/N9XC7Ii.jpg',
  'https://i.imgur.com/D5NyWJP.jpg',
  'https://i.imgur.com/uli48D4.jpg',
  'https://i.imgur.com/yWDRKOB.jpg',
  'https://i.imgur.com/2wKUNkx.jpg',
  'https://i.imgur.com/JnbK1Gq.jpg',
  'https://i.imgur.com/fApm78B.jpg',
  'https://i.imgur.com/8OJCqYd.jpg',
  'https://i.imgur.com/WRNBMJ4.jpg',
  'https://i.imgur.com/Z7AC5eL.jpg',
  'https://i.imgur.com/RhqLugj.jpg',
  'https://i.imgur.com/drESi3h.jpg',
  'https://i.imgur.com/toHqTY2.jpg',
  'https://i.imgur.com/LkURPXm.jpg',
  'https://i.imgur.com/MgGgQE1.jpg',
  'https://i.imgur.com/hInaYKk.jpg',
  'https://i.imgur.com/08s00qx.jpg',
  'https://i.imgur.com/TkcmVBQ.jpg',
  'https://i.imgur.com/5G6ZS6l.jpg',
  'https://i.imgur.com/trGdIpZ.jpg',
  'https://i.imgur.com/bTILFSZ.jpg',
  'https://i.imgur.com/4CW9haO.jpg',
  'https://i.imgur.com/Hu1y2xZ.jpg',
  'https://i.imgur.com/wbatxZI.jpg',
  'https://i.imgur.com/4KHrNlk.jpg',
  'https://i.imgur.com/UvVlOAn.jpg',
  'https://i.imgur.com/BXz2l82.jpg',
  'https://i.imgur.com/SOozRZm.jpg',
  'https://i.imgur.com/zOyvWIg.jpg',
  'https://i.imgur.com/jjhvyUf.jpg',
  'https://i.imgur.com/nliwOoE.jpg',
  'https://i.imgur.com/Ezpvea5.jpg',
  'https://i.imgur.com/Gm5euia.jpg',
  'https://i.imgur.com/POal6bN.jpg',
  'https://i.imgur.com/qG26RbD.jpg',
  'https://i.imgur.com/YLT4a3O.jpg',
  'https://i.imgur.com/nUOmywo.jpg',
  'https://i.imgur.com/GvC3lIY.jpg',
  'https://i.imgur.com/qHUY60P.jpg',
  'https://i.imgur.com/YcOHZKN.jpg',
  'https://i.imgur.com/Ude8BSq.jpg',
  'https://i.imgur.com/tVDt7bt.jpg',
  'https://i.imgur.com/eI5zIYz.jpg',
  'https://i.imgur.com/8tcPGUV.jpg',
  'https://i.imgur.com/iPvPItm.jpg',
  'https://i.imgur.com/EEJTEJ4.jpg',
  'https://i.imgur.com/6PEC4AM.jpg',
  'https://i.imgur.com/MBChZfr.jpg',
  'https://i.imgur.com/TGFRTcz.jpg',
  'https://i.imgur.com/zevIiD9.jpg',
  'https://i.imgur.com/T3lTQ7W.jpg',
  'https://i.imgur.com/BPoA0fs.jpg',
  'https://i.imgur.com/kGsXjmy.jpg',
  'https://i.imgur.com/DDaVrUD.jpg',
  'https://i.imgur.com/cMSrxC0.jpg',
  'https://i.imgur.com/Mpqq8YD.jpg',
  'https://i.imgur.com/5vMdiYI.jpg',
  'https://i.imgur.com/AMz0WTs.jpg',
  'https://i.imgur.com/qW2rMzA.jpg',
  'https://i.imgur.com/CKvfi0d.jpg',
  'https://i.imgur.com/NFJeN1i.jpg',
  'https://i.imgur.com/E3G2rIk.jpg',
  'https://i.imgur.com/bMn37YH.jpg',
  'https://i.imgur.com/ZUW4BaK.jpg',
  'https://i.imgur.com/Mu921jM.jpg',
  'https://i.imgur.com/qFGH816.jpg',
  'https://i.imgur.com/CMyaLHm.jpg',
  'https://i.imgur.com/jBhb6ar.jpg',
  'https://i.imgur.com/NJN2eqV.jpg',
  'https://i.imgur.com/n8AHEu5.jpg',
  'https://i.imgur.com/QuwNUzC.jpg',
  'https://i.imgur.com/9rsbMAt.jpg',
  'https://i.imgur.com/gAX84fz.jpg',
  'https://i.imgur.com/Xu35TXh.jpg',
  'https://i.imgur.com/1iiINCu.jpg',
  'https://i.imgur.com/KNGMEoC.jpg',
  'https://i.imgur.com/DDn5Fyc.jpg',
  'https://i.imgur.com/EKgJ1sE.jpg',
  'https://i.imgur.com/9msB0vk.jpg',
  'https://i.imgur.com/RCxnBaA.jpg',
  'https://i.imgur.com/hOLs0VW.jpg',
  'https://i.imgur.com/0otdC1g.jpg',
  'https://i.imgur.com/VSnIs3B.jpg',
  'https://i.imgur.com/CE5y5un.jpg',
  'https://i.imgur.com/naZyowI.jpg',
  'https://i.imgur.com/6E73V1c.jpg',
  'https://i.imgur.com/Kal1bCN.jpg',
  'https://i.imgur.com/OE0SXHv.jpg',
  'https://i.imgur.com/98suLr8.jpg',
  'https://i.imgur.com/oaXGopZ.jpg',
  'https://i.imgur.com/799URKO.jpg',
  'https://i.imgur.com/qLYu3WU.jpg',
  'https://i.imgur.com/fFg5IqF.jpg'];

const e_shit = [
  'Én baszom a pénzt, nem a pénz basz engem!',
  'Felemészt a tény, hogy szabadon van Escobar!',
  'Ha nem lesz elég ennyi, akkor teszünk rá még!',
  'Escobar a név, számo-számolom a pénzt.',
  'Hiteles gengszter a faszomat vedd be!',
  'Nálam van a GT meg a 750 Long is!',
  'Figyelj oda, hogy nehogy megbasszalak.',
  'Korrupt a politikus, korrupt a rendőr!',
  'Nekem a titulusom, gengszter!',
  'Az a pech, hogy szétkaptak. A kékek, mert mondtad nekik, SZÉTBASZLAK!',
  'Tűzben edzett? Voltam tűzben veled. Nem retetetted fel a kezed!',
  'Büdös csicskák, köcsög TV-k. Mi lesz, kint is vagyok?!',
  'Nem a Jihad, hanem ez itt a pech! DE most lépek, mert a kertembe ugrik a tek!',
  'Por favor mata a todos Esco! ((Fiatal V.))',
  'Leszünk mi még úgy, hogy egy sikátorban ketten!',
  'Nem volt olyan szar, amiből fel soha sem álltam!',
  'Inkább húzd el a csíkot, nehogy felbosszants!',
  'A nevem Esco, sokan rombolnák a váram!',
  'Nézz meg minket, nem egy jól fésült banda. Gotti és a Wanted, egyikünk sem csicska!',
  'Te mit látsz? Csak a pénzt meg az aranyat...',
  'Újra itt a papír fölött, mégis borúsan látom a jövőt.',
  'Megvan minden, pénz hatalom, de a fejem mégis ugyan azért vakarom.',
  'Legyél őszinte, de ne add ki magadat, szánd meg a szegényt ha meglátod a pad alatt.',
  'A faszom a szádba te wamzer geci!',
  'Szia buzika! Emlékszel még rám?',
  'Én védtem meg a segged, mikor remegett a szád...',
  'Mint a kocsonya... Nem segített a Frontin. Csak az Esco, te ferdefogú droid!',
  'Látom zuhansz... Ha kell adok munkát!',
  'Lassan elfogynak kik majd ütnek helyetted.',
  'Azt mondják, a saját gecid megeszed.',
  'Én mindenből a legjobbat nyújtom, ismernek már a kúton!',
  'Beteg elmékkel megtalálom a hangot. Ezek kiveszik a kést és levágják a rangod!',
  'Én mindig telerakom, ismernek már a kúton!',
  'Mikor jön már végre egy olyan lány, aki végre nem a zsetonért néz úgy rám?',
  'Nem megy az a szerep, ami nektek megy...',
  'Csak annyi az előnyöm, hogy igaz minden szó!',
  'Soha ne érdekeljen téged a másé, ne maradjon meg a főszerep a rácsé!',
  'Figyelj spanom, többet egyedül nem leszel!',
  'Mosoly lesz az arcomon, amikor áslak majd el.'];
// Vége

// Bullshit generátor adatbázis
const arr1 = ["Erõforrás-alapú megközelítéssel kell",
  "Egy absztrakciós létra mentén kell",
  "Alapvetõ fontosságú",
  "Kiemelt projektünk",
  "A menedzsment célja",
  "Teljes összhangban kell",
  "Belsõ kommunikáció révén kell",
  "Csapatmunkában szükséges",
  "Még ma szükséges",
  "Nem tûr halasztást",
  "Fontos lenne",
  "Szükséges lenne",
  "Szükséges",
  "Vállalatunk célja",
  "Kiemelt fontosságú feladat",
  "Ennek szellemében kell",
  "Formállogikai alapon kellene",
  "Alkotó folyamat keretében kell",
  "Felelõsséggel kell",
  "A következõt kell tennünk:",
  "Egyetlen megoldásunk van:",
  "Az egyetlen kiút:",
  "Tanácsadóink szerint célunk:",
  "A menedzsment szeretné",
  "Az üzletág szeretné",
  "Most kell",
  "Nincs más hátra, mint",
  "Ne felejtsük el",
  "Ne szalasszuk el",
  "Szeretném",
  "Célom",
  "Az eddigiek szerint kell",
  "A lényeg:",
  "Feladatunk:",
  "Küldetésünk:",
  "A mai legfontosabb prioritás:",
  "Megpróbáljuk",
  "Megpróbálom",
  "Megkíséreljük",
  "Megkísérlem",
  "Próbáljátok meg",
  "Meg kell próbálnunk",
  "Küldetésem",
  "Új koncepció szerint kell",
  "Azonnal szükséges",
  "Egy megoldás van:",
  "Kreatív módon kell",
  "Sürgõsen szükséges",
  "Személyes célom",
  "Nincs más dolgunk, mint",
  "Nincs más feladatom, mint",
  "Legfontosabb feladatom",
  "Legfontosabb küldetésem",
  "Elsõdleges fontosságú lenne",
  "Elengedhetetlen lenne",
  "Létfontosságú dolog",
  "Elengedhetetlenül fontos lenne",
  "Itt az idõ",
  "Nem halaszthatjuk el",
  "Kreatív módon kell",
  "Elemzések segítségével kell",
  "Kreatív módon kéne",
  "Látványosan kell",
  "Minél feltûnõbben kell",
  "Professzionális módon kell",
  "Megfelelõ idõzítéssel kell"];

const arr2 = ["implementálni",
  "átültetni",
  "aggregálni",
  "aktívan menedzselni",
  "aktiválni",
  "allokálni",
  "analizálni",
  "áramvonalasítani",
  "arányosítani",
  "áthangszerelni",
  "átváltoztatni",
  "átvariálni",
  "átvezetni",
  "bátorítani",
  "betanítani",
  "befolyásolni",
  "benchmarkolni",
  "bevetni",
  "birtokba venni",
  "bõvíteni",
  "szûkíteni",
  "ellenõrizni",
  "elõmozdítani",
  "életre kelteni",
  "facilitálni",
  "fejleszteni",
  "felnevelni",
  "felruházni",
  "felszabadítani",
  "forradalmasítani",
  "generálni",
  "hasznosítani",
  "hatékonyabbá tenni",
  "innovatívan fejleszteni",
  "integrálni",
  "iterálni",
  "kihangsúlyozni",
  "kiválasztani",
  "leválogatni",
  "leválasztani",
  "kihasználni",
  "kiterjeszteni",
  "kultiválni",
  "lefoglalni",
  "lehetõvé tenni",
  "márkázni",
  "maximalizálni",
  "meghatározni",
  "megragadni",
  "megváltoztatni",
  "menedzselni",
  "monetizálni",
  "motiválni",
  "növelni",
  "nyilvánvalóvá tenni",
  "optimalizálni",
  "ösztönözni",
  "kiépíteni",
  "rávilágítani",
  "racionálisan végiggondolni",
  "racionalizálni",
  "ritkítani",
  "sûríteni",
  "strategizálni",
  "struktúrálni",
  "szakmailag felügyelni",
  "szétszabdalni",
  "szimulálni",
  "szindikálni",
  "szinergizálni",
  "szinkronba hozni",
  "sztenderdizálni",
  "szintetizálni",
  "támogatni",
  "targetálni",
  "termékesíteni",
  "testreszabni",
  "toborozni",
  "tipizálni",
  "tiszta lappal kezdeni",
  "transzformálni",
  "túlteljesíteni",
  "új kontextusba helyezni",
  "újra feltalálni",
  "újra meghatározni",
  "újradefiniálni",
  "újrapozícionálni",
  "újratermelni",
  "vizionálni",
  "vizualizálni"];

const arr3 = ["a közösségi normáknak megfelelõ",
  "a decentralizált",
  "a dinamikusan növekvõ",
  "a dinamikusan növekvõ",
  "a divergens",
  "a fontos",
  "a felvállalható",
  "a forradalmian új",
  "a funkció-specifikus",
  "a globális preferenciák szerinti",
  "a hatásos",
  "a hatékony",
  "a hibátlan",
  "a holisztikus",
  "a kihívást jelentõ",
  "a konvergens",
  "a konzisztens",
  "a korrigálható",
  "a korreláló",
  "a költséghatékony",
  "a közszolgáltatási",
  "a kultúraidegen",
  "a kritikus",
  "a kvázi-projekt-szerû",
  "a marketing-szemléletû",
  "a megfelelõen elõkészített",
  "a meghatározandó",
  "a megtérülõ",
  "a metakommunkiációs",
  "a one-stop-shop-szerû",
  "az összehangolt",
  "a piacvezetõ",
  "a proaktív",
  "a prudens",
  "a reakcióképes",
  "a robosztus",
  "a racionális",
  "a rendszeres",
  "a rugalmas",
  "a sajátos",
  "a stagnáló",
  "a stratégiai céloknak megfelelõ",
  "a stratégiáknak megfelelõ",
  "a súrlódásmentes",
  "a szárnyaló",
  "a széles körben használt",
  "a személyre szabott",
  "a szinergizált",
  "a tudatos",
  "a vállalati szintû",
  "a vállalati szintû",
  "a vállalatspecifikus",
  "a vállalható",
  "a valós idejû",
  "a vertikális",
  "a világszínvonalú",
  "a virtuális",
  "a vizionált",
  "a vonzáskörzeten belüli",
  "a XXI. századi színvonalú",
  "az autonóm",
  "a heteronóm",
  "az apatikus",
  "a közömbös",
  "a személyközi",
  "a szûkös",
  "a rutinos",
  "az atipikus",
  "az átlátható",
  "az attraktív",
  "az egységsugarú",
  "az együttmûködõ",
  "az elosztott",
  "az elõvárosi",
  "az elõnyös",
  "az értéklánc menti",
  "az értéknövelt",
  "az európai színvonalú",
  "az európai uniós",
  "az extenzív",
  "az idõzített",
  "az igazgató úr által is említett",
  "az innovatív",
  "az integrált",
  "az interaktív",
  "az intuitív",
  "az irányvonalnak megfelelõ",
  "az ügyfélbarát",
  "az ügyfélközpontú",
  "az ügyféloldali",
  "az ütemes",
  "a távolsági"];

const arr4 = ["szinergiákat",
  "adatbázist",
  "ágazatközi munkamegosztást",
  "akció-rádiuszt",
  "akcióterveket",
  "belsõ hatékonyságot",
  "beruházási megtérülést",
  "beszállító-menedzsmentet",
  "csatlakozási pontokat",
  "csapatot",
  "csatornákat",
  "derogációt",
  "desztinációszenzitív portfoliót",
  "együttmûködéseket",
  "egységköltséget",
  "egység-díjtételt",
  "ellátási láncokat",
  "emberi erõforrást",
  "eredményjavító hatást",
  "erõforrás-menedzsmentet",
  "erõforrásokat",
  "értékláncot",
  "értékesítési rendszert",
  "fejlesztéseket",
  "feladatmegosztást",
  "flotta-menedzsmentet",
  "fogyasztói bázist",
  "frontvonalat",
  "front-office-t",
  "front-office on-stage vonalat",
  "front-office backstage vonalat",
  "hálózatokat",
  "háttérszolgáltatásokat",
  "hatalmi centrumot",
  "imázs-alakítást",
  "infrastruktúrákat",
  "intermodalitást",
  "interoperabilitást",
  "irányelveket",
  "irányítási filozófiát",
  "jogharmonizációt",
  "kapacitás-kihasználtságot",
  "kapcsolatokat",
  "kezdeményezéseket",
  "koncepciót",
  "kontextust",
  "kontrollingot",
  "konvergenciákat",
  "költségérzékeny szegmenst",
  "környezet-elemzést",
  "kritériumokat",
  "látványtechnológiát",
  "leválasztási stratégiát",
  "marketing-kutatást",
  "marketing-miómát",
  "marketing-szemléletet",
  "megoldásokat",
  "méretgazdaságosságot",
  "mérföldköveket",
  "metodológiákat",
  "minõségi szolgáltatásokat",
  "minpõségi indikátorokat",
  "minõség-monitoringot",
  "munkacsoportot",
  "mûködési költségeket",
  "optimalizálási koncepciót",
  "outsourcingot",
  "paradigmákat",
  "piaci megjelenést",
  "piaci potenciált",
  "piaci pozíciót",
  "piaci réseket",
  "piaci trendeket",
  "piacokat",
  "pilot projektet",
  "platformokat",
  "portálokat",
  "projekteket",
  "reklámanyagot",
  "rendszereket",
  "rendszertervezési technológiát",
  "sémákat",
  "stratégiai célokat",
  "szabályozásokat",
  "szegmentumokat",
  "személyszállítást",
  "szervezeti kultúrát",
  "szolgáltatási folyamatrendszert",
  "szolgáltatás-felügyeletet",
  "szolgáltatást",
  "sztenderdizációt",
  "támogató tevékenységet",
  "termékpalettát",
  "termékportfolió-átalakítást",
  "technológiákat",
  "tevékenység-menedzsmentet",
  "tudásközpontot",
  "tranzakciós költséget",
  "újraelosztó-rendszert",
  "ügyfeleket",
  "ügyfélreferenst",
  "ügyfél-kiszolgálást",
  "ügyfélorientált trendeket",
  "üzletmenetet",
  "vállalati imázst",
  "VIP-ügyfeleket",
  "versenyhelyzetet",
  "versenyelõny-forrást"];
// Vége

// Vers kategóriák
const poemKat = ["Baratsag",
  "Muveszet",
  "Alom",
  "Szabadsag",
  "Emlekezes",
  "Titok",
  "Szepseg",
  "Sport",
  "Jatek",
  "Szerencse",
  "Humor",
  "Csalad",
  "Hazassag",
  "Nok",
  "Ferfiak",
  "Anya",
  "Apa",
  "Nagymama",
  "Nagypapa",
  "Testverek",
  "Gyermek",
  "Elet",
  "Halal",
  "Gyasz",
  "Betegseg",
  "Bucsu",
  "Oregedes",
  "Sors",
  "Vigasz",
  "Remeny",
  "Biztatas",
  "Ido",
  "Mindennapok",
  "Haza",
  "Munka",
  "Szegenyseg",
  "Oktatas",
  "Siker",
  "Penz",
  "Termeszet",
  "Evszakok",
  "Termeszetvedelem",
  "Allatok",
  "Tudomany",
  "Filozofia",
  "Ateizmus",
  "Vallas",
  "Isten",
  "Ima",
  "Carpe_diem",
  "Onismeret",
  "Cel",
  "Szerelem",
  "Igaz_szerelem",
  "Boldog_szerelem",
  "Kedvesemnek",
  "Vagyakozas",
  "Vallomas",
  "Romantika",
  "Huseg",
  "Csok",
  "Szomoru_szerelem",
  "Feltekenyseg",
  "Hutlenseg",
  "Szakitas",
  "Viszonzatlan",
  "Szerelmi_csalodas",
  "Kihult_szerelem",
  "Remenytelenseg",
  "Szeretet",
  "Felelem",
  "Fajdalom",
  "Szenvedes",
  "Siras",
  "Magany",
  "Unalom",
  "Harag",
  "Csalodas",
  "Boldogsag",
  "Szomorusag",
  "Bizalom",
  "Mosoly",
  "Hiany",
  "Irigyseg",
  "Szuletesnap",
  "Nevnap",
  "Eskuvo",
  "Nemzeti_unnepek",
  "Valentin-nap",
  "Nonap",
  "Farsang",
  "Husvet",
  "Locsolovers",
  "Anyak_napja",
  "Punkosd",
  "Gyermeknap",
  "Ballagas",
  "Apak_napja",
  "Halottak_napja",
  "Advent",
  "Mikulas",
  "Karacsony",
  "Szilveszter",
  "Nepkolteszet",
  "Nyelvi_jatek",
  "Gyerekvers",
  "Mese",
  "Fabula"];
// Vége

module.exports = {
  cfg, e_music, e_photos, e_shit, arr1, arr2, arr3, arr3, arr4, poemKat, regions, permissions, events
};
