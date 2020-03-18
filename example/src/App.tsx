import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './screens/home/Home';
import InitScreen from './screens/init/Init';

const Stack = createStackNavigator();

export default function() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="init"
          component={InitScreen}
          options={{
            header: () => {
              return null;
            },
          }}
        />
        <Stack.Screen name="home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
