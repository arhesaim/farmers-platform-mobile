import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Ionicons} from '@expo/vector-icons';

// Screens
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import SellerDashboard from './screens/seller/SellerDashboard';
import AddProductScreen from './screens/seller/AddProductScreen';
import ManageProductsScreen from './screens/seller/ManageProductsScreen';
import SetAvailabilityScreen from './screens/seller/SetAvailabilityScreen';
import BuyerDashboard from './screens/buyer/BuyerDashboard';
import ProductDetailsScreen from './screens/buyer/ProductDetailsScreen';
import CartScreen from './screens/buyer/CartScreen';
import CheckoutScreen from './screens/buyer/CheckoutScreen';
import OrderConfirmationScreen from './screens/buyer/OrderConfirmationScreen';
import ProfileScreen from './screens/ProfileScreen';

// Context
import {UserProvider} from './context/UserContext';
import {LocationProvider} from './context/LocationContext';
import {ProductProvider} from './context/ProductContext';
import {CartProvider} from './context/CartContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const SellerStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SellerDashboard"
      component={SellerDashboard}
      options={{title: 'Seller Dashboard'}}
    />
    <Stack.Screen
      name="AddProduct"
      component={AddProductScreen}
      options={{title: 'Add Product'}}
    />
    <Stack.Screen
      name="ManageProducts"
      component={ManageProductsScreen}
      options={{title: 'My Products'}}
    />
    <Stack.Screen
      name="SetAvailability"
      component={SetAvailabilityScreen}
      options={{title: 'My Schedule'}}
    />
  </Stack.Navigator>
);

const BuyerStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="BuyerDashboard"
      component={BuyerDashboard}
      options={{title: 'Available Products'}}
    />
    <Stack.Screen
      name="ProductDetails"
      component={ProductDetailsScreen}
      options={{title: 'Product Details'}}
    />
    <Stack.Screen
      name="Cart"
      component={CartScreen}
      options={{title: 'My Cart'}}
    />
    <Stack.Screen
      name="Checkout"
      component={CheckoutScreen}
      options={{title: 'Checkout'}}
    />
    <Stack.Screen
      name="OrderConfirmation"
      component={OrderConfirmationScreen}
      options={{title: 'Order Confirmation'}}
    />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let iconName;
        if (route.name === 'Seller') {
          iconName = focused ? 'briefcase' : 'briefcase-outline';
        } else if (route.name === 'Buyer') {
          iconName = focused ? 'cart' : 'cart-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}>
    <Tab.Screen name="Seller" component={SellerStack} />
    <Tab.Screen name="Buyer" component={BuyerStack} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Registration" component={RegistrationScreen} />
  </Stack.Navigator>
);

export default function App() {
  // You would add authentication state management here
  const isLoggedIn = false; // Replace with actual auth state

  return (
    <UserProvider>
      <LocationProvider>
        <ProductProvider>
          <CartProvider>
            <NavigationContainer>
              {isLoggedIn ? <MainTabs /> : <AuthStack />}
            </NavigationContainer>
          </CartProvider>
        </ProductProvider>
      </LocationProvider>
    </UserProvider>
  );
}
