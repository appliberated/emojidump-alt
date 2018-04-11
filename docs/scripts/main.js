/*
 *  emojidump. Copyright (c) 2018 HWALab. MIT License.
 *  https://www.hwalab.com/emojidump/
 */

/* eslint-disable no-console */

import * as utils from "/scripts/utils.js";

// [...new Set(emojiList.map(item => item.v))].sort((a, b) => a - b).join(", ")
const UNICODE_VERSIONS = [1.1, 3.0, 3.2, 4.0, 4.1, 5.1, 5.2, 6.0, 6.1, 7.0, 8.0, 9.0, 10.0, 11.0];

const DEFAULT_ZOM = 2;

const CLI_OPTIONS = { UNICODE_VERSION: "-u", SHUFFLE: "-s", MAX: "-m", ZOOM: "-z", JOIN: "-j" }

let sourceEmojiList;
let curEmojiList;
const emojiDumpEl = document.getElementById("emojiDump");
const commandEl = document.getElementById("command");
const feedbackEl = document.getElementById("feedback");
const helpEl = document.getElementById("help");


fetch("/scripts/emoji.json")
    .then((response) => response.json())
    .then((data) => {
        sourceEmojiList = data;
        dumpCommand();
    });


function updateDump() {
    let msg = "";

    const args = utils.basicCLAParser(commandEl.value);
    console.log(args);

    // Parse the Unicode version argument
    let version = UNICODE_VERSIONS[UNICODE_VERSIONS.length - 1];
    if (args.hasOwnProperty(CLI_OPTIONS.UNICODE_VERSION)) {
        version = args[CLI_OPTIONS.UNICODE_VERSION];
        if (!UNICODE_VERSIONS.includes(version)) return { result: false, msg: `Invalid Unicode version: ${version}` };

        // Filter emojis by Unicode version
        console.log(`Filtering Unicode ${version} emojis...`);
        curEmojiList = sourceEmojiList.filter(el => el.v <= version);
    } else {
        // By default display all emojis
        curEmojiList = sourceEmojiList.slice(0);
    }
    msg = `${curEmojiList.length.toLocaleString()} Unicode ${version.toFixed(1)} emojis`;

    // Parse the shuffle argument
    if (args.hasOwnProperty(CLI_OPTIONS.SHUFFLE)) {
        const shuffle = args[CLI_OPTIONS.SHUFFLE];
        if (typeof shuffle != typeof true) return { result: false, msg: `Invalid shuffle option: ${shuffle}` };

        // Shuffle emoji array
        if (shuffle) {
            utils.shuffleArray(curEmojiList);
            msg += ", shuffled";
        }
    }

    // Parse the limit argument
    if (args.hasOwnProperty(CLI_OPTIONS.MAX)) {
        const max = args[CLI_OPTIONS.MAX];
        if (!Number.isInteger(max)) return { result: false, msg: `Invalid maximum number of emojis to display: ${max}` };

        // Slice emoji array
        curEmojiList = curEmojiList.slice(0, max);
        msg = `${max.toLocaleString()} of ${msg}`;
    }
    msg = `Dumped ${msg}`;

    // Parse the join argument
    let separator = " ";
    if (args.hasOwnProperty(CLI_OPTIONS.JOIN)) {
        const join = args[CLI_OPTIONS.JOIN];
        if (typeof join != typeof true) return { result: false, msg: `Invalid join option: ${join}` };

        if (join) separator = "";
    }

    // Do emoji dump
    console.log(`Dumping ${curEmojiList.length} emojis with ${separator === "" ? "no" : "space"} separator...`);
    emojiDumpEl.innerText = curEmojiList.map(emoji => emoji.e).join(separator);
    msg = `${msg}, with ${separator === "" ? "no" : "space"} separator`;

    // Parse the zoom argument
    let zoom = DEFAULT_ZOM;
    if (args.hasOwnProperty(CLI_OPTIONS.ZOOM)) {
        zoom = args[CLI_OPTIONS.ZOOM];
        if (!utils.isIntegerBetween(zoom, 1, 4)) return { result: false, msg: `Invalid zoom value: ${zoom}` };
    }
    emojiDumpEl.dataset.zoom = zoom;
    msg += `, and a ${zoom}x zoom`;

    // Update emoji count
    document.title = `emojidump - ${curEmojiList.length} emojis`;

    return { result: true, msg: msg };
}

function dumpCommand() {
    const { result, msg } = updateDump();
    console.log(result + msg);
    emojiDumpEl.dataset.visible = result;
    helpEl.dataset.visible = !result;
    feedbackEl.innerText = msg;
}

commandEl.addEventListener("keyup", (event) => {
    if (event.which === 13) {
        commandEl.blur();
        dumpCommand();
    }
});