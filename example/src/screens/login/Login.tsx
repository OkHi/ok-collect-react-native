/* eslint-disable curly */
import React from 'react';
import {H3, Item, Input, Text, Button} from 'native-base';
import {KeyboardAvoidingView, ScrollView, Platform} from 'react-native';
import styled from 'styled-components/native';
import {CommonActions, NavigationProp} from '@react-navigation/native';
import {Store} from '../../interfaces';

interface LoginState {
  firstName: string;
  lastName: string;
  phone: string;
}

export default class Login extends React.Component<
  {navigation: NavigationProp<any>; store: Store},
  LoginState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      phone: '',
    };
  }

  handleTextChange = (
    type: 'firstName' | 'lastName' | 'phone',
    text: string,
  ) => {
    switch (type) {
      case 'firstName':
        return this.setState({firstName: text});
      case 'lastName':
        return this.setState({lastName: text});
      case 'phone':
        return this.setState({
          phone: text.startsWith('+') || !text ? text : `+${text}`,
        });
      default:
        return;
    }
  };

  validateInput = (type: 'firstName' | 'lastName' | 'phone') => {
    const {firstName, lastName, phone} = this.state;
    switch (type) {
      case 'firstName':
        if (firstName === '') return null;
        if (firstName.length) return true;
        return false;
      case 'lastName':
        if (lastName === '') return null;
        if (lastName.length) return true;
        return false;
      case 'phone':
        if (phone === '') return null;
        const regex = /^\+[1-9]\d{6,14}$/;
        return regex.test(phone);
      default:
        return false;
    }
  };

  validateSubmit = () => {
    const firstNameValid = this.validateInput('firstName') ? true : false;
    const lastNameValid = this.validateInput('lastName') ? true : false;
    const phoneValid = this.validateInput('phone') ? true : false;
    return firstNameValid && lastNameValid && phoneValid;
  };

  handleSubmit = () => {
    const {navigation, store} = this.props;
    store.setUser(this.state);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'home'}],
      }),
    );
  };

  render() {
    const {firstName, lastName, phone} = this.state;
    return (
      <ScrollView style={scrollviewStyles}>
        <KeyboardAvoidingView behavior="padding">
          <LoginContainer style={containerBoxShadow}>
            <TitleContainer>
              <H3>Save your OkHi address</H3>
            </TitleContainer>
            <InputContainer>
              <InputBox regular valid={this.validateInput('firstName')}>
                <InputItem
                  placeholder="First name *"
                  autoCompleteType="off"
                  autoCorrect={false}
                  value={firstName}
                  onChangeText={text =>
                    this.handleTextChange('firstName', text)
                  }
                  placeholderTextColor="#9E9E9E"
                />
              </InputBox>
            </InputContainer>
            <InputContainer>
              <InputBox regular valid={this.validateInput('lastName')}>
                <InputItem
                  placeholder="Last name *"
                  autoCompleteType="off"
                  value={lastName}
                  onChangeText={text => this.handleTextChange('lastName', text)}
                  placeholderTextColor="#9E9E9E"
                />
              </InputBox>
            </InputContainer>
            <InputContainer>
              <InputBox regular valid={this.validateInput('phone')}>
                <InputItem
                  placeholder="Phone number *"
                  autoCompleteType="off"
                  keyboardType="phone-pad"
                  onChangeText={text => this.handleTextChange('phone', text)}
                  value={phone}
                  placeholderTextColor="#9E9E9E"
                />
              </InputBox>
              <HintText>Hint: +254700110590</HintText>
            </InputContainer>
            <InputContainer>
              <SubmitButton
                onPress={this.handleSubmit}
                block
                disabled={!this.validateSubmit()}
                active={this.validateSubmit()}>
                <Text>Next</Text>
              </SubmitButton>
            </InputContainer>
          </LoginContainer>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const scrollviewStyles = {
  backgroundColor: '#21838f',
  flex: 1,
};

const containerBoxShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.16,
  },
  android: {
    elevation: 4,
  },
});

const TitleContainer = styled.View`
  margin-bottom: 15px;
`;

const LoginContainer = styled.View`
  padding: 30px 15px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  background-color: white;
  margin: 15px;
  margin-bottom: 0;
  border-radius: 4px;
`;

const InputBox = styled(Item)`
  border-radius: 4px;
  height: 48px;
  border-color: ${(props: {valid?: boolean | null}) =>
    props.valid === true
      ? '#21838f'
      : props.valid === false
      ? 'red'
      : '#9E9E9E'};
`;

const InputItem = styled(Input)`
  font-size: 16px;
  font-weight: normal;
`;

const InputContainer = styled.View`
  width: 100%;
  margin-bottom: 15px;
`;

const SubmitButton = styled(Button)`
  background-color: ${(props: {active?: boolean}) =>
    props.active ? '#21838f' : '#BDBDBD'};
  height: 48px;
`;

const HintText = styled.Text`
  font-size: 12px;
  margin: 5px;
  margin-bottom: 0;
  opacity: 0.6;
  color: ${(props: {error?: boolean}) => (props.error ? 'red' : '#222')};
`;
