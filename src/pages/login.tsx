import { WhatsApp } from '@mui/icons-material'
import Button from '@mui/material/Button'
import Head from 'next/head'
import Image from 'next/image'
import styled from 'styled-components'
import WhatsAppLogo from '../../assets/whatsapplogo.png'
import { useSignInWithGoogle } from 'react-firebase-hooks/auth'
import { auth } from 'config/firebase'

const StyledContainer = styled.div`
  height: 100vh;
  display: grid;
  place-items: center;
  background-color: whitesmoke;
`

const StyledLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 100px;
  border-radius: 5px;
  box-shadow: 10px 10px 5px -6px rgba(159, 155, 176, 0.75);
  -webkit-box-shadow: 10px 10px 5px -6px rgba(159, 155, 176, 0.75);
  -moz-box-shadow: 10px 10px 5px -6px rgba(159, 155, 176, 0.75);
`

const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`

const Login = () => {
  const [signInWithGoogle, _user, _loading, _error] = useSignInWithGoogle(auth)

  const signIn = () => {
    signInWithGoogle()
  }

  return (
    <div>
      <StyledContainer>
        <Head>Login</Head>
        <StyledLoginContainer>
          <StyledImageWrapper>
            <Image
              src={WhatsAppLogo}
              alt='Chat-app'
              style={{
                height: '200px',
                width: '200px',
              }}
            />
          </StyledImageWrapper>
          <Button variant='outlined' onClick={signIn}>
            Login with Google
          </Button>
        </StyledLoginContainer>
      </StyledContainer>
    </div>
  )
}

export default Login
