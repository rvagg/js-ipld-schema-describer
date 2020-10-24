import kind from './kind.js'

function describeObject (obj) {
  const description = describe(obj, {})
  if (!Object.keys(description.schema.types).length) {
    // when `obj` is a terminal type, make up a typedef for that kind so we have
    // something to point to for our root rather than the plain typed kind
    const name = `$${description.root}`
    description.schema.types[name] = { kind: description.root.toLowerCase() }
    description.root = name
  }
  return description
}

function describe (obj, schema) {
  if (!schema.types) {
    schema.types = {}
  }

  const objKind = kind(obj)
  let name = `${objKind.charAt(0).toUpperCase()}${objKind.substring(1)}`

  // terminals
  if (objKind === 'null' ||
      objKind === 'int' ||
      objKind === 'bool' ||
      objKind === 'float' ||
      objKind === 'string' ||
      objKind === 'link' ||
      objKind === 'bytes') {
    if (name === 'Link') {
      name = '&Any'
    }
    return { schema, root: name }
  }

  if (objKind === 'map' || objKind === 'list') {
    const fieldNames = []
    const entries = objKind === 'map' ? Object.entries(obj) : obj.map((e, i) => [`f${i}`, e])
    for (const [fieldName, value] of entries) {
      fieldNames.push({ fieldName, root: describe(value, schema).root })
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

    name = `$${name}_1`
    let type

    if (unique) { // a pure map or list
      type = { kind: objKind }
      if (objKind === 'map') {
        type.keyType = 'String'
      }
      if (fieldNames.length) {
        type.valueType = fieldNames[0].root
      } else {
        type.valueType = 'Any'
      }
    } else { // a struct with varying types
      name = '$Struct_1'
      type = {
        kind: 'struct',
        fields: {}
      }
      for (const field of fieldNames) {
        type.fields[field.fieldName] = { type: field.root }
      }
      if (objKind === 'list') {
        type.representation = { tuple: {} }
      }
    }

    while (schema.types[name]) {
      if (deepEqual(schema.types[name], type)) {
        break
      }
      name = name.split('_').map((s, i) => i ? parseInt(s, 10) + 1 : s).join('_')
    }
    schema.types[name] = type
    // merge(schema, fieldNames[0].description.schema)
    return { schema, root: name }
  }

  throw new Error('Too complicated, can\'t deal with this')
}

function deepEqual (o1, o2) {
  const k1 = kind(o1)
  const k2 = kind(o2)
  if (k1 !== k2) {
    return false
  }
  switch (k1) {
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

export default describeObject
