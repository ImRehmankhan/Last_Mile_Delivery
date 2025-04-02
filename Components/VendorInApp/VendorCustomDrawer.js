import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const VendorCustomDrawer = (props) => {
  const { navigation, route } = props;
  const customerData = route?.params?.vendordata
  const[ user,setuser]=useState('')
  // Get customer data from params

useEffect( ()=>{
    fetchuser()
},[])

const fetchuser=async()=>{
    try {
        const response = await fetch(`${url}/vendor/${customerData.id}`);
        const data = await response.json();
        if (data) {
            setuser(data);}
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
}



  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          
          navigation.replace("Login");
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={{ alignItems: "flex-start", padding: 5,marginBottom:20}}>
{user.profile_picture ? (
          <Image source={{ uri: user.profile_picture }} style={{ width: 80, height: 80, borderRadius: 40 }} />
        ) : (
          <Icon name="account-circle" size={80} color="gray" />
        )}
        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>{customerData.name}</Text>
        <Text style={{ fontSize: 14, color: "gray" }}>{customerData.email}</Text>

      </View>

     
      <DrawerItemList {...props} />

  
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          padding: 15,
          backgroundColor: "#ff4d4d",
          margin: 20,
          borderRadius: 5,
          alignItems: "center",
          justifyContent:'flex-end'
        }}
      >
        <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

export default VendorCustomDrawer;
