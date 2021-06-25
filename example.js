import { describe } from 'ipld-schema-describer'
// @ts-ignore
import schemaPrint from 'ipld-schema/print.js'

const obj = {
  foo: [1, 'one', true],
  bar: [1, 2, 3, 4],
  baz: 'baz'
}

const { schema, root } = describe(obj)
console.log(schemaPrint(schema))
console.log('\nRoot:', root)
