// screens/buyer/BuyerDashboard.js
import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {ProductContext} from '../../context/ProductContext';
import {LocationContext} from '../../context/LocationContext';
import ProductCard from '../../components/ProductCard';
import Slider from '@react-native-community/slider';

const BuyerDashboard = ({navigation}) => {
  const {products, loadProducts} = useContext(ProductContext);
  const {currentLocation, getLocationName} = useContext(LocationContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [locationName, setLocationName] = useState('Loading location...');
  const [maxDistance, setMaxDistance] = useState(10); // km
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    loadProducts();
    if (currentLocation) {
      getLocationName(currentLocation).then(name => setLocationName(name));
    }
  }, [currentLocation]);

  useEffect(() => {
    // Filter products based on search, category, and distance
    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        product => product.category === selectedCategory,
      );
    }

    // Filter by distance
    filtered = filtered.filter(product => {
      // This is a simplified distance calculation
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        product.location.latitude,
        product.location.longitude,
      );
      return distance <= maxDistance;
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, maxDistance, currentLocation]);

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = deg => {
    return deg * (Math.PI / 180);
  };

  const categories = [
    {id: 'all', name: 'All'},
    {id: 'vegetables', name: 'Vegetables'},
    {id: 'fruits', name: 'Fruits'},
    {id: 'dairy', name: 'Dairy'},
    {id: 'bakery', name: 'Bakery'},
    {id: 'other', name: 'Other'},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>Near: {locationName}</Text>
        <TouchableOpacity
          style={styles.locationButton}
          onPress={() => navigation.navigate('UpdateLocation')}>
          <Ionicons name="location-outline" size={18} color="#007AFF" />
          <Text style={styles.locationButtonText}>Change</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Max Distance: {maxDistance} km</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={50}
          step={1}
          value={maxDistance}
          onValueChange={setMaxDistance}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#D0D0D0"
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.categoryItem,
                selectedCategory === item.id && styles.selectedCategory,
              ]}
              onPress={() => setSelectedCategory(item.id)}>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item.id && styles.selectedCategoryText,
                ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <ProductCard
            product={item}
            onPress={() =>
              navigation.navigate('ProductDetails', {productId: item.id})
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No products found matching your criteria.
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationButtonText: {
    color: '#007AFF',
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  slider: {
    height: 40,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#eee',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    color: '#666',
  },
});

export default BuyerDashboard;
