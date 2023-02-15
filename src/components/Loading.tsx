import styled from "styled-components"
import Image from 'next/image'
import WhatsAppLogo from '../../assets/whatsapplogo.png'
import { CircularProgress } from "@mui/material"

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`
const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`

const Loading = () => {
  return (
    <div>

    <StyledContainer>
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
      <CircularProgress />
    </StyledContainer>
    </div>
  )
}

export default Loading