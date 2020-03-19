import React from 'react';
import {Container, Fab, Icon} from 'native-base';
import {NavigationProp} from '@react-navigation/native';

export default class HomeScreen extends React.Component<{
  navigation: NavigationProp<any>;
}> {
  constructor(props: any) {
    super(props);
  }

  handleFabPress = () => {
    this.props.navigation.navigate('Add address');
  };

  render() {
    return (
      <Container>
        <Fab style={{backgroundColor: '#21838F'}} onPress={this.handleFabPress}>
          <Icon name="add" fontSize={32} />
        </Fab>
      </Container>
    );
  }
}
