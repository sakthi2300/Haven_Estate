import handler from '../../api/properties/index.js'
import { adaptApiHandler } from '../lib/adapt-api-handler.js'

export default adaptApiHandler(handler)
export const config = { path: '/api/properties' }
