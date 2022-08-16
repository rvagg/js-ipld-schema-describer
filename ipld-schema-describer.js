import { kind } from './kind.js'

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
export function describe (obj) {
  const description = describeObject(obj, { types: {} })
  if (!Object.keys(description.schema.types).length) {
    // when `obj` is a terminal type, make up a typedef for that kind so we have
    // something to point to for our root rather than the plain typed kind

    // special case for links
    if (typeof description.root === 'object' && typeof description.root.link === 'object') {
      const name = 'Link'
      description.schema.types[name] = { link: {} }
      description.root = name
    } else if (typeof description.root === 'string') {
      const name = `${description.root}`
      // @ts-ignore
      description.schema.types[name] = { [description.root.toLowerCase()]: {} }
      description.root = name
      /* c8 ignore next 3 */
    } else {
      throw new Error('internal error')
    }
  }
  /* c8 ignore next 3 */
  if (typeof description.root !== 'string') {
    throw new Error('internal error')
  }
  return { schema: description.schema, root: description.root }
}

/**
 * @param {any} obj
 * @param {Schema} schema
 * @returns {{ schema: Schema, root: string|{ link: TypeDefnLink } }}
 */
function describeObject (obj, schema) {
  const objKind = kind(obj)
  let name = `${objKind.charAt(0).toUpperCase()}${objKind.substring(1)}`

  // terminals
  if (objKind === 'null' ||
      objKind === 'int' ||
      objKind === 'bool' ||
      objKind === 'float' ||
      objKind === 'string' ||
      objKind === 'bytes') {
    return { schema, root: name }
  }

  if (objKind === 'link') {
    return { schema, root: { link: {} } }
  }

  // 'map' || 'list'

  /** @type {{ fieldName: string, root: string|{ link: TypeDefnLink }}[]} */
  const fieldNames = []
  const entries = objKind === 'map'
    ? Object.entries(obj)
    : obj.map((/** @type {any} */ e, /** @type {number} */ i) => [`f${i}`, e])
  for (const [fieldName, value] of entries) {
    fieldNames.push({ fieldName, root: describeObject(value, schema).root })
  }
  let unique = true
  for (let i = 1; i < fieldNames.length; i++) {
    // this is a shallow assumption - that the name tells us the uniqueness, it doesn't
    // and this will have to be improved
    if (fieldNames[i].root !== fieldNames[i - 1].root) {
      unique = false
      break
    }
  }

  name = `${name}_1`
  /** @type {{ map: { keyType?: string, valueType?: string|{ link: TypeDefnLink } } }|{ list: { valueType?: string|{ link: TypeDefnLink } } }|{ struct: { fields: { [ k in string]: { type: string | { link: TypeDefnLink } } }, representation?: { tuple: {} } } } } */
  let type

  if (unique) { // a pure map or list
    const valueType = fieldNames.length ? fieldNames[0].root : 'Any'
    if (objKind === 'map') {
      type = { map: { keyType: 'String', valueType } }
    } else if (objKind === 'list') {
      type = { list: { valueType } }
      /* c8 ignore next 4 */
    } else {
      throw new Error(`Unexpected object kind: ${objKind}`)
    }
  } else { // a struct with varying types
    name = 'Struct_1'
    type = {
      struct: { fields: {} }
    }
    for (const field of fieldNames) {
      type.struct.fields[field.fieldName] = { type: field.root }
    }
    if (objKind === 'list') {
      type.struct.representation = { tuple: {} }
    }
  }

  while (schema.types[name]) {
    if (deepEqual(schema.types[name], type)) {
      break
    }
    name = name.split('_').map((s, i) => i ? parseInt(s, 10) + 1 : s).join('_')
  }
  // too hard
  // @ts-ignore
  schema.types[name] = type

  return { schema, root: name }
}

/**
 * @param {any} o1
 * @param {any} o2
 * @returns {boolean}
 */
function deepEqual (o1, o2) {
  const k1 = kind(o1)
  const k2 = kind(o2)
  /* c8 ignore next 3 */
  if (k1 !== k2) {
    return false
  }
  switch (k1) {
    /* c8 ignore next 1 */
    case 'bool':
    case 'string':
    case 'int':
    case 'float':
    case 'null':
      return o1 === o2
    case 'map':
      return deepEqual(Object.entries(o1), Object.entries(o2))
    case 'list':
      if (o1.length !== o2.length) {
        return false
      }
      for (let i = 0; i < o1.length; i++) {
        if (!deepEqual(o1[i], o2[i])) {
          return false
        }
      }
  }
  return true
}
