import schemaDescribe from 'ipld-schema-describe'
import schemaPrint from 'ipld-schema/print.js'

const obj = {
  foo: [1, 'one', true],
  bar: [1, 2, 3, 4],
  baz: 'baz'
}

const { schema, root } = schemaDescribe(obj)
console.log(schemaPrint(schema))
console.log('\nRoot: ', root)