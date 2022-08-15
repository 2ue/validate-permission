# validate-permission
一个支持多种调用方式的用户权限校验方法，支持react（函数式）调用，vue原型链调用，vue指令等方式，并且支持多种校验方式

## 安装
``` shell
npm i -S validate-permission
```

## 方法

导出结构如下
``` javascript
export default {
    setPermissions,
    getPermissions,
    install,
    directive,
    validate
};
```

### setPermissions

设置用户权限集：所有检测方法的前置操作

### getPermissions

获取用户权限集：自定义校验权限时，可以通过该方法获取用户的所有权限

### install

暴露install方法，以便能够在vue中直接调用use方法

### directive

提供指令，可以在vue中自定义注册指令

### validate

函数式调用：在react或者其他函数式框架中使用

- validate.is({ value: 'USER.PAGE' })检测是存在某个权限
- validate.all({ value: ['USER.ADD', 'USER.EDIT'] })检测是否存在某一组权限，需要全部匹配
- validate.atLeast({ value: ['USER.ADD', 'USER.EDIT', 'USER.DELETE'], n: 2 })检测是否存在某组权限中的几个，匹配个数等于参数`n`


## 使用

### 设置用户权限集：使用前置

在合适时间对用户权限校验，要保证setPermissions在validate方法之前，不然validate方法执行结果可能不是需要的结果

为了防止该情况，在执行validate方法前会对setPermissions方法做执行检查，如检查到未执行该方法，会抛出警告

``` javascript
import { setPermissions } from 'validate-permission';

// 从服务器获取到权限集：伪代码
const permissions = getPermissionsFromServer();

// permissions格式：['USER.PAGE', 'USER.ADD', 'USER.EDIT', 'USER.DELETE', ....]
// 在合适的时机调用该方法为用户设置权限集
setPermissions(permissions)
```
### 获取用户权限集

在某些情况下，你可能需要获取用户的权限集, 如需要自定义进行权限校验，又对权限集没有任何保存时可以通过该方法获取

``` javascript
import { getPermissions } from 'validate-permission';

console.log('该用户权限为：', getPermissions())
```

### 在vue中使用

#### 自定义注册指令
main.js中引入注册指令
``` javascript
import Vue from 'vue';
import { directive } from 'validate-permission';

// 自定义注册指令
Vue.directive('permission', directive);
```

在vue文件中使用

``` vue
<template>
    <button v-permission:is="{ value: 'USER.PAGE' }">用户列表权限</button>
    <button v-permission:all="{ value: ['USER.ADD', 'USER.EDIT'] }">同时拥有用户新增和编辑权限</button>
    <button v-permission:atLeast="{ value: ['USER.ADD', 'USER.EDIT'], n: 1 }">拥有用户新增或编辑权限</button>
    <button v-permission:atLeast="{ value: ['USER.ADD', 'USER.EDIT', 'USER.DELETE'], n: 2 }">拥有用户新增、编辑、删除权限其中2个</button>
</template>
```

#### 调用内置方法直接注册

main.js中引入注册指令
``` javascript
import Vue from 'vue';
import validatePermission from 'validate-permission';

Vue.use(validatePermission)
// 就可以通过v-permission或者在this.$permission愉快的使用了
```

在vue文件中使用
``` vue
<template>
    <button v-permission:is="{ value: 'USER.PAGE' }">用户列表权限</button>
    <button v-permission:all="{ value: ['USER.ADD', 'USER.EDIT'] }">同时拥有用户新增和编辑权限</button>
    <button v-permission:atLeast="{ value: ['USER.ADD', 'USER.EDIT'], n: 1 }">拥有用户新增或编辑权限</button>
    <button v-permission:atLeast="{ value: ['USER.ADD', 'USER.EDIT', 'USER.DELETE'], n: 2 }">拥有用户新增、编辑、删除权限其中2个</button>
    <button @click="checkPermission">检查是否有用户列表权限</button>
</template>
<script>
    export default {
        methods: {
            checkPermission() {
                console.log('是否拥有用户列表权限：', this.$permission.is({ value: 'USER.PAGE' }));
            }
        }
    }
</script>
```

### 函数式调用或在react中使用

``` javascript
import { validate } from 'validate-permission';

console.log('是否拥有用户列表权限：', validate.is({ value: 'USER.PAGE' }));
console.log('是否拥有用户新增和编辑权限：', validate.all({ value: ['USER.ADD', 'USER.EDIT'] }));
console.log('拥有用户新增、编辑、删除权限其中2个：', validate.atLeast({ value: ['USER.ADD', 'USER.EDIT', 'USER.DELETE'], n: 2 }));
```