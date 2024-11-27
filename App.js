import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Text, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Welcome from './assets/screens/Auth/Welcome';
import Loading from './assets/screens/Auth/Loading';
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
import Login from './assets/screens/Auth/Login';
import AddActivity from './assets/screens/AdminEdit/EditActivity/Addactivity';
import AddActivityMobile from './assets/screens/AdminEdit/EditActivity/AddactivityMobile';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import EditUser from './assets/screens/AdminEdit/EditUsers/EditUser';
import Palmares from './assets/screens/Main/Palmares';
import About from './assets/screens/Main/About';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator initialRouteName="Home" screenOptions={{ gestureEnabled: false }}>
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="About" component={About} options={{ headerShown: false }} />
    <Stack.Screen name="Palmares" component={Palmares} options={{ headerTitle: '' }} />
  </Stack.Navigator>
);

const ActivityStack = () => (
  <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
    <Stack.Screen name="ActivityMain" component={ActivityScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Shopping" component={ShoppingCart} options={{ headerTitle: '' }} />
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
    <Stack.Screen name="ProfileMain" component={Profile} options={{ headerShown: false }} />
    <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerTitle: '' }} />
    <Stack.Screen name="EditPage" component={EditPage} options={{ headerTitle: '' }} />
    <Stack.Screen name="EditHome" component={EditHome} options={{ headerTitle: '' }} />
    <Stack.Screen name="ViewUsers" component={ViewUsers} options={{ headerTitle: '' }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerTitle: '' }} />
    <Stack.Screen name="UserDetails" component={UserDetails} options={{ headerTitle: '' }} />
    <Stack.Screen name="EditUser" component={EditUser} options={{ headerTitle: '' }} />
    <Stack.Screen name="EditActivity" component={EditActivityScreen} options={{ headerTitle: '' }} />
    <Stack.Screen name="ViewActivities" component={ViewActivities} options={{ headerTitle: '' }} />
    <Stack.Screen name="AddPalmares" component={AddPalmares} options={{ headerTitle: '' }} />
    <Stack.Screen name="EditPalmares" component={EditPalmares} options={{ headerTitle: '' }} />
    <Stack.Screen name="ViewPalmares" component={ViewPalmares} options={{ headerTitle: '' }} />
    <Stack.Screen 
      name="AddActivity" 
      component={Platform.OS === 'web' ? AddActivity : AddActivityMobile} 
      options={{ headerTitle: '' }} 
    />
    <Stack.Screen name="ScanCode" component={ScanCodeScreen} options={{ headerTitle: '' }} />
  </Stack.Navigator>
);

const MoreTabs = () => {
  const [adminName, setAdminName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loadAdminName = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const response = await axios.get('https://mornebourgmass.com/api/account', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAdminName(response.data.identifiant);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Failed to load admin name from server:", error);
        setIsAuthenticated(false);
      }
    };

    loadAdminName();
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Accueil"
        component={HomeStack}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
          headerTitle: '',
          headerLeft: () => (
            <View style={styles.greetingContainer}>
              <Image
                source={require("./assets/images/photo1.jpg")}
                style={styles.profileImage}
              />
              <View style={styles.greetingTextContainer}>
                <Text style={styles.greetingText}>Bonjour, {adminName}!</Text>
              </View>
            </View>
          ),
          headerRight: () => (
            <Ionicons 
              name="notifications-outline"
              size={24}
              style={{ marginRight: 10 }}
              onPress={() => {
                console.log('Notifications pressed');
              }}
            />
          )
        }}
      />
      <Tab.Screen
        name="Activité"
        component={ActivityStack}
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <Ionicons name="musical-notes" size={28} color={color} />,
          headerRight: () => (
            <Ionicons 
              name="cart-outline"
              size={24}
              style={{ marginRight: 10 }}
              onPress={() => {
                console.log('Shopping cart pressed');
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profil"
        component={ProfileStack}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
          <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />
          <Stack.Screen name="Loading" component={Loading} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={MoreTabs} options={{ headerShown: false }} />
        </Stack.Navigator>
        <StatusBar />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greetingTextContainer: {
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  greetingSubText: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  customRecommendationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
    flexDirection: "row",
  },
});

