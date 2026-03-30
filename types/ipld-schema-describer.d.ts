/**
 * @typedef {import('@ipld/schema/schema-schema.js').Schema} Schema
 * @typedef {import('@ipld/schema/schema-schema.js').TypeDefnLink} TypeDefnLink
 * @typedef {import('@ipld/schema/schema-schema.js').TypeDefnList} TypeDefnList
 * @typedef {import('@ipld/schema/schema-schema.js').TypeDefnMap} TypeDefnMap
 */
/**
 * @param {any} obj
 * @returns {{ schema: Schema, root: string }}
 */
export function describe(obj: any): {
    schema: Schema;
    root: string;
};
export type Schema = import("@ipld/schema/schema-schema.js").Schema;
export type TypeDefnLink = import("@ipld/schema/schema-schema.js").TypeDefnLink;
export type TypeDefnList = import("@ipld/schema/schema-schema.js").TypeDefnList;
export type TypeDefnMap = import("@ipld/schema/schema-schema.js").TypeDefnMap;
//# sourceMappingURL=ipld-schema-describer.d.ts.map