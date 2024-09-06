export type PermissionValue = string | number
export type Permissions = PermissionValue[]
export type IsFunc = (value: PermissionValue, permissions?: Permissions) => boolean;
export type AtLeastFunc = (value: { value: PermissionValue[], n: number }, permissions?: Permissions) => boolean;
export type AllFunc = (values: PermissionValue[], permissions?: Permissions) => boolean;
export type InstallOptions = { directiveKey?: string, instanceKey?: string }