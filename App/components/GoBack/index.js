import React from 'react';
import {TouchableOpacity, Image} from 'react-native';

const GoBack = ({onPress, style, icon}) => (
  <TouchableOpacity
    style={[{paddingHorizontal: 15, paddingVertical: 13}, style]}
    onPress={onPress}>
    <Image source={icon} />
  </TouchableOpacity>
);

export default GoBack;
