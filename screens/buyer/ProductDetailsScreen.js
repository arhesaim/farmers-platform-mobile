// screens/buyer/ProductDetailsScreen.js
import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {ProductContext} from '../../context/ProductContext';
import {CartContext} from '../../context/CartContext';
import {LocationContext} from '../../context/LocationContext';

const ProductDetailsScreen = ({route, navigation}) => {
  const {productId} = route.params;
  const {getProductById} = useContext(ProductContext);
  const {addToCart} = useContext(CartContext);
  const {currentLocation, calculateDistance} = useContext(LocationContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [distance, setDistance] = useState(null);
  const [sellerAvailability, setSellerAvailability] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const productData = await getProductById(productId);
      setProduct(productData);

      // Calculate distance
      if (productData.location && currentLocation) {
        const dist = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          productData.location.latitude,
          productData.location.longitude,
        );
        setDistance(dist);
      }

      // Fetch seller availability
      // This would fetch from your backend in a real app
      setSellerAvailability(productData.seller.availabilityTimes || []);
    };

    fetchProduct();
  }, [productId, currentLocation]);

  const increaseQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    } else {
      Alert.alert(
        'Maximum quantity',
        'You have reached the maximum available quantity',
      );
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      product,
      quantity,
      price: product.price,
    });
    Alert.alert(
      'Added to Cart',
      `${quantity} x ${product.name} added to your cart`,
      [
        {text: 'Continue Shopping', style: 'cancel'},
        {text: 'Go to Cart', onPress: () => navigation.navigate('Cart')},
      ],
    );
  };

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading product...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {product.images && product.images.length > 0 ? (
        <Image
          source={{uri: product.images[0]}}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noImage}>
          <Ionicons name="image-outline" size={60} color="#ccc" />
          <Text style={styles.noImageText}>No image available</Text>
        </View>
      )}

      <View style={styles.headerContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>€{product.price.toFixed(2)}</Text>
      </View>

      <View style={styles.sellerContainer}>
        <Text style={styles.sellerLabel}>Seller: {product.seller.name}</Text>
        <Text style={styles.locationText}>
          <Ionicons name="location-outline" size={16} color="#666" />
          {product.locationName}
          {distance !== null && ` (${distance.toFixed(1)} km away)`}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        <Text style={styles.availabilityNote}>
          This listing expires in {getRemainingTime(product.expiresAt)}
        </Text>
        <Text style={styles.stockText}>{product.quantity} units available</Text>
      </View>

      {sellerAvailability.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller Schedule</Text>
          <Text style={styles.scheduleSub}>
            Pickup available at these times:
          </Text>
          {sellerAvailability.map((item, index) => (
            <View key={index} style={styles.scheduleItem}>
              <Text style={styles.scheduleDate}>{formatDate(item.date)}</Text>
              <Text>
                {item.startTime} - {item.endTime}
              </Text>
              <Text style={styles.scheduleLocation}>{item.locationName}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Options</Text>
        <View style={styles.deliveryOption}>
          <Ionicons name="person-outline" size={20} color="#333" />
          <Text style={styles.deliveryText}>Pickup from seller location</Text>
        </View>

        {product.allowDelivery && (
          <View style={styles.deliveryOption}>
            <Ionicons name="bicycle-outline" size={20} color="#333" />
            <Text style={styles.deliveryText}>Delivery available</Text>
          </View>
        )}
      </View>

      <View style={styles.quantityContainer}>
        <Text style={styles.quantityTitle}>Quantity:</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={decreaseQuantity}
            disabled={quantity <= 1}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.quantityValue}>{quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={increaseQuantity}
            disabled={quantity >= product.quantity}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.addToCartButton}
        onPress={handleAddToCart}>
        <Ionicons name="cart-outline" size={20} color="#fff" />
        <Text style={styles.addToCartText}>
          Add to Cart - €{(product.price * quantity).toFixed(2)}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Helper functions
const getRemainingTime = expiresAt => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry - now;

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
};

const formatDate = dateString => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
  },
  noImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    marginTop: 8,
    color: '#999',
  },
  headerContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  sellerContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  sellerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  availabilityNote: {
    fontSize: 14,
    color: '#e67e22',
    marginBottom: 8,
  },
  stockText: {
    fontSize: 14,
    color: '#333',
  },
  scheduleSub: {
    fontSize: 14,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  scheduleItem: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  scheduleDate: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scheduleLocation: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryText: {
    fontSize: 16,
    marginLeft: 8,
  },
  quantityContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    backgroundColor: '#f0f0f0',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  addToCartButton: {
    margin: 16,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ProductDetailsScreen;
