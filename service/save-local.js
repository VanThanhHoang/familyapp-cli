import AsyncStorage from '@react-native-async-storage/async-storage';
import APP_CONSTANTS from '../helper/constant';
export default async function saveLocal(response) {
    await AsyncStorage.setItem('access', response.access);
    await AsyncStorage.setItem('refresh', response.refresh);
    await AsyncStorage.setItem('email', response.email);
    await AsyncStorage.setItem('id', response.id.toString());
    await AsyncStorage.setItem('people_id', response.people_id?.toString());
    await AsyncStorage.setItem('full_name_vn', response.full_name_vn || '');
    await AsyncStorage.setItem('phone_number', response.phone_number || '');
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
// {
//   "id": 17,
//   "email": "",
//   "phone_number": null,
//   "people_id": 126,
//   "profile_picture": "https://api.lehungba.com/media/images/people/profile/17/126/profile.webp",
//   "full_name_vn": "Sách Cũ Sài Gon",
//   "marital_status": false,
//   "gender": null,
//   "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyNTk0NzA1OCwiaWF0IjoxNzIzMzU1MDU4LCJqdGkiOiJjNzhlOWRjYTAxNjU0YWFhYjhmN2M2OTNlM2UwZjA1ZiIsInVzZXJfaWQiOjE3fQ.Vt17vfPq3j6mTd-R4ymLTsXkgD5_Dlzy1dlxUwA4Ltw",
//   "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzIzNDE1MDU4LCJpYXQiOjE3MjMzNTUwNTgsImp0aSI6IjlkODUxZGJmZTM4MTRhNjE4ZTNkNTA4MTBkMjM4NDY3IiwidXNlcl9pZCI6MTd9.OGhiBl8yPt8l1FJ8Ypn7F_Tb3wmVBTJI-Zh-c7W2NOU"
// }