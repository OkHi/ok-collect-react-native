import AsyncStorage from '@react-native-community/async-storage';
import {User} from '../interfaces';
export default class Repository {
  async getUser(): Promise<null | {
    firstName: string;
    lastName: string;
    phone: string;
  }> {
    try {
      const user = await AsyncStorage.getItem('user');
      if (!user) {
        return null;
      }
      return JSON.parse(user);
    } catch (error) {
      return null;
    }
  }

  async setUser(user: User) {
    try {
      return await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      return null;
    }
  }

  async getAddresses() {
    try {
      const addresses = await AsyncStorage.getItem('addresses');
      if (!addresses) {
        return null;
      }
      return JSON.parse(addresses);
    } catch (error) {
      return null;
    }
  }
}
