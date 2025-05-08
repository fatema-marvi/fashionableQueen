import { type SchemaTypeDefinition } from 'sanity'
import stitch from './stitch'
import unstitch from './unstitch'
import trouser from './trouser'
import product from './product'
import review from './review'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [stitch, unstitch, trouser, product, review]
}
