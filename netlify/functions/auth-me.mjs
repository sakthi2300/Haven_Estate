import handler from '../../api/auth/me.js'
import { adaptApiHandler } from '../lib/adapt-api-handler.js'

export default adaptApiHandler(handler)
export const config = { path: '/api/auth/me' }
