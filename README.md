# validate-permission
一个支持多种调用方式的用户权限校验方法，支持react（函数式）调用，vue原型链调用，vue指令等方式，并且支持多种校验方式

## 安装
``` shell
npm i -S validate-permission
```

## 使用

### 设置用户权限：必须

``` javascript
import { setPermissions } from 'validate-permission';

// 从服务器获取到权限集：伪代码
const permissions = getPermissionsFromServer();

// permissions格式：['USER.PAGE', 'USER.ADD', 'USER.EDIT', 'USER.DELETE', ....]
// 在合适的时机调用该方法为用户设置权限集
setPermissions(permissions)
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


``` javascript
import Vue from 'vue';
import validatePermission from 'validate-permission';

// 调用内置方法直接注册
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