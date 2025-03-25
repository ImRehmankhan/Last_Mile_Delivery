import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {
  Checkbox,
  Button,
  IconButton,
  Modal,
  RadioButton,
} from 'react-native-paper';
import {SelectList} from 'react-native-dropdown-select-list';

const CustomerShowCartItem = ({navigation, route}) => {
  const CartData = route.params.orderDetails;
  const cutomerdata = route.params.cutomerdata;
  const [selectedItems, setSelectedItems] = useState({});
  const [quantities, setQuantities] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedDeliveryType, setSelectedDeliveryType] = useState('Standard');
  const [finalItem, setFinalItem] = useState([]);
  const [customerFullData,setCustomerFullData]=useState({})
  
  useEffect(() => {
    console.log(CartData)
    getCustomerFullDetails()
    getCustomerAddress();
    const initialSelection = {};
    const initialQuantities = {};
    CartData.forEach(item => {
      initialSelection[item.item_detail_id] = true; // Set all checkboxes as checked by default
      initialQuantities[item.item_detail_id] = item.quantity; // Set default quantity
    });
    setSelectedItems(initialSelection);
    setQuantities(initialQuantities);
  }, []);
  const getCustomerAddress = async () => {
    try {
      const response = await fetch(
        `${url}/customers/${cutomerdata.id}/addresses`,
      );
      const res = await response.json();

      if (res.addresses) {
        const data = res.addresses;
        const formattedAddres = data.map(address => ({
          key: address.id.toString(),
          value:
            address.address_type +
            '-' +
            address.street +
            ',' +
            address.city +
            ',' +
            address.country,
        }));
        setAddresses(formattedAddres);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getCustomerFullDetails=async()=>{
    try {
      const response = await fetch(
        `${url}/customers/${cutomerdata.id}`,
      );
      const data = await response.json();
      if (data) {
        setCustomerFullData(data) 
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
  const toggleSelection = itemId => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const updateQuantity = (itemId, type) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]:
        type === 'increase' ? prev[itemId] + 1 : Math.max(1, prev[itemId] - 1), // Ensure quantity doesn't go below 1
    }));
  };

  const handleCheckout = val => {
    const finalizedItems = CartData.filter(
      item => selectedItems[item.item_detail_id],
    ).map(item => ({
      ...item,
      quantity: quantities[item.item_detail_id],
    }));
    if (val === 'checkout') {
      if (finalizedItems.length > 0) {
        setFinalItem([...finalizedItems]);
        setModalVisible(true);
      } else {
        alert('Please finalize at least one item before checkout.');
      }
    }
    else if (val === 'savecart') {
      if (finalizedItems.length > 0) {
        const formattedOrder = finalizedItems.map(item => ({
          customer_id: customerFullData.customer_id,
          vendor_id: item.vendor_id,
          shop_id: item.shop_id,
          branch_id: item.branch_id,
          itemdetails_id: item.item_detail_id, // Match API field name
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity, 10),
        }));
    
        console.log("Saving cart items:", formattedOrder);
    
        formattedOrder.forEach(async (item) => {
          try {
            const response = await fetch(`${url}/cart/add-item`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(item), // Send one item at a time
            });
    
            const result = await response.json();
    
            if (response.ok) {
              alert("Cart Saved Successfully!");
            } else {
              alert(`Error: ${result.message || "Something went wrong!"}`);
            }
          } catch (error) {
            console.error("Cart API Error:", error);
            alert("Failed to save cart item. Please try again later.");
          }
        });
      } else {
        alert("No items selected to save!");
      }
    }
  };
  const handleConfirmCheckout = val => {
    if (!selectedDeliveryAddress || !selectedBillingAddress) {
      alert('Please select both addresses!');
      return;
    }
    const orderInfo = {
      customer_id: customerFullData.customer_id,
      delivery_address: selectedDeliveryAddress,
      Billing_address: selectedBillingAddress,
      order_details: finalItem,
    };

    setModalVisible(false);
    setFinalItem([]);
    console.log('ordersummary: ',orderInfo)
    navigation.navigate('Order Summary', {orderInfo,cutomerdata});
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={CartData}
        keyExtractor={item => item.item_detail_id.toString()}
        renderItem={({item}) => (
          <View style={styles.itemCard}>
            <Image source={{uri: item.itemPicture}} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.item_name}</Text>
              <Text style={styles.itemPrice}>Rs/.{item.price}</Text>
              <Text style={styles.shopName}>{item.item_description}</Text>
              {/* Quantity Control */}
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() =>
                    updateQuantity(item.item_detail_id, 'decrease')
                  }
                  style={styles.quantityButton}>
                  <Text style={styles.quantityText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityValue}>
                  {quantities[item.item_detail_id]}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    updateQuantity(item.item_detail_id, 'increase')
                  }
                  style={styles.quantityButton}>
                  <Text style={styles.quantityText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Checkbox
              status={
                selectedItems[item.item_detail_id] ? 'checked' : 'unchecked'
              }
              onPress={() => toggleSelection(item.item_detail_id)}
              color={selectedItems[item.item_detail_id] ? '#F8544B' : '#888'}
            />
          </View>
        )}
      />

      {/* Checkout Button */}
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => handleCheckout('checkout')}
          style={styles.checkoutButton}
          labelStyle={styles.buttonText}>
          Checkout
        </Button>

        <Button
          mode="contained"
          style={styles.saveCartButton}
          onPress={() => handleCheckout('savecart')}
          labelStyle={styles.buttonText}>
          Save Cart
        </Button>
      </View>

      {/* Checkout Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Address</Text>

            {/* Delivery Address Dropdown */}
            <Text style={styles.label}>Delivery Address</Text>
            <SelectList
              setSelected={val => {
                const selectedAddress = addresses.find(
                  item => item.key === val,
                );
                setSelectedDeliveryAddress(selectedAddress); // Store full object
              }}
              data={addresses}
              placeholder="Select Delivery Address"
              boxStyles={styles.dropdown}
              dropdownStyles={styles.dropdownList}
              defaultOption={addresses[0]} // Pre-select first option
            />

            {/* Billing Address Dropdown */}
            <Text style={styles.label}>Billing Address</Text>
            <SelectList
              setSelected={val => {
                const selectedAddress = addresses.find(
                  item => item.key === val,
                );
                setSelectedBillingAddress(selectedAddress);
              }}
              data={addresses}
              placeholder="Select Billing Address"
              boxStyles={styles.dropdown}
              dropdownStyles={styles.dropdownList}
              defaultOption={addresses[0]}
            />
            <Button
              mode="text"
              textColor="grey"
              labelStyle={{fontSize: 20, fontWeight: 'bold'}}
              onPress={() => navigation.navigate('Add Address', {cutomerdata})}>
              Add new Address
            </Button>
            {/* Delivery Type Section with Radio Buttons */}
            <Text style={styles.label}>Delivery Type</Text>
            <RadioButton.Group
              onValueChange={newValue => setSelectedDeliveryType(newValue)}
              value={selectedDeliveryType}>
              <View style={styles.radioButtonContainer}>
                <RadioButton.Item
                  label="Standard Delivery"
                  value="Standard"
                  color="#F8544B"
                  labelStyle={styles.radioLabel}
                />
                <RadioButton.Item
                  label="Express Delivery"
                  value="Express"
                  color="#F8544B"
                  labelStyle={styles.radioLabel}
                />
              </View>
            </RadioButton.Group>
            {/* Confirm Button */}
            <Button
              mode="contained"
              onPress={handleConfirmCheckout}
              style={styles.confirmButton}
              labelStyle={styles.buttonText}>
              Confirm & Proceed
            </Button>

            {/* Close Button */}
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 10,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    color: '#28A745',
  },
  shopName: {
    fontSize: 12,
    color: '#6C757D',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  quantityButton: {
    backgroundColor: '#F8544B',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  checkoutButton: {
    flex: 1,
    backgroundColor: '#007BFF', // Blue for checkout
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  saveCartButton: {
    flex: 1,
    backgroundColor: '#F8544B', // Your red theme color for Save Cart
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // White text for contrast
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#F8544B',
  },
  label: {
    fontSize: 20,
    alignSelf: 'flex-start',
    marginTop: 10,
    fontWeight: 'bold',
  },
  dropdown: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  confirmButton: {
    backgroundColor: '#F8544B',
    width: '100%',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  closeText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007BFF',
  },
  radioButtonContainer: {
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
});

export default CustomerShowCartItem;
