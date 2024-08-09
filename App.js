//Users/macm1/Code/FamilyApp/family/App.js
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider as RNEThemeProvider } from '@rneui/themed';
import AppProvider from './AppContext';
import AppNavigation from './AppNavigation';
import { GoogleSignin } from '@react-native-google-signin/google-signin';


import { ThemeProvider, useThemeContext } from './ThemeContext';
const App = () => {
  GoogleSignin.configure({
    webClientId: '53635285604-4oopt1je3d0ckdbdcdmvneeratpjgn0g.apps.googleusercontent.com',
    iosClientId:'53635285604-9jjtfq0vlrsva8f399ea6qtitt1nv4kh.apps.googleusercontent.com'
    
  });
  const { theme } = useThemeContext();
  return (
    <View style={{ flex: 1 }}>
      <AppProvider>
        <RNEThemeProvider theme={theme}>
          <NavigationContainer>
            <AppNavigation />
          </NavigationContainer>
        </RNEThemeProvider>
      </AppProvider>
    </View>
  );
};

export default () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
