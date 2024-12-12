import React from 'react'; // Add this line to import React
import { Text, View, Pressable, Animated } from 'react-native'; // Add Animated import
import { Redirect, Tabs, Link } from 'expo-router';
import { useAuth } from '../../context/auth';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  const { session, isLoading } = useAuth();
  const bounceAnimation = new Animated.Value(0);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnimation, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnimation, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const bounceStyle = {
    transform: [
      {
        translateY: bounceAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -10],
        }),
      },
    ],
  };

  const textStyle = {
    fontWeight: 'bold',
    fontSize: 15,
    textShadowColor: 'black',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement...</Text>
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
          title: 'Accueil',  
          headerTitle: () => (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Animated.View style={bounceStyle}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={[textStyle, { color: '#4FB3FF' }]}>morne</Text>
                  <Text style={[textStyle, { color: 'orange' }]}>bourg</Text>
                  <Text style={[textStyle, { color: 'yellow' }]}>mass</Text>
                </View>
              </Animated.View>
            </View>
          ),
          headerBackTitle: '', // Add this line to remove the back button title
          headerRight: () => (
            <Link href="/pages/settings" asChild>
              <Pressable>
                <Ionicons name="settings-outline" size={24} style={{ marginRight: 15 }} />
              </Pressable>
            </Link>
          ),
          /**
           * Function to render the icon for the home tab in the bottom tab bar
           * @param {{color: string}} props The props object with the color for the icon
           * @returns {React.ReactElement} A React element representing the icon
           */
          tabBarIcon: ({ color }) => (
            <Text style={{ color }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activités',
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
          title: 'Profil',
          headerBackTitle: '', // Add this line to remove the back button title
          tabBarIcon: ({ color }) => (
            <Text style={{ color }}>👤</Text>
          ),
        }}
      />
    </Tabs>

  );
}
