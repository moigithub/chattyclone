import { NextApiResponseServerIO } from '@/types'
import { NextApiRequest } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  return res.json({ a: 1 })
}
