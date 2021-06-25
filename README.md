# ipld-schema-describer

Describe JavaScript object forms using [IPLD Schemas](https://specs.ipld.io/schemas/).

## Example

```js
import { describe } from 'ipld-schema-describer'
import schemaPrint from 'ipld-schema/print.js'

const obj = {
  foo: [1, 'one', true],
  bar: [1, 2, 3, 4],
  baz: 'baz'
}

const { schema, root } = describe(obj)
console.log(schemaPrint(schema))
console.log('\nRoot:', root)
```

Prints:

```
type Struct_1 struct {
  f0 Int
  f1 String
  f2 Bool
} representation tuple

type List_1 [Int]

type Struct_2 struct {
  foo Struct_1
  bar List_1
  baz String
}

Root: Struct_2
```

## Limitations

Objects must conform to the [IPLD Data Model](https://docs.ipld.io/#the-data-model), so `undefined` is not supported and complex objects such as `Date`, `RegExp` and others should be avoided. Circular references are also not supported.

The resulting IPLD Schema is only able to describe the raw representation layout. IPLD Schemas are capable of describing complex shapes that cannot be inferred without additional information. Unions and Enums in particular are not able to be inferred. The Schema output from this library can be used as the basis of the formation of a more correct and concice Schema for any data layout. Read more in the [IPLD Schemas documentation](https://specs.ipld.io/schemas/).

## License & Copyright

Copyright 2020 Rod Vagg

Licensed under Apache 2.0 ([LICENSE-APACHE](LICENSE-APACHE) / http://www.apache.org/licenses/LICENSE-2.0)
