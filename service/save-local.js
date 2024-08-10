import AsyncStorage from '@react-native-async-storage/async-storage';
import APP_CONSTANTS from '../helper/constant';
export default async function saveLocal(response) {
    await AsyncStorage.setItem('access', response.access);
    await AsyncStorage.setItem('refresh', response.refresh);
    await AsyncStorage.setItem('email', response.email);
    await AsyncStorage.setItem('id', response.id.toString());
    await AsyncStorage.setItem('people_id', response.people_id?.toString());
    await AsyncStorage.setItem(
      'profile_picture',
      response?.profile_picture || APP_CONSTANTS.defaultAvatar,
    );
    await AsyncStorage.setItem(
      'marital_status',
      response.marital_status?.toString() || 'true',
    );
    await AsyncStorage.setItem(
      'gender',
      response.gender?.toString() || 'false',
    );
}