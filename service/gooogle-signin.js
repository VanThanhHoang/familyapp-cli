import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AxiosInstance from '../network/AxiosInstance';
import saveLocal from './save-local';
import axios from 'axios';

export async function onGoogleButtonPress() {
    try {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Get the users ID token
        const res = await GoogleSignin.signIn();
        
        console.log('google-info',{
            id: res.user.id,
            name: res.user.name,
            email: res.user.email,
            photo: res.user.photo
        });
        console.log('google-idToken', res.idToken);

        // Get the access token
        const tokens = await GoogleSignin.getTokens();
        console.log('google-accessToken', tokens.accessToken);
        const response = await axios.post('https://api.lehungba.com/auth/google/', {
            access_token: tokens.accessToken
        });
        console.log('google-signin-response', response.data);
        await saveLocal(response.data);
        return true
    } catch (e) {
        console.log(e);
        return false;
    }
}

