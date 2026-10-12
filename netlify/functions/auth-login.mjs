import handler from '../../api/auth/login.js'
import { adaptApiHandler } from '../lib/adapt-api-handler.js'

export default adaptApiHandler(handler)
export const config = { path: '/api/auth/login' }
