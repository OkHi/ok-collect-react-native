import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {CommonActions, NavigationProp} from '@react-navigation/native';

class InitScreen extends React.Component<{navigation: NavigationProp<{}>}> {
  private timer: NodeJS.Timeout | null;

  constructor(props: any) {
    super(props);
    this.timer = null;
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'home'}],
        }),
      );
    }, 2000);
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#00ACC1" />
        <Text style={styles.text}>Checking a few things...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 15,
    fontSize: 12,
  },
});

export default InitScreen;
