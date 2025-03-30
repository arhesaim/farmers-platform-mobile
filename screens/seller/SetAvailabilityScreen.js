// screens/seller/SetAvailabilityScreen.js
import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {UserContext} from '../../context/UserContext';
import {LocationContext} from '../../context/LocationContext';

const SetAvailabilityScreen = () => {
  const {user, updateUser} = useContext(UserContext);
  const {getLocationName} = useContext(LocationContext);

  const [availabilityTimes, setAvailabilityTimes] = useState(
    user?.availabilityTimes || [],
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [newAvailability, setNewAvailability] = useState({
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // Default 2 hours later
    location: user?.currentLocation || null,
    locationName: '',
  });

  useEffect(() => {
    if (newAvailability.location) {
      getLocationName(newAvailability.location).then(name =>
        setNewAvailability({...newAvailability, locationName: name}),
      );
    }
  }, [newAvailability.location]);

  const handleDateChange = (event, selectedDate) => {
    setNewAvailability({...newAvailability, date: selectedDate});
  };

  const handleStartTimeChange = (event, selectedTime) => {
    setShowStartPicker(false);
    if (selectedTime) {
      setNewAvailability({...newAvailability, startTime: selectedTime});
    }
  };

  const handleEndTimeChange = (event, selectedTime) => {
    setShowEndPicker(false);
    if (selectedTime) {
      setNewAvailability({...newAvailability, endTime: selectedTime});
    }
  };

  const addAvailability = () => {
    const newItem = {
      id: Date.now().toString(),
      date: newAvailability.date.toISOString().split('T')[0],
      startTime: newAvailability.startTime
        .toTimeString()
        .split(' ')[0]
        .substring(0, 5),
      endTime: newAvailability.endTime
        .toTimeString()
        .split(' ')[0]
        .substring(0, 5),
      location: newAvailability.location,
      locationName: newAvailability.locationName,
    };

    const updatedTimes = [...availabilityTimes, newItem];
    setAvailabilityTimes(updatedTimes);

    // Update user profile
    updateUser({
      ...user,
      availabilityTimes: updatedTimes,
    });
  };

  const removeAvailability = id => {
    const updatedTimes = availabilityTimes.filter(item => item.id !== id);
    setAvailabilityTimes(updatedTimes);

    // Update user profile
    updateUser({
      ...user,
      availabilityTimes: updatedTimes,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Availability</Text>
      <Text style={styles.subtitle}>
        Let buyers know when and where they can pick up products from you
      </Text>

      <View style={styles.formContainer}>
        <Button title="Select Date" onPress={() => setShowStartPicker(true)} />

        {showStartPicker && (
          <DateTimePicker
            value={newAvailability.date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        <View style={styles.timeContainer}>
          <View style={styles.timeField}>
            <Text style={styles.label}>Start Time</Text>
            <Button
              title={newAvailability.startTime
                .toTimeString()
                .split(' ')[0]
                .substring(0, 5)}
              onPress={() => setShowStartPicker(true)}
            />
          </View>

          <View style={styles.timeField}>
            <Text style={styles.label}>End Time</Text>
            <Button
              title={newAvailability.endTime
                .toTimeString()
                .split(' ')[0]
                .substring(0, 5)}
              onPress={() => setShowEndPicker(true)}
            />
          </View>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={newAvailability.startTime}
            mode="time"
            display="default"
            onChange={handleStartTimeChange}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={newAvailability.endTime}
            mode="time"
            display="default"
            onChange={handleEndTimeChange}
          />
        )}

        <Text style={styles.locationText}>
          Location:{' '}
          {newAvailability.locationName || 'Current location will be used'}
        </Text>

        <Button title="Add Availability" onPress={addAvailability} />
      </View>

      <Text style={styles.sectionTitle}>Your Scheduled Availabilities</Text>

      <FlatList
        data={availabilityTimes}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.availabilityItem}>
            <View style={styles.availabilityDetails}>
              <Text style={styles.dateText}>{item.date}</Text>
              <Text>
                {item.startTime} - {item.endTime}
              </Text>
              <Text style={styles.locationName}>{item.locationName}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeAvailability(item.id)}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No scheduled availabilities. Add some times when you'll be
            available.
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  formContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  timeField: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  locationText: {
    marginVertical: 16,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  availabilityItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availabilityDetails: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationName: {
    color: '#666',
    marginTop: 4,
  },
  removeButton: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#666',
  },
});

export default SetAvailabilityScreen;
