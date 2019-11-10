import React, {PureComponent} from 'react';
import {Text, View} from 'react-native';
import moment from 'moment';
import Separator from '../Separator';

import styles from './styles';
import {connect} from 'react-redux';

export class SeparatorContainer extends PureComponent {
  render() {
    const {createdAt, noPadding} = this.props;
    const {theme} = this.props;
    return (
      <View style={[styles.separator, noPadding ? {padding: 0} : {}]}>
        <View style={{flex: 1}}>
          <Separator />
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={[styles.separatorText, {color: theme.primaryTextColor}]}>
            {createdAt ? moment(createdAt).format('ddd, MMM D, YYYY') : 'Today'}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Separator />
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});
export default connect(mapStateToProps)(SeparatorContainer);
