import { Text, View, Pressable } from 'react-native';
import { Redirect, Tabs, Link } from 'expo-router';
import { useAuth } from '../../context/auth';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (session === null) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="index" 
        options={{
          title: 'Home',  
          headerBackTitle: '', // Add this line to remove the back button title
          headerRight: () => (
            <Link href="/pages/settings" asChild>
              <Pressable>
                <Ionicons name="settings-outline" size={24} style={{ marginRight: 15 }} />
              </Pressable>
            </Link>
          ),
/*************  ✨ Codeium Command ⭐  *************/
        /**
         * Function to render the icon for the home tab in the bottom tab bar
         * @param {{color: string}} props The props object with the color for the icon
         * @returns {React.ReactElement} A React element representing the icon
         */
/******  636e6112-26f0-4cc4-9d49-1e3d5c739aa6  *******/
          tabBarIcon: ({ color }) => (
            <Text style={{ color }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          headerBackTitle: '', // Add this line to remove the back button title
          tabBarIcon: ({ color }) => (
            <Text style={{ color }}>🏃‍♂️</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: 'Profile',
          headerBackTitle: '', // Add this line to remove the back button title
          tabBarIcon: ({ color }) => (
            <Text style={{ color }}>👤</Text>
          ),
        }}
      />
    </Tabs>

  );
}
