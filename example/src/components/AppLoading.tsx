import React from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';

export default function AppLoading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color="#00ACC1" />
      <Text style={styles.text}>Checking a few things...</Text>
    </View>
  );
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
