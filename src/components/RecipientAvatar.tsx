import { useRecipient } from '@/hooks/useRecipient'
import { AppUser } from '@/types'
import { Avatar } from '@mui/material'
import styled from 'styled-components'

interface Props {
  recipient: AppUser | undefined
  recipientEmail: string | undefined
}

type UseRecipientReturnType = ReturnType<typeof useRecipient>

const StyledAvatar = styled(Avatar)`
  margin: 5px 15px;
`

const RecipientAvatar = ({
  recipient,
  recipientEmail,
}: UseRecipientReturnType) => {
  return (
    <div>
      {recipient?.photoURL ? (
        <StyledAvatar src={recipient.photoURL} />
      ) : (
        <StyledAvatar>
          {recipientEmail && recipientEmail[0].toUpperCase()}
        </StyledAvatar>
      )}
    </div>
  )
}

export default RecipientAvatar
