/* eslint-disable no-console */

import * as utils from "/scripts/utils.js";

// [...new Set(emojiList.map(item => item.v))].sort((a, b) => a - b).join(", ")
const UNICODE_VERSIONS = new Set([1.1, 3.0, 3.2, 4.0, 4.1, 5.1, 5.2, 6.0, 6.1, 7.0, 8.0, 9.0, 10.0, 11.0]);

let emojiList;
let curEmojiList;
const emojiDumpEl = document.getElementById("emojiDump");
const commandEl = document.getElementById("command");


fetch("/scripts/emoji.json")
    .then((response) => response.json())
    .then((data) => {
        emojiList = data;
        dump();
    });


function dump() {
    const args = utils.basicCLAParser(commandEl.value);
    console.log(args);

    // By default display all emojis
    curEmojiList = emojiList;

    // Parse the Unicode version argument
    if (args.hasOwnProperty("u")) {
        const version = args["u"];
        if (!UNICODE_VERSIONS.has(version)) return `Invalid Unicode version: ${version}`;

        // Filter emojis by Unicode version
        console.log(`Filtering Unicode v${version} emojis...`);
        curEmojiList = emojiList.filter(el => el.v <= version);
    }

    // Parse the shuffle argument
    if (args.hasOwnProperty("s")) {
        const shuffle = args["s"];
        if (typeof shuffle != typeof true) return `Invalid shuffle option: ${shuffle}`;

        // Shuffle emoji array
        if (shuffle) {
            console.log(`Shuffling emojis...`);
            utils.shuffleArray(curEmojiList);
        }
    }

    // Parse the limit argument
    if (args.hasOwnProperty("l")) {
        const limit = args["l"];
        if (!Number.isInteger(limit)) return `Invalid limit value: ${limit}`;

        // Slice emoji array
        console.log(`Slicing the first ${limit} emojis...`);
        curEmojiList = curEmojiList.slice(0, limit);
    }

    // Parse the zoom argument
    if (args.hasOwnProperty("z")) {
        const zoom = args["z"];
        if (!utils.isIntegerBetween(zoom, 1, 4)) return `Invalid zoom value: ${zoom}`;

        emojiDumpEl.dataset.zoom = zoom;
    }

    // Parse the join argument
    let separator = " ";
    if (args.hasOwnProperty("j")) {
        const join = args["j"];
        if (typeof join != typeof true) return `Invalid join option: ${join}`;

        if (join) separator = "";
    }

    // Do emoji dump
    console.log(`Dumping ${curEmojiList.length} emojis with ${separator === "" ? "no" : "space"} separator...`);
    emojiDumpEl.innerText = curEmojiList.map(emoji => emoji.e).join(separator);

    // Update emoji count
    document.title = `emojidump - ${curEmojiList.length} emojis`;
}

commandEl.addEventListener("keyup", (event) => {
    if (event.which === 13) {
        commandEl.blur();

        const errorMsg = dump();
        if (errorMsg) {
            emojiDumpEl.innerText = errorMsg;
            console.log(errorMsg);
        }
    }
});