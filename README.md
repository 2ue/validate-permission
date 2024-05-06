# Permission Validation Tool: validate-permission

[中文文档](./README-cn.md)

> `validate-permission` is a versatile permission validation library that provides developers with a flexible and efficient way to check user permissions. This tool not only supports functional calls in React but is also compatible with Vue's prototype chain calls and custom directives, making it adaptable to various development scenarios and needs.

## Installation Guide

Through the npm package manager, you can easily integrate `validate-permission` into your project. Simply run the following command in the root directory of your project to complete the installation:

``` shell
npm install --save validate-permission
```

## API Overview

`validate-permission` offers a concise API interface, making permission management straightforward and intuitive. The following are its main exported methods:

``` javascript
import { setPermissions, getPermissions, validate, install, directive } from 'validate-permission';
```

### setPermissions

This method is used to set the user's permission set and is a prerequisite step for all permission checking methods. You need to ensure that you have set the correct permission set for the user through this method before calling any validation methods.
Of course, you can also leave this method uncalled, but you will need to pass in additional permission set parameters each time you call the permission check method

#### use setPermissions

```javascript
import { setPermissions, validate } from 'validate-permission';
const permissions = ['USER.LIST', 'USER.ADD', 'USER.EDIT', "USER.DELET"];
setPermissions(permissions);
// Whether have permissions of user list
validate.is('USER.LIST');
// Whether have all permissions of user
validate.all(['USER.LIST', 'USER.ADD', 'USER.EDIT', "USER.DELET"]);
// Whether have add or edit permissions of user
validate.oneOf(['USER.ADD', 'USER.EDIT']);
// Whether have two permissions of add or edit or delete user
validate.atLeast({
    value: ['USER.ADD', 'USER.EDIT', 'USER.DELETE'],
    n: 2
});
```

#### not use setPermissions

```javascript
import { setPermissions, validate } from 'validate-permission';
const permissions = ['USER.LIST', 'USER.ADD', 'USER.EDIT', "USER.DELET"];
// Whether have permissions of user list
validate.is('USER.LIST', permissions);
// Whether have all permissions of user
validate.all(['USER.LIST', 'USER.ADD', 'USER.EDIT', "USER.DELET"], permissions);
// Whether have add or edit permissions of user
validate.oneOf(['USER.ADD', 'USER.EDIT'], permissions);
// Whether have two permissions of add or edit or delete user
validate.atLeast({
    value: ['USER.ADD', 'USER.EDIT', 'USER.DELETE'],
    n: 2
}, permissions);
```

### getPermissions

When you need to use the user's permission set in custom logic, this method conveniently retrieves the current user's permission list.

### install

This method is specifically designed for Vue integration, allowing you to directly use the `use` method to access permission validation functionality within a Vue application.

### directive

Provides a custom directive for Vue, enabling direct use of permission validation functionality within Vue templates.

### validate

This is a set of functional call methods suitable for React or other functional frameworks, offering various validation methods:

- `validate.is(permission)`: Checks if the user has a specific permission.
- `validate.all(permissionsArray)`: Checks if the user has a set of permissions and all permissions must match.
- `validate.atLeast(options)`: Checks if the user has at least `n` permissions from a set.
- `validate.oneOf(permissionsArray)`: Checks if the user has at least one permission from a set.

``` javascript
import { validate } from 'validate-permission';

// Check user permissions
console.log('Has user list permission:', validate.is('USER.PAGE'));
console.log('Has user add and edit permissions:', validate.all(['USER.ADD', 'USER.EDIT']));

// Check if the user has at least two permissions from a group
console.log('Has at least two of user add, edit, and delete permissions:', validate.atLeast({
    value: ['USER.ADD', 'USER.EDIT', 'USER.DELETE'],
    n: 2
}));

// Check if the user has any one permission from a group
console.log('Has user add or edit permission:', validate.oneOf(['USER.ADD', 'USER.EDIT']));
```

## Usage Examples

### Setting User Permission Set

Before using the `validate` method, you need to set the user's permission set. This is usually done after a user logs in and permission data is obtained from the server:

``` javascript
import { setPermissions } from 'validate-permission';

// Assumed permission set obtained from the server
const permissions = ['USER.PAGE', 'USER.ADD', 'USER.EDIT', 'USER.DELETE'];

// Set the current user's permission set
setPermissions(permissions);
```

### Retrieving User Permission Set

When custom permission validation logic is needed, you may need to retrieve the user's permission set:

``` javascript
import { getPermissions } from 'validate-permission';

// Retrieve and print the current user's permission set
console.log('Current user permission set:', getPermissions());
```

### Vue Integration

#### Custom Directive Registration

In a Vue project, you can register the `validate-permission` directive as a global directive to use in templates:

``` javascript
import Vue from 'vue';
import { directive } from 'validate-permission';

// Register global directive
Vue.directive('permission', directive);
```

Then, in Vue components, you can use it like this:

``` vue
<template>
    <!-- Use custom directive for permission validation -->
    <button v-permission:is="'USER.PAGE'">User List Permission</button>
    <button v-permission:all="['USER.PAGE', 'USER.EDIT']">User List Permission</button>
    <!-- More permission validation methods -->
</template>
```

notice: `v-permission` and `v-permission:is` are equivalent

#### Direct Registration of Built-in Methods

Alternatively, you can directly use the built-in methods provided by `validatePermission`:

``` javascript
import Vue from 'vue';
import { install } from 'validate-permission';

// Use built-in methods
Vue.use(install);
// By default, permission is used as the command name, and v-permission is used directly
// By default, $permission is used as the instance method name, and this is $permission directly when used

// Alternatively, you can manually specify the directiveKey and instanceKey
Vue.use(install, {
    directiveKey: 'validate-permission',
    instanceKey: '$validatePermission',
});
```

In Vue components, you can directly access the permission validation functionality through `this.$permission`, also you can use `v-permission`:

``` vue
<template>
    <!-- Use built-in methods for permission validation -->
    <button v-permission:is="{ value: 'USER.PAGE' }">User List Permission</button>
    <!-- More usage of built-in methods -->
</template>

<script>
export default {
    methods: {
        checkPermission() {
            // Use this.$permission for permission validation
            console.log('Has user list permission:', this.$permission.is('USER.PAGE'));
        }
    }
}
</script>
```

### React or Functional Calls

In React or other frameworks that support functional programming, you can use `validate-permission` like this:

``` javascript
import { validate } from 'validate-permission';

// Check user permissions
console.log('Has user list permission:', validate.is('USER.PAGE'));
console.log('Has user add and edit permissions:', validate.all(['USER.ADD', 'USER.EDIT']));
// More usage of functional calls
```

The `validate-permission` tool provides developers with strong support in permission management with its flexibility and ease of use. Whether it's functional programming in React or creating complex permission directives in Vue, it can meet your needs.