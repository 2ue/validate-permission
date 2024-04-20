export type Permissions = string[]
export type IsFunc = (value: string, permissions?: Permissions) => boolean;
export type AtLeastFunc = (value: { value: string[], n: number }, permissions?: Permissions) => boolean;
export type AllFunc = (values: string[], permissions?: Permissions) => boolean;