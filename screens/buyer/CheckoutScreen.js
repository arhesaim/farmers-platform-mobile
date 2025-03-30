// screens/buyer/CheckoutScreen.js
import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {CartContext} from '../../context/CartContext';
import {UserContext} from '../../context/UserContext';

const CheckoutScreen = ({navigation}) => {
  const {cart, calculateTotal, clearCart} = useContext(CartContext);
  const {user} = useContext(UserContext);

  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [contactDetails, setContactDetails] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
  });
  const [saveDetails, setSaveDetails] = useState(true);

  const groupedBySellerItems = cart.reduce((groups, item) => {
    const sellerId = item.product.seller.id;
    if (!groups[sellerId]) {
      groups[sellerId] = {
        seller: item.product.seller,
        items: [],
      };
    }
    groups[sellerId].items.push(item);
    return groups;
  }, {});

  const handleProceedToPayment = () => {
    // Validate inputs
    if (
      !contactDetails.name ||
      !contactDetails.phone ||
      !contactDetails.email
    ) {
      Alert.alert('Missing Information', 'Please fill in all contact details');
      return;
    }

    if (
      deliveryMethod === 'delivery' &&
      (!deliveryAddress.street ||
        !deliveryAddress.city ||
        !deliveryAddress.postalCode)
    ) {
      Alert.alert(
        'Missing Information',
        'Please fill in all delivery address details',
      );
      return;
    }

    // Integration with maksekeskus.ee would be here
    // This is a simplified version for demo purposes

    // Simulate payment processing
    Alert.alert('Processing Payment', 'Redirecting to payment gateway...', [
      {
        text: 'Simulate Successful Payment',
        onPress: () => {
          navigation.navigate('OrderConfirmation', {
            orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
            deliveryMethod,
            paymentMethod,
          });
          clearCart();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>

        {Object.values(groupedBySellerItems).map((group, index) => (
          <View key={index} style={styles.sellerGroup}>
            <Text style={styles.sellerName}>Seller: {group.seller.name}</Text>

            {group.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.orderItem}>
                <Text style={styles.itemName}>
                  {item.quantity} x {item.product.name}
                </Text>
                <Text style={styles.itemPrice}>
                  €{(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>€{calculateTotal().toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Details</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={contactDetails.name}
          onChangeText={text =>
            setContactDetails({...contactDetails, name: text})
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={contactDetails.phone}
          onChangeText={text =>
            setContactDetails({...contactDetails, phone: text})
          }
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={contactDetails.email}
          onChangeText={text =>
            setContactDetails({...contactDetails, email: text})
          }
          keyboardType="email-address"
        />

        <View style={styles.saveDetailsContainer}>
          <Text>Save contact details for future orders</Text>
          <Switch value={saveDetails} onValueChange={setSaveDetails} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Method</Text>

        <TouchableOpacity
          style={[
            styles.optionCard,
            deliveryMethod === 'pickup' && styles.selectedOption,
          ]}
          onPress={() => setDeliveryMethod('pickup')}>
          <View style={styles.optionContent}>
            <Ionicons
              name="person-outline"
              size={24}
              color={deliveryMethod === 'pickup' ? '#007AFF' : '#333'}
            />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Pickup from Seller</Text>
              <Text style={styles.optionDescription}>
                Arrange pickup time with the seller
              </Text>
            </View>
          </View>
          <Ionicons
            name={
              deliveryMethod === 'pickup'
                ? 'checkmark-circle'
                : 'checkmark-circle-outline'
            }
            size={24}
            color={deliveryMethod === 'pickup' ? '#007AFF' : '#ccc'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionCard,
            deliveryMethod === 'delivery' && styles.selectedOption,
          ]}
          onPress={() => setDeliveryMethod('delivery')}>
          <View style={styles.optionContent}>
            <Ionicons
              name="bicycle-outline"
              size={24}
              color={deliveryMethod === 'delivery' ? '#007AFF' : '#333'}
            />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Delivery</Text>
              <Text style={styles.optionDescription}>
                Get products delivered to your address
              </Text>
            </View>
          </View>
          <Ionicons
            name={
              deliveryMethod === 'delivery'
                ? 'checkmark-circle'
                : 'checkmark-circle-outline'
            }
            size={24}
            color={deliveryMethod === 'delivery' ? '#007AFF' : '#ccc'}
          />
        </TouchableOpacity>

        {deliveryMethod === 'delivery' && (
          <View style={styles.deliveryAddressContainer}>
            <Text style={styles.deliveryAddressTitle}>Delivery Address</Text>

            <TextInput
              style={styles.input}
              placeholder="Street Address"
              value={deliveryAddress.street}
              onChangeText={text =>
                setDeliveryAddress({...deliveryAddress, street: text})
              }
            />

            <TextInput
              style={styles.input}
              placeholder="City"
              value={deliveryAddress.city}
              onChangeText={text =>
                setDeliveryAddress({...deliveryAddress, city: text})
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Postal Code"
              value={deliveryAddress.postalCode}
              onChangeText={text =>
                setDeliveryAddress({...deliveryAddress, postalCode: text})
              }
            />
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>

        <TouchableOpacity
          style={[
            styles.optionCard,
            paymentMethod === 'card' && styles.selectedOption,
          ]}
          onPress={() => setPaymentMethod('card')}>
          <View style={styles.optionContent}>
            <Ionicons
              name="card-outline"
              size={24}
              color={paymentMethod === 'card' ? '#007AFF' : '#333'}
            />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Credit/Debit Card</Text>
              <Text style={styles.optionDescription}>
                Secure payment via maksekeskus.ee
              </Text>
            </View>
          </View>
          <Ionicons
            name={
              paymentMethod === 'card'
                ? 'checkmark-circle'
                : 'checkmark-circle-outline'
            }
            size={24}
            color={paymentMethod === 'card' ? '#007AFF' : '#ccc'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionCard,
            paymentMethod === 'bank' && styles.selectedOption,
          ]}
          onPress={() => setPaymentMethod('bank')}>
          <View style={styles.optionContent}>
            <Ionicons
              name="business-outline"
              size={24}
              color={paymentMethod === 'bank' ? '#007AFF' : '#333'}
            />
            <View style={styles.optionTextContainer}>
              <Text style={styles.optionTitle}>Bank Transfer</Text>
              <Text style={styles.optionDescription}>
                Pay directly from your bank account
              </Text>
            </View>
          </View>
          <Ionicons
            name={
              paymentMethod === 'bank'
                ? 'checkmark-circle'
                : 'checkmark-circle-outline'
            }
            size={24}
            color={paymentMethod === 'bank' ? '#007AFF' : '#ccc'}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.paymentButton}
        onPress={handleProceedToPayment}>
        <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sellerGroup: {
    marginBottom: 16,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingLeft: 8,
  },
  itemName: {
    flex: 1,
  },
  itemPrice: {
    fontWeight: '500',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  saveDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTextContainer: {
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionDescription: {
    color: '#666',
    marginTop: 4,
  },
  deliveryAddressContainer: {
    marginTop: 8,
  },
  deliveryAddressTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  paymentButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spacer: {
    height: 40,
  },
});

export default CheckoutScreen;
