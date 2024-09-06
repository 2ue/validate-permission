/**
 * 权限校验
 * 一、支持多种调用方式：
 * 1.函数式调用-->在react等框架中使用：直接导出validate方法使用
 * 2.vue指令或者原型链：导出directive自定义注册指令或者调用install方法注册指令，绑定原型链
 *
 * 二、支持多种权限校验模式
 * 1.is：单个权限校验
 * 2.atLeast: 满足传入权限组的某几个即可，用于权限组模糊的情况
 * 3.all：对传入的权限组全部进行校验，需全部满足
 * 4.自定义校验
 */

import { isType } from "../utils";
import { Permissions, AtLeastFunc, IsFunc, AllFunc, InstallOptions } from "../types";

let permissionList: Permissions = [];

/**
 * 设置权限集合
 * 必须调用该方法
 * @param list<Array>: 要校验的权限合集，如果没有任何权限支持传入空数组或者null
 *
 * */
export function setPermissions(permissions: Permissions) {
  permissionList = [...(permissions || [])];
}

// 获取权限集合
export function getPermissions(): Permissions {
  return [...permissionList];
}

/**
 * 单个权限校验
 * is('SETTING', userPermissions);
 */
const is: IsFunc = (
  value,
  userPermissions?
): boolean => {
  const _permissions = userPermissions ?? permissionList;
  return _permissions.includes(value);
};

/**
 * 至少满足多少个权限
 * atLeast({ value: ['USER', 'ADMIN', 'SETTING'], n: 2 }, userPermissions)
 */
const atLeast: AtLeastFunc = (
  { value, n },
  userPermissions?
) => {
  const _permissions = userPermissions || permissionList;
  let checkNum = n;
  for (let i = 0; i <= value.length; i++) {
    if (is(value[i], _permissions)) {
      checkNum -= 1;
    }
    if (checkNum === 0) break;
  }
  return checkNum === 0;
};

/**
 * 满足其中一个
 * oneOf(['USER', 'ADMIN', 'SETTING'], userPermissions)
 */
const oneOf: AllFunc = (value, userPermissions?): boolean => {
  const _permissions = userPermissions || permissionList;
  return atLeast(
    {
      value,
      n: 1,
    },
    _permissions
  );
};

/**
 * 满足所有权限
 * all(['USER', 'ADMIN', 'SETTING'], userPermissions)
 */
const all: AllFunc = (value, userPermissions?): boolean => {
  const _permissions = userPermissions || permissionList;
  return atLeast({ value, n: value.length }, _permissions);
};

export const validateFunMaps: Record<string, Function> = {
  is,
  atLeast,
  oneOf,
  all,
};

export const directive = {
  inserted(el: any, binding: any) {
    const { arg = "is", value } = binding;
    const validateFunc = validateFunMaps?.[arg];
    if (!validateFunc && !isType<Function>(validateFunc, "Function")) {
      return;
    }
    const hasPermission = validateFunc(value);
    if (!hasPermission) {
      if (el.parentNode && el.parentNode.removeChild(el)) return;
    }
    el.style.display = hasPermission ? "" : "none";
  },
};

const installOptions = {
  directiveKey: 'permission',
  instanceKey: '$permission',
}

export function install(Vue: any, options?: InstallOptions) {
  const _options = {
    ...installOptions,
    ...(options || {}),
  }
  Vue.directive(_options.directiveKey, directive);
  if (Vue.prototype[_options.instanceKey]) {
    console.warn(`实例方法[${_options.instanceKey}]注册失败：${_options.instanceKey}已存在`);
  } else {
    Vue.prototype[_options.instanceKey] = validateFunMaps;
  }
}
