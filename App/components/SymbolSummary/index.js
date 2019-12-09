import React, {PureComponent} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import JoinButton from '../JoinButton';

import styles from './styles';

class SymbolSummary extends PureComponent {
  // static propTypes = {};
  renderChangePrice = () => {
    const {theme, change_percent} = this.props;
    const color = change_percent > 0 ? '#17C491' : '#FC3E30';
    return (
      <View style={[styles.priceChangeContainer, {backgroundColor: color}]}>
        <Text
          style={[
            styles.priceChangeListView,
            {color: theme.primaryBackgroundColor},
          ]}>{`${parseFloat(change_percent).toFixed(2)}%`}</Text>
      </View>
    );
  };

  renderJoin = () => {
    const {channelId} = this.props;
    return <JoinButton channelId={channelId} />;
  };

  handleOnPress = () => {
    this.props.onPress();
  };

  render() {
    const {name, header, theme, latest_price, hidde_prices, join} = this.props;
    return (
      <TouchableOpacity onPress={this.handleOnPress} style={styles.container}>
        <View style={styles.lefContainer}>
          <Text style={[styles.pair, {color: theme.primaryTextColor}]}>
            {name}
          </Text>
          <Text style={styles.header}>{header}</Text>
        </View>
        {join && this.renderJoin()}
        {!hidde_prices && (
          <View style={styles.rows}>
            <Text style={[styles.label, {color: theme.primaryTextColor}]}>
              ${latest_price}
            </Text>
            {this.renderChangePrice()}
          </View>
        )}
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SymbolSummary);
