import { IMessage } from '@/types'
import { auth } from 'config/firebase'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'

interface Props {
  key: string
  message: IMessage
}

const StyledMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledMessage = styled.div`
  padding: 10px;
  margin: 5px;
  align-self: flex-end;
  background-color: greenyellow;
  border-radius: 5px;
`

const Message = ({ key, message }: Props) => {
  const [user, _loading, _error] = useAuthState(auth)

  return (
    <div>
      <StyledMessageContainer>
        {user?.email === message.user ? (
          <StyledMessage key={key}>{message.text}</StyledMessage>
        ) : (
          <StyledMessage
            key={key}
            style={{ alignSelf: 'flex-start', backgroundColor: 'white' }}>
            {message.text}
          </StyledMessage>
        )}
      </StyledMessageContainer>
    </div>
  )
}

export default Message
