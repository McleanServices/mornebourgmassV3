// ...existing code...
import AdminControl from '../screens/AdminControl';
// ...existing code...

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        {/* ...existing routes... */}
        <Stack.Screen name="AdminControl" component={AdminControl} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
