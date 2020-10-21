# ipld-schema-describe

Provide an object that suits the Data Model and get a naive IPLD Schema description of it.

## Example

```js
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
```

Output:

```
type $Struct_1 struct {
  f0 Int
  f1 String
  f2 Bool
} representation tuple

type $List_1 [Int]

type $Struct_2 struct {
  foo $Struct_1
  bar $List_1
  baz String
}

Root:  $Struct_2
```

Note that **[ipld-schema](https://ghub.io/ipld-schema)** is needed to print the IPLD Schema language since this library only provides the object form.

## License & Copyright

Copyright 2020 Rod Vagg

Licensed under Apache 2.0 ([LICENSE-APACHE](LICENSE-APACHE) / http://www.apache.org/licenses/LICENSE-2.0)
