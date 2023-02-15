import { useRecipient } from '@/hooks/useRecipient'
import { Conversation } from '@/types'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import RecipientAvatar from './RecipientAvatar'

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-all;

  :hover {
    background-color: #e9eaeb;
  }
`

const ConversationSelect = ({
  id,
  conversationUser,
}: {
  id: string
  conversationUser: Conversation['users']
}) => {
  const { recipient, recipientEmail } = useRecipient(conversationUser)

  const router = useRouter()

  const onSelectConversation = () => {
    router.push(`/conversations/${id}`)
  }

  return (
    <div>

    <StyledContainer onClick={onSelectConversation}>
      <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail} />
      {recipientEmail}
    </StyledContainer>
    </div>
  )
}

export default ConversationSelect
