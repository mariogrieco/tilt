import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Text, View, TouchableOpacity} from 'react-native';
import {navigateIfExists} from '../../actions/channels';
import ChartContainer from './line-chart-container';
import styles from './styles';
import {closePopup} from '../../actions/chartPopup';

const ChartPopup = () => {
  const dispatch = useDispatch();
  let state = useSelector(_state => _state.chartPopup);
  const theme = useSelector(_state => _state.themes[_state.themes.current]);
  let symbol_name = state.symbol;
  if (symbol_name) {
    symbol_name = symbol_name.replace('$', '');
    symbol_name = symbol_name.replace('#', '');
    symbol_name = symbol_name.toUpperCase();
  }
  const onNavigateIfExists = () => {
    dispatch(closePopup());
    dispatch(navigateIfExists(state.symbol.toLowerCase()));
  };

  const colorIsRed = state.changePercent < 0;

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme.primaryBackgroundColor},
      ]}>
      <View style={styles.headerContainer}>
        <Text style={styles.symbolTitle}> {symbol_name} </Text>
        <View>
          <Text style={[styles.price, {color: theme.popupPriceColor}]}>
            {state.price}
          </Text>
          <Text
            style={[styles.symbolPercent, colorIsRed ? styles.redPercent : {}]}>
            {state.change} ({state.changePercent}%)
          </Text>
        </View>
      </View>
      <ChartContainer isRed={colorIsRed} symbol={symbol_name} />
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={onNavigateIfExists}>
          <Text style={[styles.btnText, {color: theme.popupBtnTextColor}]}>
            {state.is_chat ? 'Chat' : 'Join'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChartPopup;
