import kind from './kind.js'

function describe (obj, schema = {}) {
  if (!schema.types) {
    schema.types = {}
  }

  const objKind = kind(obj)

  // terminals
  if (objKind === 'null' ||
      objKind === 'int' ||
      objKind === 'bool' ||
      objKind === 'float' ||
      objKind === 'string' ||
      objKind === 'bytes') {
    const name = `$${objKind}_1`
    schema.types[name] = { kind: objKind }
    return { schema, root: name }
  }

  if (objKind === 'map' || objKind === 'list') {
    const fieldDescriptions = []
    const entries = objKind === 'map' ? Object.entries(obj) : obj.map((e, i) => [i, e])
    for (const [fieldName, value] of entries) {
      fieldDescriptions.push({ fieldName, description: describe(value) })
    }
    let unique = true
    for (let i = 1; i < fieldDescriptions.length; i++) {
      // this is a shallow assumption - that the name tells us the uniqueness, it doesn't
      // and this will have to be improved
      if (fieldDescriptions[i].description.root !== fieldDescriptions[i - 1].description.root) {
        unique = false
        break
      }
    }

    if (unique) { // a pure map
      const name = `$${objKind}_1`
      schema.types[name] = { kind: objKind }
      if (objKind === 'map') {
        schema.types[name].keyType = 'String'
      }
      schema.types[name].valueType = fieldDescriptions[0].description.root
      merge(schema, fieldDescriptions[0].description.schema)
      return { schema, root: name }
    } else { // a struct with varying types
      schema.types.$struct_1 = {
        kind: 'struct',
        fields: fieldDescriptions.reduce((p, ed) => {
          p[ed.fieldName] = { type: ed.description.root }
          return p
        }, {})
      }
      if (objKind === 'list') {
        schema.types.$struct_1.representation = { tuple: '' }
      }
      for (const { description } of fieldDescriptions) {
        merge(schema, description.schema)
      }
      return { schema, root: '$struct_1' }
    }
  }

  // return { schema, root: 'nope' }
  throw new Error('Too complicated, can\'t deal with this')
}

function merge (s1, s2) {
  for (const [typeName, typeDef] of Object.entries(s2.types)) {
    if (s1.types[typeName]) {
      if (!deepEqual(s1.types[typeName], typeDef)) {
        throw new Error('Can\'t currently deal with same name but different types')
      }
    } else {
      s1.types[typeName] = typeDef
    }
  }
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

export default { describe }
