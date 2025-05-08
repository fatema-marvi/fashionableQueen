import { createClient } from 'next-sanity';

export const client = createClient({
  projectId:"0faffs5n",
  dataset:"production",
  apiVersion: "2023-10-01", // use current UTC date - see "specifying API version"!
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

export { createClient }
