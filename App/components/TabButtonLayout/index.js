import React, {PureComponent} from 'react';
import {Text, ScrollView} from 'react-native';
import TabButton from '../TabButton';
import {withNavigation} from 'react-navigation';

import styles from './styles';
import {connect} from 'react-redux';
class TabButtonLayout extends PureComponent {
  onNewPress = () => {
    const {navigation} = this.props;
    navigation.navigate('NewChannels');
  };

  onTrendingChannelsPress = () => {
    const {navigation} = this.props;
    navigation.navigate('TrendingChannels');
  };

  onStocksPress = () => {
    const {navigation} = this.props;
    navigation.navigate('Stocks');
  };

  onCryptos = () => {
    const {navigation} = this.props;
    navigation.navigate('Cryptos');
  };

  onAllPress = () => {
    const {navigation} = this.props;
    navigation.navigate('All');
  };

  render() {
    const {theme} = this.props;
    return (
      <ScrollView
        style={[
          styles.container,
          {backgroundColor: theme.primaryBackgroundColor},
        ]}
        horizontal={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <TabButton
          file_name={'pull'}
          text={'Stocks'}
          onPress={this.onStocksPress}
        />
        <TabButton
          file_name={'bitnami'}
          text={'Cryptos'}
          onPress={this.onCryptos}
        />
        <TabButton
          file_name={'fire'}
          text={'Trending'}
          onPress={this.onTrendingChannelsPress}
        />
        <TabButton file_name={'new'} text={'New'} onPress={this.onNewPress} />
        <TabButton file_name={'all'} text={'All'} onPress={this.onAllPress} />
        <Text>{'   '}</Text>
        <Text>{'   '}</Text>
        <Text>{'   '}</Text>
      </ScrollView>
    );
  }
}

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});

export default withNavigation(connect(mapStateToProps)(TabButtonLayout));
