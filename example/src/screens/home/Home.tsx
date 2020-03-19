import React from 'react';
import {Container, Fab, Icon} from 'native-base';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Fab style={{backgroundColor: '#21838F'}}>
          <Icon name="add" fontSize={32} />
        </Fab>
      </Container>
    );
  }
}
