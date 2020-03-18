import React from 'react';
import {Button, Text, Container, H3} from 'native-base';
import {View} from 'react-native';
import styled from 'styled-components/native';

export default function Login() {
  return (
    <Container>
      <LoginContainer>
        <H3>Please log in to continue</H3>
      </LoginContainer>
    </Container>
  );
}

const LoginContainer = styled.View`
  padding: 15px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin: 15px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;
