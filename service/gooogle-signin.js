import { GoogleSignin } from '@react-native-google-signin/google-signin';
export async function onGoogleButtonPress() {
    try{
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
    console.log('google-token',res.idToken);
    }catch(e){
        console.log(e);
    }
  }