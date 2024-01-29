/* eslint-env mocha */

import { describe as describeSchema } from 'ipld-schema-describer'
import { assert } from 'chai'

const fauxCID = {}
fauxCID.asCID = fauxCID

function verify (obj, expected) {
  const description = describeSchema(obj)
  assert.deepEqual(description, expected)
}

describe('Basics', () => {
  it('null', () => {
    const expected = { schema: { types: { Null: { null: {} } } }, root: 'Null' }
    verify(null, expected)
  })

  it('bool', () => {
    const expected = { schema: { types: { Bool: { bool: {} } } }, root: 'Bool' }
    verify(true, expected)
    verify(false, expected)
  })

  it('int', () => {
    const expected = { schema: { types: { Int: { int: {} } } }, root: 'Int' }
    verify(101, expected)
    verify(-101, expected)
    verify(0, expected)
  })

  it('float', () => {
    const expected = { schema: { types: { Float: { float: {} } } }, root: 'Float' }
    verify(1.01, expected)
    verify(-1.01, expected)
  })

  it('string', () => {
    const expected = { schema: { types: { String: { string: {} } } }, root: 'String' }
    verify('a string', expected)
    verify('', expected)
  })

  it('link', () => {
    const expected = { schema: { types: { Link: { link: {} } } }, root: 'Link' }
    verify(fauxCID, expected)
  })

  it('bytes', () => {
    const expected = { schema: { types: { Bytes: { bytes: {} } } }, root: 'Bytes' }
    verify(Uint8Array.from([1, 3, 4, 5]), expected)
    verify(Uint8Array.from([]), expected)
  })

  it('map', () => {
    const obj = { s1: 'a string', s2: 'second string', s3: 'third string' }
    const expected = {
      schema: {
        types: {
          Map_1: {
            map: {
              keyType: 'String',
              valueType: 'String'
            }
          }
        }
      },
      root: 'Map_1'
    }
    verify(obj, expected)
  })

  it('empty map', () => {
    const obj = {}
    const expected = {
      schema: {
        types: {
          Map_1: {
            map: {
              keyType: 'String',
              valueType: 'Any'
            }
          }
        }
      },
      root: 'Map_1'
    }
    verify(obj, expected)
  })

  it('struct (map repr)', () => {
    const obj = { s: 'a string', i: 101, l: fauxCID }
    const expected = {
      schema: {
        types: {
          Struct_1: {
            struct: {
              fields: {
                s: { type: 'String' },
                i: { type: 'Int' },
                l: { type: { link: {} } }
              }
            }
          }
        }
      },
      root: 'Struct_1'
    }
    verify(obj, expected)
  })

  it('list', () => {
    const obj = ['a string', 'second string', 'third string']
    const expected = {
      schema: {
        types: {
          List_1: {
            list: {
              valueType: 'String'
            }
          }
        }
      },
      root: 'List_1'
    }
    verify(obj, expected)
  })

  it('empty list', () => {
    const obj = []
    const expected = {
      schema: {
        types: {
          List_1: {
            list: {
              valueType: 'Any'
            }
          }
        }
      },
      root: 'List_1'
    }
    verify(obj, expected)
  })

  it('struct (list repr)', () => {
    const obj = ['a string', 101, false, null]
    const expected = {
      schema: {
        types: {
          Struct_1: {
            struct: {
              fields: {
                f0: { type: 'String' },
                f1: { type: 'Int' },
                f2: { type: 'Bool' },
                f3: { type: 'Null' }
              },
              representation: { tuple: {} }
            }
          }
        }
      },
      root: 'Struct_1'
    }
    verify(obj, expected)
  })
})

describe('Complex', () => {
  it('list of lists', () => {
    const sa = ['a string', 'second string', 'third string']
    const obj = [sa, sa.slice(), sa.slice()]
    const expected = {
      schema: {
        types: {
          List_1: {
            list: {
              valueType: 'String'
            }
          },
          List_2: {
            list: {
              valueType: 'List_1'
            }
          }
        }
      },
      root: 'List_2'
    }
    verify(obj, expected)
  })

  it('map of maps', () => {
    const sm = { s1: 'a string', s2: 'second string', s3: 'third string' }
    const obj = { sm1: sm, sm2: Object.assign({}, sm), sm3: Object.assign({}, sm) }
    const expected = {
      schema: {
        types: {
          Map_1: {
            map: {
              keyType: 'String',
              valueType: 'String'
            }
          },
          Map_2: {
            map: {
              keyType: 'String',
              valueType: 'Map_1'
            }
          }
        }
      },
      root: 'Map_2'
    }
    verify(obj, expected)
  })

  it('struct of structs', () => {
    const obj = ['a string', 101, ['s', false], ['', true]]
    const expected = {
      schema: {
        types: {
          Struct_1: {
            struct: {
              fields: {
                f0: { type: 'String' },
                f1: { type: 'Bool' }
              },
              representation: { tuple: {} }
            }
          },
          Struct_2: {
            struct: {
              fields: {
                f0: { type: 'String' },
                f1: { type: 'Int' },
                f2: { type: 'Struct_1' },
                f3: { type: 'Struct_1' }
              },
              representation: { tuple: {} }
            }
          }
        }
      },
      root: 'Struct_2'
    }
    verify(obj, expected)
  })
})
