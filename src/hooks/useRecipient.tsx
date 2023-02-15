import { AppUser, Conversation } from '@/types'
import { getRecipientEmail } from '@/utils/getRecipientEmail'
import { auth, db } from 'config/firebase'
import { collection, query, where } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'

export const useRecipient = (conversationUsers: Conversation['users']) => {
  const [user, __loading, __error] = useAuthState(auth)

  //get recipient email
  const recipientEmail = getRecipientEmail(conversationUsers, user)

  //get recipient avatar
  const queryGetRecipientEmail = query(
    collection(db, 'Users'),
    where('email', '==', recipientEmail)
  )
  const [recipientsSnapshot, _loading, _error] = useCollection(
    queryGetRecipientEmail
  )

  //recipientsSnapshot?.doc could be an empty array. leading to docs[0] being undefined
  //so we have to force ?. after docs[0] because there is no data() on 'undefined'

  const recipient = recipientsSnapshot?.docs[0]?.data() as AppUser | undefined

  return {
    recipient,
    recipientEmail,
  }
}
