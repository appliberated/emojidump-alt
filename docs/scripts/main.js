/*
 *  emojidump. Copyright (c) 2018 HWALab. MIT License.
 *  https://www.hwalab.com/emojidump/
 */

/* eslint-disable no-console, max-statements */

import * as helpers from "/scripts/helpers.js";
import * as utils from "/scripts/utils.js";

// [...new Set(emojiList.map(item => item.v))].sort((a, b) => a - b).join(", ")
const unicodeVersions = [1.1, 3.0, 3.2, 4.0, 4.1, 5.1, 5.2, 6.0, 6.1, 7.0, 8.0, 9.0, 10.0, 11.0];

const MIN_ZOOM = 1, MAX_ZOOM = 7;

let sourceEmojis, curEmojis;

/**
 * Get references to the required DOM elements.
 */
const dumpEl = document.getElementById("dump");
const commandEl = document.getElementById("command");
const feedbackEl = document.getElementById("feedback");
const helpButton = document.getElementById("helpButton");
const helpEl = document.getElementById("help");

/**
 * Performs the actual emojidump command.
 * @param {string} argString The command line arguments.
 * @returns {void}
 */
function execCommandInternal(argString) {
    let valid, error, version, shuffle, max, join, zoom;

    // Parse command line arguments
    const args = utils.basicCLAParser(argString);
    console.log("CLA", args);

    // By default display all emojis
    curEmojis = sourceEmojis.slice(0);

    // Filter the emoji array by Unicode version if the unicode option is present and has a valid value
    ({ valid, value: version, error } = helpers.checkOption(args, "unicode", value => unicodeVersions.includes(value)));
    if (valid === false) return error;
    if (valid) curEmojis = curEmojis.filter(el => el.v <= version);
    version = version || unicodeVersions[unicodeVersions.length - 1];
    const len = curEmojis.length;

    // Shuffle the emoji array if the shuffle option is on
    ({ valid, value: shuffle, error } = helpers.checkOption(args, "shuffle", value => typeof value == typeof true));
    if (valid === false) return error;
    if (valid && shuffle) utils.shuffleArray(curEmojis);

    // Slice the emoji array if the maximum option is present and has a valid value
    ({ valid, value: max, error } = helpers.checkOption(args, "max", value => Number.isInteger(value)));
    if (valid === false) return error;
    if (valid && max < curEmojis.length) curEmojis = curEmojis.slice(0, max);

    // Check if the join option is present and has a valid value
    ({ valid, value: join, error } = helpers.checkOption(args, "join", value => typeof value == typeof true));
    if (valid === false) return error;

    // Dump the emojis, with no separator if the join option was passed
    dumpEl.innerText = curEmojis.map(emoji => emoji.e).join(join ? "" : " ");

    // Apply zoom if the zoom option has a valid value
    delete dumpEl.dataset.zoom;
    ({ valid, value: zoom, error } = helpers.checkOption(args, "zoom", value => utils.isIntegerBetween(value, MIN_ZOOM, MAX_ZOOM)));
    if (valid === false) return error;
    if (valid) dumpEl.dataset.zoom = zoom;

    // Return success and a command summary message
    return { result: true, msg: helpers.commandFeedback(len, version, shuffle, max, join, zoom) };
}

/**
 * Executes the emojidump command with the current command line arguments.
 * @returns {void}
 */
function execCommand() {
    const { result, msg } = execCommandInternal(commandEl.value);

    // On success: show the emoji dump, on failure show the help screen; update the message
    dumpEl.classList.toggle("hidden", !result);
    helpEl.classList.toggle("hidden", result);
    feedbackEl.innerText = msg;
    feedbackEl.classList.remove("hidden");
    feedbackEl.classList.toggle("feedback--error", !result);
}

/**
 * Shows an app error message to the user.
 * @param {Object} error The error object.
 * @returns {void}
 */
function showAppError(error) {
    feedbackEl.innerText = `Cannot load emojis! ${error}`;
    console.error(error);
}

/**
 * Initializes event listeners.
 * @returns {void}
 */
function initEvents() {
    commandEl.classList.remove("hidden");
    helpButton.classList.remove("hidden");

    document.getElementById("exampleCmd").addEventListener("click", event => {
        commandEl.value = event.target.dataset.command;
        execCommand();
    });

    document.getElementById("appLabel").addEventListener("click", () => {
        execCommand();
    });

    helpButton.addEventListener("click", () => {
        dumpEl.classList.add("hidden");
        feedbackEl.classList.add("hidden");
        helpEl.classList.remove("hidden");
    });
}

/**
 * Initializes the app.
 * @returns {void}
 */
function initApp() {
    commandEl.addEventListener("keyup", event => {
        if (event.which === 13) {
            commandEl.blur();
            execCommand();
        }
    });

    // Fetch the emoji JSON file; on success execute the emojidump command, on failure show error message
    fetch("/scripts/emoji.json")
        .then(response => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then(response => {
            sourceEmojis = response;
            execCommand();
            initEvents();
        })
        .catch(error => showAppError(error));
}

initApp();
