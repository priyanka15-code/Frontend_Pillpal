import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const Loader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  loadingIndicator: {
    alignSelf: 'center',
  },
});

export default Loader;
