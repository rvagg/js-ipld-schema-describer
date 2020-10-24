/* eslint-env mocha */

import SchemaDescriber from 'ipld-schema-describer'
import chai from 'chai'

const { assert } = chai

describe('Errors', () => {
  it('bad kind', () => {
    assert.throws(() => SchemaDescriber.describe(undefined), /Unknown IPLD kind for value: undefined/)
  })
})
