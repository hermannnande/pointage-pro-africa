import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
// Import autres screens (à créer)

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navigation principale avec tabs
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Accueil',
          tabBarIcon: () => '🏠',
        }}
      />
      <Tab.Screen 
        name="History" 
        component={HomeScreen} // À remplacer
        options={{
          title: 'Historique',
          tabBarIcon: () => '📊',
        }}
      />
      <Tab.Screen 
        name="Leaves" 
        component={HomeScreen} // À remplacer
        options={{
          title: 'Congés',
          tabBarIcon: () => '🏖️',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={HomeScreen} // À remplacer
        options={{
          title: 'Profil',
          tabBarIcon: () => '👤',
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

