const { cfg } = require('./gartnDB');

const Discord = require('discord.js');
const moment = require('moment');
const request = require('request-promise-native');
const sql = require('sqlite');
const _ = require('lodash');
const Kaori = require('kaori');
const Jimp = require('jimp');
const PastebinAPI = require('pastebin-js');
const dogeify = require('dogeify-js');
const imgur = require('imgur');
const fortniteClient = require('fortnite');
const random_dog = require('random.dog');
const bot_util = require('bot-util');
const osu = require('node-osu');
const convert = require('xml-js');
const giphy = require('giphy-api')(cfg.tokens.giphy);
const bh = require('brawlhalla-api')(cfg.tokens.brawlhalla);
const twitchStreams = require('twitch-get-stream')(cfg.tokens.twitch);
const BrawlStars = require("brawlstars");
const fs = require('fs');
const DBL = require("dblapi.js");

module.exports = {
	Discord, moment, request, sql, _, Kaori, Jimp, PastebinAPI, dogeify, imgur, fortniteClient, random_dog, bot_util, osu, convert, giphy,
bh, BrawlStars, twitchStreams, fs, DBL
};
