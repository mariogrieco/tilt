import React from 'react';
import {FlatList} from 'react-native';
import CryptoItem from '../CryptoItem';
// import { cryptos } from '../../utils/data';

export default class CryptoList extends React.PureComponent {
  renderItem = ({item}) => <CryptoItem {...item} />;

  render() {
    return (
      <FlatList
        data={[]}
        renderItem={this.renderItem}
        keyExtractor={item => item.name}
        keyboardDismissMode="on-drag"
      />
    );
  }
}
