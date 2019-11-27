import React, {PureComponent} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';

import styles from './styles';

class SymbolSummary extends PureComponent {
  renderChangePrice = (price = 0) => {
    const color = price > 0 ? '#17C491' : '#FC3E30';
    const {theme} = this.props;
    return (
      <View style={[styles.priceChangeContainer, {backgroundColor: color}]}>
        <Text
          style={[
            styles.priceChangeListView,
            {color: theme.primaryBackgroundColor},
          ]}>{`${parseFloat(price).toFixed(2)}%`}</Text>
      </View>
    );
  };

  parseHeader(name) {
    if (name.length > 20) {
      return `${name.slice(0, 20)}...`;
    }
    return name.slice(0, 20);
  }

  render() {
    const {name, header, theme} = this.props;
    return (
      <TouchableOpacity onPress={this.handleOnPress} style={styles.container}>
        <View style={styles.lefContainer}>
          <Text style={[styles.pair, {color: theme.primaryTextColor}]}>
            {name}
          </Text>
          <Text style={styles.header}>{this.parseHeader(header)}</Text>
          {/* <View styles={{alignSelf: 'center'}}>
            <MiniChart symbol={symbol} color={color} />
          </View> */}
        </View>
        <View style={styles.rows}>
          <Text style={styles.label}>0.00%</Text>
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
