import AsyncStorage from '@react-native-community/async-storage';
import {OkHiLocation} from '../lib/okcollect-online';
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
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      return;
    }
  }

  async getAddresses(): Promise<Array<OkHiLocation>> {
    try {
      const addresses = await AsyncStorage.getItem('addresses');
      if (!addresses) {
        return [];
      }
      return JSON.parse(addresses);
    } catch (error) {
      return [];
    }
  }

  async setAddress(address: OkHiLocation) {
    try {
      let addresses = await this.getAddresses();
      addresses = [address, ...addresses];
      await AsyncStorage.setItem('addresses', JSON.stringify(addresses));
    } catch (error) {
      return;
    }
  }
}
