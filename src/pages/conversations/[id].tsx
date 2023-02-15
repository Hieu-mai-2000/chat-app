import ConversationScreen from '@/components/ConversationScreen'
import Sidebar from '@/components/Sidebar'
import { Conversation, IMessage } from '@/types'
import {
  generateQueryGetMessage,
  transformMessage,
} from '@/utils/getMessagesInConversation'
import { getRecipientEmail } from '@/utils/getRecipientEmail'
import { auth, db } from 'config/firebase'
import { doc, getDoc, getDocs } from 'firebase/firestore'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'

const StyledContainer = styled.div`
  display: flex;
`
const StyledConversationContainer = styled.div`
  flex-grow: 100;
  flex: 1;
  overflow: scroll;
  height: 100vh;
  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`

interface Props {
  conversation: Conversation
  messages: IMessage[]
}

const Conversation = ({ conversation, messages }: Props) => {
  const [user, __loading, __error] = useAuthState(auth)

  return (
    <div>
      <StyledContainer>
        <Head>
          <title>
            Conversation with {getRecipientEmail(conversation.users, user)}
          </title>
        </Head>

        <Sidebar />

        <StyledConversationContainer>
          <ConversationScreen conversation={conversation} messages={messages} />
        </StyledConversationContainer>
      </StyledContainer>
    </div>
  )
}

export default Conversation

export const getServerSideProps: GetServerSideProps<
  Props,
  { id: string }
> = async (context) => {
  const conversationId = context.params?.id

  //get conversation, to know who we are chatting with
  const conversationRef = doc(db, 'conversations', conversationId as string)
  const conversationSnapShot = await getDoc(conversationRef)

  //get all message between logged in user and recipient in this conversation
  const queryMessage = generateQueryGetMessage(conversationId)

  const messageSnapshot = await getDocs(queryMessage)

  const messages = messageSnapshot.docs.map((messageDoc) =>
    transformMessage(messageDoc)
  )

  return {
    props: {
      conversation: conversationSnapShot.data() as Conversation,
      messages,
    },
  }
}
