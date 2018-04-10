export function isBetween(n, a, b) {
    return (n - a) * (n - b) <= 0
}

export function isIntegerBetween(n, a, b) {
    return Number.isInteger(n) && (n - a) * (n - b) <= 0
}

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
        let [k, v] = arg.split('=');
        acc[k] = v === undefined ? true : /^(true|false)$/i.test(v) ? v.toLowerCase() === "true" : /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(v) ? Number(v) : v;
        return acc
    
    }, {});    
}