import { expect, test } from 'vitest'
import { Slug } from './slug'

test('it should be able to create a new slug from test', () => {
  const slug = Slug.createFromtext('test question')

  expect(slug.value).toEqual('test-question')
})
