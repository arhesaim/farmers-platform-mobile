// screens/seller/SellerDashboard.js
import React, {useEffect, useState, useContext} from 'react';
import {View, Text, StyleSheet, Button, FlatList} from 'react-native';
import {LocationContext} from '../../context/LocationContext';
import {ProductContext} from '../../context/ProductContext';
import ProductCard from '../../components/ProductCard';

const SellerDashboard = ({navigation}) => {
  const {currentLocation, getLocationName} = useContext(LocationContext);
  const {sellerProducts, loadSellerProducts} = useContext(ProductContext);
  const [locationName, setLocationName] = useState('Loading location...');

  useEffect(() => {
    loadSellerProducts();
    if (currentLocation) {
      getLocationName(currentLocation).then(name => setLocationName(name));
    }
  }, [currentLocation]);

  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <Text style={styles.locationText}>
          Current Location: {locationName}
        </Text>
        <Button
          title="Update Location"
          onPress={() => navigation.navigate('UpdateLocation')}
        />
      </View>

      <View style={styles.actionsContainer}>
        <Button
          title="Add New Product"
          onPress={() => navigation.navigate('AddProduct')}
        />
        <Button
          title="Manage Products"
          onPress={() => navigation.navigate('ManageProducts')}
        />
        <Button
          title="Set Availability Times"
          onPress={() => navigation.navigate('SetAvailability')}
        />
      </View>

      <Text style={styles.sectionTitle}>Your Active Products</Text>
      <Text style={styles.note}>
        Products are automatically removed after 8 hours
      </Text>

      <FlatList
        data={sellerProducts}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ManageProducts')}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No active products. Add some products to start selling!
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
  },
  locationContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  note: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#666',
  },
});

export default SellerDashboard;
