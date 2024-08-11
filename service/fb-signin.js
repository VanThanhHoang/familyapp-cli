import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import saveLocal from './save-local';
import axios from 'axios';

export async function onFacebookButtonPress() {
  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions([
    'public_profile',
    'email',
  ]);
  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  // Once signed in, get the users AccessToken
  const data = await AccessToken.getCurrentAccessToken();
  if (!data) {
    return false;
  }
  const response = await axios.post('https://api.lehungba.com/auth/facebook/', {
    access_token: data.accessToken,
  });
  await saveLocal(response.data);
  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(
    data.accessToken,
  );
  // Sign-in the user with the credential
  return true;
}
// sample data
// const data = {
//   accessToken:
//     'EAAPt6gpyNv0BO5ysgWm4L0iybSBz64c58ztbrydqazaOZBpQrb9YeLPkR9lrhJeb5XogGsCeZAXx6inbECCRR798S2LB9x5oyaQqWPj4ZCtR4g9a1OjKVoy6e6StVNQ5YpCQKoh5PCtbMDG6ZAMbWS3IlaT2wzvudtZCr2IU6utWPrp8MZBTxC3jeo2XqB86g70Xy49cSv66ZBSBZADKKZBxO6PircYcNxkjUnt4fIevYSj7jpze7s5QZAKZCyEhy4iJrzRYQZDZD',
//   accessTokenSource: undefined,
//   applicationID: '1106014383519485',
//   dataAccessExpirationTime: 64092211200000,
//   declinedPermissions: [],
//   expirationTime: 64092211200000,
//   expiredPermissions: [],
//   lastRefreshTime: 1723355006156.142,
//   permissions: ['public_profile', 'openid', 'email'],
//   userID: '374354055686031',
// };
