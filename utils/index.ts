/**
 * 简单的工具集
 *
 */

/**
 * 获取值的类型，并返回全小写的字符串
 * @export
 * @param {*} value
 * @returns {string} 全小写的字符串
 */
export function getType(value: any): string {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

/**
 * 判断值的类型
 * @param value 目标值
 * @param type 目标类型
 * @returns boolean
 */
export function isType<P>(value: any, type: string): value is P {
  return getType(value) === type.toLowerCase();
}

export function isBlankValue(param: any): boolean {
  const noVal = ["", null, NaN, undefined].includes(param);
  if (noVal) return true;
  if (Array.isArray(param)) {
    return param.length === 0;
  }
  if (typeof param === "object") {
    return Object.keys(param).length === 0;
  }
  return false;
}
