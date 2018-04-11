

const claOptions = {
    unicode: { option: "-u", errorMsg: "Invalid Unicode version" },
    shuffle: { option: "-s", errorMsg: "Invalid shuffle option" },
    max: { option: "-m", errorMsg: "Invalid maximum number of emojis to display" },
    join: { option: "-j", errorMsg: "Invalid join option" },
    zoom: { option: "-z", errorMsg: "Invalid zoom value" }
}

export function checkOption(args, optionName, check) {
    let valid, value, error;

    const option = claOptions[optionName];
    if (args.hasOwnProperty(option.option)) {
        value = args[option.option];
        valid = check(value);
        if (!valid) {
            error = { result: false, msg: `${option.errorMsg}: ${value}` }
        }
    }

    const result = { valid: valid, value: value, error: error };
    console.log(optionName, result);
    return result;
}

export function commandFeedback(len, version, shuffle, max, join, zoom) {
    let msg = "Dumped";
    if (max !== undefined) msg += ` ${Math.min(max, len).toLocaleString()} of`;
    msg += ` ${len.toLocaleString()} Unicode ${version.toFixed(1)} emojis`;
    if (shuffle) msg += ", shuffled";
    msg += `, with ${join ? "no" : "space"} separator`
    if (zoom) msg += `, and a ${zoom}x zoom`;

    return msg + ".";
}