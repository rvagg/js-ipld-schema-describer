/* eslint-env mocha */

import { describe as describeSchema } from 'ipld-schema-describer'
import chai from 'chai'

const { assert } = chai

describe('Errors', () => {
  it('bad kind', () => {
    assert.throws(() => describeSchema(undefined), /Unknown IPLD kind for value: undefined/)
  })
})
