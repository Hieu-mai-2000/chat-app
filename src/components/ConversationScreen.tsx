import { useRecipient } from '@/hooks/useRecipient'
import { Conversation, IMessage } from '@/types'
import {
  convertFirestoreTimestampToString,
  generateQueryGetMessage,
} from '@/utils/getMessagesInConversation'
import {
  AttachFile,
  InsertEmoticon,
  Mic,
  MoreVert,
  Send,
} from '@mui/icons-material'
import { IconButton, Input } from '@mui/material'
import { auth, db } from 'config/firebase'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import styled from 'styled-components'
import RecipientAvatar from './RecipientAvatar'
import { transformMessage } from '../utils/getMessagesInConversation'
import Message from './Message'
import {
  ChangeEventHandler,
  FormEvent,
  KeyboardEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore'

interface Props {
  conversation: Conversation
  messages: IMessage[]
}

const StyledHeader = styled.div`
  padding: 11px;
  height: 80px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  right: 0;
  z-index: 100;
  background-color: white;
  border-bottom: 2px solid whitesmoke;
`
const StyledHeaderInfo = styled.div`
  flex-grow: 1;

  > h3 {
    margin-top: 0;
    margin-bottom: 3px;
  }

  > span {
    font-size: 14px;
    color: gray;
  }
`

const StyledH3 = styled.div`
  word-break: break-all;
`

const StyledHearIcons = styled.div`
  justify-items: end;
`

const StyledMessageContainer = styled.div`
  min-height: 90vh;
  background-color: #e5ded8;
  padding: 30px;
`

const StyledInputContainer = styled.div`
  display: flex;
  position: sticky;
  align-items: center;
  bottom: 0;
  padding: 15px;
  background-color: whitesmoke;
`

const StyledInput = styled(Input)`
  flex: 1;
  margin: 0 5px;
`

const EndOfMessagesForAutoScroll = styled.div`
  margin-bottom: 30px;
`

const ConversationScreen = ({ conversation, messages }: Props) => {
  const [newMessage, setNewMessage] = useState('')
  const [user, _loading, _error] = useAuthState(auth)
  const conversationUsers = conversation.users
  const { recipient, recipientEmail } = useRecipient(conversationUsers)

  const router = useRouter()
  const conversationId = router.query.id

  const getQueryMessage = generateQueryGetMessage(conversationId as string)
  const [messageSnapshot, messageLoading, __error] =
    useCollection(getQueryMessage)

  const onChangeMessage: ChangeEventHandler<HTMLInputElement> = (event) =>
    setNewMessage(event.target.value)

  const endMessageRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
    endMessageRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  const addMessageToDbAndUpdateLastSeen = async () => {
    await setDoc(
      doc(db, 'Users', user?.email as string),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    ) //just update is changed

    //add new message to 'messages' collection
    await addDoc(collection(db, 'messages'), {
      conversation_id: conversationId,
      sent_at: serverTimestamp(),
      text: newMessage,
      user: user?.email,
    })

    //reset input
    setNewMessage('')

    //scroll Bottom
    scrollToBottom()
  }

  const sendMessageOnClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    if (newMessage === '') return
    addMessageToDbAndUpdateLastSeen()
  }

  const onKeyDownMessage = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      event.preventDefault()
      if (newMessage === '') return
      addMessageToDbAndUpdateLastSeen()
    }
  }

  const showMessage = () => {
    //if front-end loading behind the scenes, display message retrieved from NEXT SSR (passed down form [id].tsx)
    if (messageLoading) {
      return messages.map((message, index) => (
        <Message key={message.id} message={message} />
      ))
    }

    //if front-end has finished loading message, so now we have messageSnapshot
    if (messageSnapshot) {
      return messageSnapshot.docs.map((message, index) => (
        <Message key={message.id} message={transformMessage(message)} />
      ))
    }

    return null
  }

  return (
    <div>
      <StyledHeader>
        <RecipientAvatar
          recipient={recipient}
          recipientEmail={recipientEmail}
        />
        <StyledHeaderInfo>
          <StyledH3>{recipientEmail}</StyledH3>
          {recipient && (
            <span>
              {' '}
              Last since : {''}
              {convertFirestoreTimestampToString(recipient.lastSeen)}{' '}
            </span>
          )}
        </StyledHeaderInfo>

        <StyledHearIcons>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </StyledHearIcons>
      </StyledHeader>

      <StyledMessageContainer>
        {showMessage()}
        {/* for auto scroll to the end when a new message is sent */}
        <EndOfMessagesForAutoScroll ref={endMessageRef} />
      </StyledMessageContainer>

      <StyledInputContainer>
        <InsertEmoticon />
        <StyledInput
          value={newMessage}
          onChange={onChangeMessage}
          onKeyDown={onKeyDownMessage}
        />
        <IconButton onClick={sendMessageOnClick} disabled={!newMessage}>
          <Send />
        </IconButton>
        <IconButton>
          <Mic />
        </IconButton>
      </StyledInputContainer>
    </div>
  )
}

export default ConversationScreen
