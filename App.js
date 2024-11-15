import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import Welcome from './assets/screens/Auth/Welcome';
import Login from './assets/screens/Login';
import HomeScreen from './assets/screens/Main/Home';
import Profile from './assets/screens/Main/Profile';
import SettingsScreen from './assets/screens/Main/Settings';
import RegisterScreen from './assets/screens/AdminEdit/EditUsers/Register';
import ActivityScreen from './assets/screens/Main/Activity';
import AuthLoadingScreen from './assets/screens/Auth/AuthLoadingScreen';
import ShoppingCart from './assets/screens/Main/Shopping';
import ScanCodeScreen from './assets/screens/Main/ScanCodeScreen';
import UserDetails from './assets/screens/AdminEdit/EditUsers/UserDetails';
import EditPage from './assets/screens/AdminEdit/EditPage';
import EditHome from './assets/screens/AdminEdit/EditHome/EditHome';
import ViewUsers from './assets/screens/AdminEdit/EditHome/ViewUsers';
import EditActivityScreen from './assets/screens/AdminEdit/EditActivity/EditActivityScreen';
import ViewActivities from './assets/screens/AdminEdit/EditActivity/ViewActivities';
import AddPalmares from './assets/screens/AdminEdit/EditPalmares/AddPalmares';
import EditPalmares from './assets/screens/AdminEdit/EditPalmares/EditPalmares';
import ViewPalmares from './assets/screens/AdminEdit/EditPalmares/ViewPalmares';
//testing

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d', // Custom active tab color
      }}
    >
      <Tab.Screen
        name="Accueil"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
          headerRight: () => (
            <Ionicons 
              name="notifications-outline" // Use 'notifications-sharp' for filled version
              size={24}
              style={{ marginRight: 10 }} // Add some margin to the right
              onPress={() => {
                console.log('Notifications pressed');
                // Add navigation or other logic here if needed
              }}
            />
          )
        }}
      />
      <Tab.Screen
        name="Activity"
        component={ActivityScreen}
        options={({ navigation }) => ({
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'pulse-sharp' : 'pulse-outline'} color={color} size={24} />
          ),
          headerRight: () => (
            <Ionicons 
              name="cart-outline" // Use 'cart-sharp' for filled version
              size={24}
              style={{ marginRight: 10 }} // Add some margin to the right
              onPress={() => {
                navigation.navigate('ShoppingCart');
                console.log('Shopping cart pressed');
                // Add navigation or other logic here if needed
              }}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={({ navigation }) => ({ // Access navigation here
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={color} size={24} />
          ),
          headerRight: () => (
            <Ionicons 
              name="settings-outline" // Use 'settings-sharp' for filled version
              size={24}
              style={{ marginRight: 10 }} // Add some margin to the right
              onPress={() => {
                navigation.navigate('Settings'); // Use the navigation prop here
                console.log('Settings pressed');
              }}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Inscription" component={RegisterScreen} />
        <Stack.Screen name="ShoppingCart" component={ShoppingCart} />
        <Stack.Screen name="scancode" component={ScanCodeScreen} />
        <Stack.Screen name="UserDetails" component={UserDetails} />
        <Stack.Screen name="Administration" component={EditPage} />
        <Stack.Screen name="EditHome" component={EditHome} />
        <Stack.Screen name="ViewUsers" component={ViewUsers} />
        <Stack.Screen name="EditActivityScreen" component={EditActivityScreen} />
        <Stack.Screen name="ViewActivities" component={ViewActivities} />
        <Stack.Screen name="AddPalmares" component={AddPalmares} />
        <Stack.Screen name="EditPalmares" component={EditPalmares} /> 
        <Stack.Screen name="ViewPalmares" component={ViewPalmares} /> 
      </Stack.Navigator>
      <StatusBar />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

