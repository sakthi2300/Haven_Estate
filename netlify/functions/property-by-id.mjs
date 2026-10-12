import handler from '../../api/properties/[id].js'
import { adaptApiHandler } from '../lib/adapt-api-handler.js'

export default adaptApiHandler(handler, { propertyId: true })
export const config = { path: '/api/properties/:id' }
