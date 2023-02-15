'use client'
import Tooltip from '@mui/material/Tooltip'
import styled from 'styled-components'
import Avatar from '@mui/material/Avatar'
import ChatIcon from '@mui/icons-material/Chat'
import MoreVerticalIcon from '@mui/icons-material/MoreVert'
import LogoutIcon from '@mui/icons-material/Logout'
import SearchIcon from '@mui/icons-material/Search'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { signOut } from 'firebase/auth'
import { auth, db } from 'config/firebase'
import EmailValidator from 'email-validator'
import { useCollection } from 'react-firebase-hooks/firestore'

import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from '@mui/material'
import { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { addDoc, collection, query, where } from 'firebase/firestore'
import { Conversation } from '@/types'
import ConversationSelect from './ConversationSelect'

const StyledContainer = styled.div`
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  border-right: 2px solid whitesmoke;
`
const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  padding: 15px;
  height: 80px;
  z-index: 1;
  border-bottom: 2px solid whitesmoke;
  background-color: #fff;
`
const StyledSearch = styled.div`
  display: flex;
  align-items: center;
`

const StyledUserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`
const StyledSearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`
const StyledSidebarButton = styled(Button)`
  width: 100%;
  border-top: 2px solid whitesmoke;
  border-bottom: 2px solid whitesmoke;
`

const Sidebar = () => {
  const [user, _loading, _error] = useAuthState(auth)
  const [isOpenNewConversationDialog, setIsOpenNewConversationDialog] =
    useState(false)

  const [recipientEmail, setRecipientEmail] = useState('')
  const isInvitingSelf = recipientEmail === user?.email

  const toggleNewConversationDialog = (isOpen: boolean) => {
    setIsOpenNewConversationDialog(isOpen)
    if (!isOpen) setRecipientEmail('')
  }

  const queryConversationForCurrentUser = user?.email
    ? query(
        collection(db, 'conversations'),
        where('users', 'array-contains', user.email)
      )
    : undefined

  const [conversationSnapshot, __loading, __error] = useCollection(
    queryConversationForCurrentUser
  )

  const isConversationAlreadyExists = (recipientEmail: string) => {
    return conversationSnapshot?.docs.find((conversation) => {
      return (conversation.data() as Conversation).users.includes(
        recipientEmail
      )
    })
  }

  const createConversation = async () => {
    if (!recipientEmail) return

    if (
      EmailValidator.validate(recipientEmail) &&
      !isInvitingSelf &&
      !isConversationAlreadyExists(recipientEmail)
    ) {
      //Add conversation user to db "conversations" collection
      //a conversation is between the currently logged in user and the invited user
      await addDoc(collection(db, 'conversations'), {
        users: [user?.email, recipientEmail],
      })
    }

    toggleNewConversationDialog(false)
  }

  const logout = () => {
    const logoutUser = async () => {
      try {
        await signOut(auth)
      } catch (error) {
        console.log('ERROR LOG', error)
      }
    }
    logoutUser()
  }

  return (
    <div>
      <StyledContainer>
        <StyledHeader>
          <Tooltip title={user?.email as string} placement='right'>
            <StyledUserAvatar src={user?.photoURL || ''} />
          </Tooltip>
          <div>
            <IconButton>
              <ChatIcon />
            </IconButton>
            <IconButton>
              <MoreVerticalIcon />
            </IconButton>
            <IconButton onClick={logout}>
              <LogoutIcon />
            </IconButton>
          </div>
        </StyledHeader>
        <StyledSearch>
          <SearchIcon />
          <StyledSearchInput placeholder='Search in conversation' />
        </StyledSearch>
        <StyledSidebarButton onClick={() => toggleNewConversationDialog(true)}>
          Start new a conversation
        </StyledSidebarButton>
        {
          /*List of conversation*/
          conversationSnapshot?.docs.map((conversation) => (
            <ConversationSelect
              key={conversation.id}
              id={conversation.id}
              conversationUser={(conversation.data() as Conversation).users}
            />
          ))
        }
        <Dialog
          open={isOpenNewConversationDialog}
          onClose={() => toggleNewConversationDialog(false)}>
          <DialogTitle>New conversation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a Google email address for a user you wish for chat
              with
            </DialogContentText>
            <TextField
              autoFocus
              label='Email Address'
              type='email'
              fullWidth
              variant='standard'
              value={recipientEmail}
              onChange={(event) => setRecipientEmail(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => toggleNewConversationDialog(false)}>
              Cancel
            </Button>
            <Button disabled={!recipientEmail} onClick={createConversation}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </StyledContainer>
    </div>
  )
}

export default Sidebar
