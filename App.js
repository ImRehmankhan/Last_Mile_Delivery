import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import Login from './Components/SignupLogin/Login';
import VendorSignup from './Components/VendorInApp/VendorSignup';
import SignupOptions from './Components/SignupLogin/SignupOptions';
import VendorDashboar from './Components/VendorInApp/VendorDashboar';
import AdminDashboard from './Components/Admin/AdminDashboard';
import VendorShops from './Components/VendorInApp/VendorShops';
import VendorBranches from './Components/VendorInApp/VendorBranches';
import BranchApprove from './Components/Admin/BranchApprove';
import VendorApprove from './Components/Admin/VendorApprove';
import VendorDetails from './Components/Admin/VendorDetails';
import BranchDetails from './Components/Admin/BranchDetails';
import CustomerSignup from './Components/Customer/CustomerSignup';
import CustomerDrawerNavigation from './Components/Customer/CustomerDrawerNavigation';
import ShowItems from './Components/Customer/ShowItems';
import VendorAddItem from './Components/VendorInApp/VendorAddItem';
import VendorDrawerNavigation from './Components/VendorInApp/VendorDrawerNavigation';
import CustomerShowCartItem from './Components/Customer/CustomerShowCartItem';
import CustomerAddnewAddress from './Components/Customer/CustomerAddnewAddress';
import CustomerShowOrderDetails from './Components/Customer/CustomerShowOrderDetails';
import CustomerShowSaveCard from './Components/Customer/CustomerShowSaveCard';
import AdminDrawerNavigation from './Components/Admin/AdminDrawerNavigation';
import VendorViewBranchItem from './Components/VendorInApp/VendorViewBranchItem';
import VendorEditBranch from './Components/VendorInApp/VendorEditBranch';
import { CartProvider } from './Context/LmdContext';

const App = () => {
  const Stack = createNativeStackNavigator();
  var ipAdd = '172.16.20.143';
  var emulatorip = '10.0.2.2';
  var mobileip = '192.168.173.191';
  var homewifi = '192.168.100.11';
  global.url = `http://192.168.100.11:8000/api`;
  global.imgURL = `http://${ipAdd}/MapProjectLmdApi/Images/`;
  /* screenOptions={{headerShown: false}} */
  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <CartProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
            {/* Customer */}
            <Stack.Screen name="Customer Signup" component={CustomerSignup} />
            <Stack.Screen
              name="Customer Dashboard"
              component={CustomerDrawerNavigation}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Branch Menu"
              component={ShowItems} /* options={{headerShown: false}}  */
            />
            <Stack.Screen name="Cart Item" component={CustomerShowCartItem} />
            <Stack.Screen
              name="Add Address"
              component={CustomerAddnewAddress}
            />
            <Stack.Screen
              name="Order Summary"
              component={CustomerShowOrderDetails}
            />

            {/* In App Vendor */}
            <Stack.Screen name="Signup Options" component={SignupOptions} />
            <Stack.Screen name="Vendor Signup" component={VendorSignup} />
            <Stack.Screen
              name="Vendor Dashboard"
              component={VendorDrawerNavigation}
              options={{headerShown: false}}
            />
            <Stack.Screen name="Vendor Branches" component={VendorBranches} />
            <Stack.Screen name="Add Item" component={VendorAddItem} />
            <Stack.Screen name="View Item" component={VendorViewBranchItem} />
            <Stack.Screen name="Edit Branch" component={VendorEditBranch} />

            {/* Admin */}
            <Stack.Screen
              name="Admin Dashboard"
              component={AdminDrawerNavigation}
              options={{headerShown: false}}
            />
            <Stack.Screen name="Branch Approval" component={BranchApprove} />
            <Stack.Screen name="Vendor Approval" component={VendorApprove} />
            <Stack.Screen name="Vendor Details" component={VendorDetails} />
            <Stack.Screen name="Branch Details" component={BranchDetails} />
          </Stack.Navigator>
        </NavigationContainer>
        </CartProvider>
      </GestureHandlerRootView>
    </>
  );
};

export default App;
