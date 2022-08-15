/**
 * 简单的工具集
 * 
 */

export function isType(type, value) {
    return Object.prototype.toString.call(value).includes(type);
}

export function isNull(param) {
    return ['', null, NaN, undefined].includes(param);
}

export function isBlankValue(param) {
    const noVal = isNull(param);
    if (noVal) return true;
    if (Array.isArray(param)) {
        return param.length === 0;
    }
    if (typeof param === 'object') {
        return Object.keys(param).length === 0;
    }
    return false;
}