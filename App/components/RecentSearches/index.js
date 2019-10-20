import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

import styles from './styles';

export class SearchResults extends PureComponent {
  getRecentItem() {
    return (
      <View style={styles.recentItem}>
        <Text style={styles.recentText}>
          test
        </Text>
        <Text>X</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}> Recent Searches </Text>
        </View>
        <View style={styles.body}>
          {this.getRecentItem()}
          {this.getRecentItem()}
          {this.getRecentItem()}
        </View>
      </View>
    );
  }
}

export default SearchResults;
