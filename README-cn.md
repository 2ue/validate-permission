# 权限校验工具：validate-permission

> `validate-permission`是一个多功能的权限校验库，它为开发者提供了一种灵活且高效的方式来校验用户权限。这个工具不仅支持React的函数式调用，还兼容Vue的原型链调用和自定义指令，使其能够适应不同的开发场景和需求。

## 安装指南

通过npm包管理器，您可以轻松地将`validate-permission`集成到您的项目中。只需在项目的根目录下运行以下命令即可完成安装：

``` shell
npm install --save validate-permission
```

## API概览

`validate-permission`提供了一个简洁的API接口，使得权限管理变得简单直观。以下是其主要的导出方法：

``` javascript
import { setPermissions, getPermissions, validate, install, directive } from 'validate-permission';
```

### setPermissions

此方法用于设置用户的权限集，是所有权限检测方法的前置步骤。您需要在调用任何校验方法之前，确保已经通过此方法为用户设置了正确的权限集。
当然你也可以不调用此方法，但是你需要在每次调用权限校验方法时额外传入权限集参数

#### 使用setPermissions

```javascript
import { setPermissions, validate } from 'validate-permission';
const permissions = ['USER.LIST', 'USER.ADD', 'USER.EDIT', "USER.DELETE"];
setPermissions(permissions);
// 是否具有用户列表权限
validate.is('USER.LIST');
// 是否具有用户列表，新增用户，编辑用户，删除用户所有权限
validate.all(['USER.LIST', 'USER.ADD', 'USER.EDIT', "USER.DELETE"]);
// 是否具有用户新增和用户编辑其中一个权限
validate.oneOf(['USER.ADD', 'USER.EDIT']);
// 是否具有用户新增，编辑，删除其中两个权限
validate.atLeast({
    value: ['USER.ADD', 'USER.EDIT', 'USER.DELETE'],
    n: 2
});
```

#### 不使用setPermissions

```javascript
import { setPermissions, validate } from 'validate-permission';
const permissions = ['USER.LIST', 'USER.ADD', 'USER.EDIT', "USER.DELETE"];
// 是否具有用户列表权限
validate.is('USER.LIST', permissions);
// 是否具有用户列表，新增用户，编辑用户，删除用户所有权限
validate.all(['USER.LIST', 'USER.ADD', 'USER.EDIT', "USER.DELETE"], permissions);
// 是否具有用户新增和用户编辑其中一个权限
validate.oneOf(['USER.ADD', 'USER.EDIT'], permissions);
// 是否具有用户新增，编辑，删除其中两个权限
validate.atLeast({
    value: ['USER.ADD', 'USER.EDIT', 'USER.DELETE'],
    n: 2
}, permissions);
```

### getPermissions

当需要在自定义逻辑中使用用户的权限集时，此方法可以方便地获取当前用户的权限列表。

### install

此方法专门用于Vue集成，允许您在Vue应用中直接使用`use`方法来访问权限校验功能。

### directive

提供Vue自定义指令，使得在Vue模板中可以直接使用权限校验功能。

### validate

这是一组函数式调用方法，适用于React或其他函数式框架，提供了多种校验方式：

- `validate.is(permission)`：检测用户是否具有特定的权限。
- `validate.all(permissionsArray)`：检测用户是否具有一组权限，并且所有权限都必须匹配。
- `validate.atLeast(options)`：检测用户是否具有一组权限中的至少`n`个。
- `validate.oneOf(permissionsArray)`：检测用户是否至少具有一组权限中的一个。

``` shell
import { validate } from 'validate-permission';

// 检测用户权限
console.log('是否拥有用户列表权限：', validate.is('USER.PAGE'));
console.log('是否拥有用户新增和编辑权限：', validate.all(['USER.ADD', 'USER.EDIT']));

// 检测用户是否至少拥有某组权限中的两个
console.log('是否至少拥有用户新增、编辑、删除权限中的两个：', validate.atLeast({
    value: ['USER.ADD', 'USER.EDIT', 'USER.DELETE'],
    n: 2
}));

// 检测用户是否拥有某组权限中的任何一个
console.log('是否拥有用户新增或编辑权限：', validate.oneOf(['USER.ADD', 'USER.EDIT']));
```

## 使用示例

### 设置用户权限集

在使用`validate`方法之前，您需要先设置用户的权限集。这通常在用户登录成功后，从服务器获取权限数据时进行：

``` javascript
import { setPermissions } from 'validate-permission';

// 假设从服务器获取到的权限集
const permissions = ['USER.PAGE', 'USER.ADD', 'USER.EDIT', 'USER.DELETE'];

// 设置当前用户的权限集
setPermissions(permissions);
```

### 获取用户权限集

在自定义权限校验逻辑时，您可能需要获取用户的权限集：

``` javascript
import { getPermissions } from 'validate-permission';

// 获取当前用户的权限集并打印
console.log('当前用户权限集：', getPermissions());
```

### Vue2集成

#### 自定义注册指令

在Vue项目中，您可以将`validate-permission`的指令注册为全局指令，以便在模板中使用：

``` javascript
import Vue from 'vue';
import { directive } from 'validate-permission';

// 注册全局指令
Vue.directive('permission', directive);
```

然后，在Vue组件中，您可以这样使用：

``` vue
<template>
    <!-- 使用自定义指令进行权限校验 -->
    <button v-permission:is="'USER.PAGE'">用户列表权限</button>
    <button v-permission:all="['USER.PAGE', 'USER.EDIT']">用户页面和编辑权限</button>
    <!-- 更多权限校验方式 -->
</template>
```
ps: `v-permission`和`v-permission:is`是等价的

#### 内置方法直接注册

或者，您也可以直接使用`validatePermission`提供的内置方法：

``` javascript
import Vue from 'vue';
import { install } from 'validate-permission';

// 使用内置方法
Vue.use(install);
// 默认是使用permission作为指令名，使用时直接v-permission
// 默认是使用$permission作为实例方法名，使用时直接this.$permission

// 或者手动指定directiveKey和instanceKey
Vue.use(install, {
    directiveKey: 'validate-permission',
    instanceKey: '$validatePermission',
});
```

在Vue组件中，您可以直接通过`this.$permission`访问权限校验功能，同样你也可以使用`v-permission`：

``` vue
<template>
    <!-- 使用内置方法进行权限校验 -->
    <button v-permission:is="{ value: 'USER.PAGE' }">用户列表权限</button>
    <!-- 更多内置方法的使用 -->
</template>

<script>
export default {
    methods: {
        checkPermission() {
            // 使用this.$permission进行权限校验
            console.log('是否拥有用户列表权限：', this.$permission.is('USER.PAGE'));
        }
    }
}
</script>
```

### React/Vue3或函数式调用

在React或其他支持函数式编程的框架中，您可以这样使用`validate-permission`：

``` javascript
import { validate } from 'validate-permission';

// 检测用户权限
console.log('是否拥有用户列表权限：', validate.is('USER.PAGE'));
console.log('是否拥有用户新增和编辑权限：', validate.all(['USER.ADD', 'USER.EDIT']));
// 更多函数式调用的使用
```

`validate-permission`工具以其灵活性和易用性，为开发者在权限管理方面提供了强大的支持。无论是在React中进行函数式编程，还是在Vue中创建复杂的权限指令，它都能满足您的需求。
