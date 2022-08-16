/**
 * @typedef {import('ipld-schema/schema-schema').Schema} Schema
 * @typedef {import('ipld-schema/schema-schema').TypeDefnLink} TypeDefnLink
 * @typedef {import('ipld-schema/schema-schema').TypeDefnList} TypeDefnList
 * @typedef {import('ipld-schema/schema-schema').TypeDefnMap} TypeDefnMap
 */
/**
 * @param {any} obj
 * @returns {{ schema: Schema, root: string }}
 */
export function describe(obj: any): {
    schema: Schema;
    root: string;
};
export type Schema = import('ipld-schema/schema-schema').Schema;
export type TypeDefnLink = import('ipld-schema/schema-schema').TypeDefnLink;
export type TypeDefnList = import('ipld-schema/schema-schema').TypeDefnList;
export type TypeDefnMap = import('ipld-schema/schema-schema').TypeDefnMap;
//# sourceMappingURL=ipld-schema-describer.d.ts.map