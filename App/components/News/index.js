import React, {PureComponent} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import moment from 'moment';

import styles from './styles';
import {withNavigation} from 'react-navigation';
import {connect} from 'react-redux';

class News extends PureComponent {
  render() {
    const {headline, source, image, datetime, theme} = this.props;
    return (
      <TouchableOpacity style={styles.container} activeOpacity={1}>
        <View style={styles.left}>
          <Text style={[styles.title, {color: theme.primaryTextColor}]}>
            {headline}
          </Text>
          <Text style={styles.span}>
            {source} - {moment(datetime).fromNow(true)}
          </Text>
        </View>
        <Image source={{uri: image}} style={[styles.image, styles.right]} />
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});

export default withNavigation(connect(mapStateToProps)(News));
