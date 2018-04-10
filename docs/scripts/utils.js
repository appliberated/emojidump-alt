/*
 *  emojidump. Copyright (c) 2018 HWALab. MIT License.
 *  https://www.hwalab.com/emojidump/
 */

export function isBetween(n, a, b) {
    return (n - a) * (n - b) <= 0
}

export function isIntegerBetween(n, a, b) {
    return Number.isInteger(n) && (n - a) * (n - b) <= 0
}

/**
 * Randomize array element order in-place, using an implementation of the Durstenfeld shuffle, a
 * computer-optimized version of Fisher-Yates shuffle.
 * Credit: {@link https://stackoverflow.com/a/12646864/220039}
 * @param {Array} array The array to shuffle.
 * @returns {void}
 */
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function basicCLAParser(claString) {
    return claString.split(" ").reduce((acc, arg) => {

        // let [k, v = true] = arg.split('=')
        // acc[k] = v
        let [k, v] = arg.split(':');
        acc[k] = v === undefined ? true : /^(true|false)$/i.test(v) ? v.toLowerCase() === "true" : /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(v) ? Number(v) : v;
        return acc
    
    }, {});    
}