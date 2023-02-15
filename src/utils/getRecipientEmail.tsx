import { Conversation } from '@/types'
import { User } from 'firebase/auth'

export const getRecipientEmail = (
  conversationUser: Conversation['users'],
  user?: User | null
) => conversationUser.find((emailUser) => user?.email !== emailUser)
