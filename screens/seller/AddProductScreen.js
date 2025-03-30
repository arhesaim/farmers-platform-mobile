// screens/seller/AddProductScreen.js
import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Switch,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {ProductContext} from '../../context/ProductContext';
import {LocationContext} from '../../context/LocationContext';
import * as ImagePicker from 'expo-image-picker';

const AddProductScreen = ({navigation}) => {
  const {addProduct} = useContext(ProductContext);
  const {currentLocation, getLocationName} = useContext(LocationContext);

  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('vegetables');
  const [images, setImages] = useState([]);
  const [allowDelivery, setAllowDelivery] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.uri]);
    }
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!productName || !price || !quantity) {
      alert('Please fill in all required fields');
      return;
    }

    const locationName = await getLocationName(currentLocation);

    const newProduct = {
      name: productName,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category,
      location: currentLocation,
      locationName,
      images,
      allowDelivery,
      createdAt: new Date().toISOString(),
      // This will be used to auto-expire after 8 hours
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    };

    await addProduct(newProduct);
    navigation.navigate('SellerDashboard');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Product Name *</Text>
      <TextInput
        style={styles.input}
        value={productName}
        onChangeText={setProductName}
        placeholder="What are you selling?"
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Describe your product"
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Price (€) *</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="0.00"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Quantity Available *</Text>
      <TextInput
        style={styles.input}
        value={quantity}
        onChangeText={setQuantity}
        placeholder="How many units?"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={category}
        onValueChange={itemValue => setCategory(itemValue)}>
        <Picker.Item label="Vegetables" value="vegetables" />
        <Picker.Item label="Fruits" value="fruits" />
        <Picker.Item label="Dairy" value="dairy" />
        <Picker.Item label="Bakery" value="bakery" />
        <Picker.Item label="Other" value="other" />
      </Picker>

      <Text style={styles.label}>Product Images</Text>
      <Button title="Add Image" onPress={pickImage} />
      <View style={styles.imagesPreview}>
        {images.length > 0 ? (
          <Text>{images.length} images selected</Text>
        ) : (
          <Text>No images selected</Text>
        )}
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Allow Delivery</Text>
        <Switch value={allowDelivery} onValueChange={setAllowDelivery} />
      </View>

      <Text style={styles.note}>
        Your listing will automatically expire after 8 hours.
      </Text>

      <Button title="Add Product" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagesPreview: {
    marginVertical: 16,
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  note: {
    fontSize: 14,
    color: '#666',
    marginVertical: 16,
    fontStyle: 'italic',
  },
});

export default AddProductScreen;
