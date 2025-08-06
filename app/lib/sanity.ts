import { createClient } from 'next-sanity';

const projectId = 'r05qlfvk';
const dataset = 'production'
const apiVersion = '2024-01-03'

export const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true

})