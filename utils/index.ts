/**
 * 简单的工具集
 * 
 */

export function isType(value: any, type: string): boolean {
    return Object.prototype.toString.call(value).includes(type);
}

export function isBlankValue(param: any): boolean {
    const noVal = ['', null, NaN, undefined].includes(param);
    if (noVal) return true;
    if (Array.isArray(param)) {
        return param.length === 0;
    }
    if (typeof param === 'object') {
        return Object.keys(param).length === 0;
    }
    return false;
}