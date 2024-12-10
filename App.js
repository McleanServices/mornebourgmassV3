import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, Text, ActivityIndicator, Platform, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from "@env";
import axios from 'axios'; // Add this import at the top
import { 
  Welcome, Loading, HomeScreen, Profile, SettingsScreen, RegisterScreen, 
  ActivityScreen, ShoppingCart, ScanCodeScreen, UserDetails, EditPage, EditHome, 
  ViewUsers, EditActivityScreen, ViewActivities, AddPalmares, EditPalmares, 
  ViewPalmares, Login, AddActivity, AddActivityMobile, EditUser, Palmares, About, 
  EditActivityMobile, BilletScreen, Reglementation, EditActivtyPage, EditUserPage, 
  EditPalmaresPage 
} from './assets/screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Add this at the top of your App.js file
if (typeof window !== 'undefined' && !window.addEventListener) {
  window.addEventListener = () => {};
}

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator initialRouteName="Home" screenOptions={{ gestureEnabled: false }}>
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="EditUserPage" component={EditUserPage} options={{ headerTitle: 'Admin Utilisateur' }} />
    <Stack.Screen name="About" component={About} />
    <Stack.Screen name="Palmares" component={Palmares} options={{ headerTitle: '' }} />
    <Stack.Screen name="Shopping" component={ShoppingCart} options={{ headerTitle: '' }} />
    <Stack.Screen name="ActivityMain" component={ActivityScreen} />
    <Stack.Screen name="Billet" component={BilletScreen} options={{ headerTitle: ''}} />
    <Stack.Screen name='Reglementation' component={Reglementation} options={{ headerTitle: ''}} />
    <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerTitle: '' }} />
  </Stack.Navigator>
);

const ActivityStack = ({ navigation }) => (
  <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
    <Stack.Screen name="ActivityMain" component={ActivityScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Shopping">
      {props => <ShoppingCart {...props} navigation={navigation} />}
    </Stack.Screen>
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
    <Stack.Screen name="ProfileMain" component={Profile} options={{ headerShown: false }}/>
    <Stack.Screen name="EditPage" component={EditPage} options={{ headerTitle: '' }} />
    <Stack.Screen name="EditHome" component={EditHome} options={{ headerTitle: '' }} />
    <Stack.Screen name="EditUserPage" component={EditUserPage} options={{ headerTitle: 'Admin Utilisateur' }} />
    <Stack.Screen name="ViewUsers" component={ViewUsers} options={{ headerTitle: '' }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerTitle: '' }} />
    <Stack.Screen name="UserDetails" component={UserDetails} options={{ headerTitle: '' }} />
    <Stack.Screen name="EditUser" component={EditUser} options={{ headerTitle: '' }} />
    <Stack.Screen name="EditActivtyPage" component={EditActivtyPage} options={{ headerTitle: '' }} />
    <Stack.Screen name="EditActivity" component={Platform.OS === 'web' ? EditActivityScreen : EditActivityMobile}  options={{ headerTitle: '' }} />
    <Stack.Screen name="ViewActivities" component={ViewActivities} options={{ headerTitle: '' }} />
    <Stack.Screen name="EditPalmaresPage" component={EditPalmaresPage} options={{ headerTitle: '' }} />
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

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={Welcome} />
    <Stack.Screen name="Loading" component={Loading} />
    <Stack.Screen name="Login" component={Login} />
  </Stack.Navigator>
);

const MoreTabs = ({ navigation }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  const [initialCheck, setInitialCheck] = useState(true);

  useEffect(() => {
    const loadUserRole = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const storedUserId = await AsyncStorage.getItem("userId");
        
        if (token && storedUserId) {
          setIsAuthenticated(true);
          
          // Fetch fresh user details including role
          const response = await axios.get(`${API_URL}/api/user/${storedUserId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const userRole = response.data.user.role;
          setUserRole(userRole.toLowerCase());
          await AsyncStorage.setItem("userRole", userRole);
        } else if (initialCheck) {
          navigation.navigate('Auth');
        }
      } catch (error) {
        console.error("Failed to load user role from API:", error);
        if (initialCheck) {
          navigation.navigate('Auth');
        }
      } finally {
        setInitialCheck(false);
      }
    };

    loadUserRole();
    
    // Set up periodic role refresh
    const roleRefreshInterval = setInterval(loadUserRole, 60000); // Refresh every minute

    return () => {
      clearInterval(roleRefreshInterval);
    };
  }, [navigation, initialCheck]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'Accueil') {
            iconName = 'home';
          } else if (route.name === 'Activite') {
            iconName = 'musical-notes';
          } else if (route.name === 'Profil') {
            iconName = 'user';
          } else if (route.name === 'QRCode') {
            iconName = 'qrcode';
          }
          return <FontAwesome name={iconName} size={28} color={color} />;
        },
        tabBarActiveTintColor: '#8A2BE2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { display: route.name === 'Auth' ? 'none' : 'flex' }
      })}
    >
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
                <View>
                  <Text style={styles.greetingText}>Bonjour !</Text>
                </View>
              </View>
            </View>
          ),
          headerRight: () => (
            <Ionicons 
              name="settings-outline"
              size={24}
              style={{ marginRight: 10 }}
              onPress={() => {
                navigation.navigate('Settings');
              }}
            />
          )
        }}
      />
      <Tab.Screen
        name="Activite"
        component={ActivityStack}
        options={{
          title: 'Activity',
          tabBarIcon: ({ color }) => <Ionicons name="musical-notes" size={28} color={color} />,
        }}
      />
      {userRole && userRole.toLowerCase() === "admin" && (
        <Tab.Screen
          name="QRCode"
          component={ScanCodeScreen}
          options={{
            title: 'QR Code',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="qrcode" color={color} />,
          }}
        />
      )}
      <Tab.Screen
        name="Profil"
        component={ProfileStack}
        options={{
          headerShown: false ,
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
        }}
      />
      {!isAuthenticated && (
        <Tab.Screen 
          name="Auth" 
          component={AuthStack} 
          options={{ headerShown: false, tabBarButton: () => null }} 
        />
      )}
    </Tab.Navigator>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();

    const handleInactivity = async () => {
      await AsyncStorage.removeItem('userRole'); // Add this line
      await AsyncStorage.clear();
      if (typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
      setIsAuthenticated(false);
    };

    // Platform specific inactivity handling
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      let inactivityTimeout = setTimeout(handleInactivity, 5 * 60 * 1000);

      const resetInactivityTimeout = () => {
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(handleInactivity, 5 * 60 * 1000);
      };

      window.addEventListener('mousemove', resetInactivityTimeout);
      window.addEventListener('keydown', resetInactivityTimeout);

      return () => {
        clearTimeout(inactivityTimeout);
        window.removeEventListener('mousemove', resetInactivityTimeout);
        window.removeEventListener('keydown', resetInactivityTimeout);
      };
    } else {
      // For mobile platforms, use AppState
      const subscription = AppState.addEventListener('change', (nextAppState) => {
        if (nextAppState === 'background') {
          handleInactivity();
        }
      });

      return () => {
        subscription.remove();
      };
    }
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A2BE2" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
          <Stack.Screen 
            name="Home" 
            component={MoreTabs} 
            options={{ headerShown: false }} 
          />
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

