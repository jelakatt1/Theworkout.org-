import React from 'react'
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'react-native'
import { MainStackNavigator } from './src/navigation/MainStackNavigator';
import { AuthProvider } from './src/contexts/authContext';

const App = () => {


  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor='white' barStyle="dark-content" />
      {/* <SafeAreaView style={{ flex: 1 }}> */}
        <AuthProvider>
          <MainStackNavigator />
        </AuthProvider>
      {/* </SafeAreaView> */}
    </SafeAreaProvider>
  )
}

export default App