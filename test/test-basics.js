/* eslint-env mocha */

import SchemaDescribe from 'ipld-schema-describe'
import chai from 'chai'

const { assert } = chai

function verify (obj, expected) {
  const description = SchemaDescribe.describe(obj)
  assert.deepEqual(description, expected)
}

describe('Basics', () => {
  it('null', () => {
    const expected = { schema: { types: { $null_1: { kind: 'null' } } }, root: '$null_1' }
    verify(null, expected)
  })

  it('bool', () => {
    const expected = { schema: { types: { $bool_1: { kind: 'bool' } } }, root: '$bool_1' }
    verify(true, expected)
    verify(false, expected)
  })

  it('int', () => {
    const expected = { schema: { types: { $int_1: { kind: 'int' } } }, root: '$int_1' }
    verify(101, expected)
    verify(-101, expected)
    verify(0, expected)
  })

  it('float', () => {
    const expected = { schema: { types: { $float_1: { kind: 'float' } } }, root: '$float_1' }
    verify(1.01, expected)
    verify(-1.01, expected)
  })

  it('string', () => {
    const expected = { schema: { types: { $string_1: { kind: 'string' } } }, root: '$string_1' }
    verify('a string', expected)
    verify('', expected)
  })

  it('bytes', () => {
    const expected = { schema: { types: { $bytes_1: { kind: 'bytes' } } }, root: '$bytes_1' }
    verify(Uint8Array.from([1, 3, 4, 5]), expected)
    verify(Uint8Array.from([]), expected)
  })

  it('map', () => {
    const obj = { s1: 'a string', s2: 'second string', s3: 'third string' }
    const expected = {
      schema: {
        types: {
          $string_1: { kind: 'string' },
          $map_1: {
            kind: 'map',
            keyType: 'String',
            valueType: '$string_1'
          }
        }
      },
      root: '$map_1'
    }
    verify(obj, expected)
  })

  it('struct (map repr)', () => {
    const obj = { s: 'a string', i: 101 }
    const expected = {
      schema: {
        types: {
          $int_1: { kind: 'int' },
          $string_1: { kind: 'string' },
          $struct_1: {
            kind: 'struct',
            fields: {
              s: { type: '$string_1' },
              i: { type: '$int_1' }
            }
          }
        }
      },
      root: '$struct_1'
    }
    verify(obj, expected)
  })

  it('list', () => {
    const obj = ['a string', 'second string', 'third string']
    const expected = {
      schema: {
        types: {
          $string_1: { kind: 'string' },
          $list_1: {
            kind: 'list',
            valueType: '$string_1'
          }
        }
      },
      root: '$list_1'
    }
    verify(obj, expected)
  })

  it('struct (list repr)', () => {
    const obj = ['a string', 101, false, null]
    const expected = {
      schema: {
        types: {
          $string_1: { kind: 'string' },
          $int_1: { kind: 'int' },
          $bool_1: { kind: 'bool' },
          $null_1: { kind: 'null' },
          $struct_1: {
            kind: 'struct',
            fields: {
              0: { type: '$string_1' },
              1: { type: '$int_1' },
              2: { type: '$bool_1' },
              3: { type: '$null_1' }
            },
            representation: { tuple: '' }
          }
        }
      },
      root: '$struct_1'
    }
    verify(obj, expected)
  })
})
