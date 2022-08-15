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

import { isNull } from '../utils';

let permissionList = [];
// 要来标记是否已经调用setPermissions方法设置权限合集，permissionList不能作为判断标准，因为permissionList可能为空（用户无任何权限）
let hasSeted = false;

/**
 * 权限合集
 * 必须调用该方法
 * @param list<Array>: 要校验的权限合集，如果没有任何权限支持传入空数组或者null
 * 
 * */
export function setPermissions (list) {
  permissionList = [...(list || [])];
  hasSeted = true;
}
export function getPermissions () {
  return [...permissionList];
}

function validatePermissionList() {
  if (!hasSeted) {
    console.warn('请先调用<setPermissions>方法设置用户权限集');
    return false;
  }
  return true;
}

function validateParam(value) {
  if (!validatePermissionList()) return;
  if (isNull(value)) {
    console.warn('传入的权限参数不能为空');
    return false;
  }
  return true;
}

// is('USER') => permissionList.includes('USER')
// all(['USER', 'ADMIN', 'SETTING']) permissionList.includes('USER')
// atLeast(['USER', 'ADMIN', 'SETTING'], 2)

/**
 * 单个权限校验
 * is('USER') => permissionList.includes('USER')
 */
function is({ value }, userPermissions = permissionList) {
  return userPermissions.includes(value);
}

/**
 * 至少满足多少个权限
 * atLeast(['USER', 'ADMIN', 'SETTING'], 2)
 */
function atLeast({ value, n }, userPermissions = permissionList) {
  let checkNum = num;
  for (let i = 0; i <= value.length; i++) {
    if (is({ value: value[i] }, userPermissions)) {
      checkNum -= 1;
    }
    if (checkNum === 0) break; 
  }
  return checkNum === 0;
}

/**
 * 满足所有权限
 * all(['USER', 'ADMIN', 'SETTING']) permissionList.includes('USER')
 */
function all(value, userPermissions = permissionList) {
  return atLeast({ value, n: value.length }, userPermissions)
}


const validate = {
  is,
  atLeast,
  all,
}

const directive = {
  inserted(el, binding) {
    const { arg = 'is', value } = binding;
    if (validate[arg]) {
      return;
    }
    const hasPermission = validate[arg](value);
    // 主要考虑到数据变化后，页面未刷新能实时响应
    if (!hasPermission) {
      if (el.parentNode && el.parentNode.removeChild(el)) return;
    }
    // eslint-disable-next-line no-param-reassign
    el.style.display = hasPermission ? '' : 'none';
  },
};

function install(Vue) {
  Vue.directive('permission', directive);
  if (Vue.prototype.$permission) {
    console.warn('权限指令注册失败：已存在$permission');
  } else {
    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$permission = validate;
  }
}

export default {
  directive,
  install,
  setPermissions,
  getPermissions,
  // 暴露此方法，以便在非vue实例的js代码中使用
  validate,
};
