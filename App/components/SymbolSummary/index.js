import React, {PureComponent} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';

import styles from './styles';

class SymbolSummary extends PureComponent {
  renderChangePrice = () => {
    const {theme, change_percent} = this.props;
    const color = change_percent > 0 ? '#17C491' : '#FC3E30';
    return (
      <View style={[styles.priceChangeContainer, {backgroundColor: color}]}>
        <Text
          style={[
            styles.priceChangeListView,
            {color: theme.primaryBackgroundColor},
          ]}>{`${parseFloat(change_percent * 100).toFixed(2)}%`}</Text>
      </View>
    );
  };

  handleOnPress = () => {
    this.props.onPress();
  };

  render() {
    const {name, header, theme, latest_price} = this.props;
    return (
      <TouchableOpacity onPress={this.handleOnPress} style={styles.container}>
        <View style={styles.lefContainer}>
          <Text style={[styles.pair, {color: theme.primaryTextColor}]}>
            {name}
          </Text>
          <Text style={styles.header}>{header}</Text>
          {/*
            <View styles={{alignSelf: 'center'}}>
              <MiniChart symbol={symbol} color={color} />
            </View>
          */}
        </View>
        <View style={styles.rows}>
          <Text style={styles.label}>{latest_price}%</Text>
          {this.renderChangePrice()}
        </View>
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
