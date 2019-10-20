import React from 'react';
import {
  ActivityIndicator
} from 'react-native';


const LoadingSpinner = ({ size, color }) => <ActivityIndicator size={size} color={color} />;

LoadingSpinner.defaultProps = {
  size: 'large',
  color: '#3FB87F'
};


export default React.memo(LoadingSpinner);
