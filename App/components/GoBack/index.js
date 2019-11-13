import React from 'react';
import {connect} from 'react-redux';
import {TouchableOpacity, Image} from 'react-native';
import assets from '../ThemeWrapper/assets';

const GoBack = ({onPress, style, themeName}) => (
  <TouchableOpacity
    style={[{paddingHorizontal: 15, paddingVertical: 13}, style]}
    onPress={onPress}>
    <Image source={assets[themeName].BACK} />
  </TouchableOpacity>
);

const mapStateToProps = ({themes}) => ({themeName: themes.current});

export default connect(mapStateToProps)(GoBack);
