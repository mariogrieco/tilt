import React from 'react';
import {Dimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import StyleSheet from 'react-native-extended-stylesheet';
import isEqual from 'lodash/isEqual';
import Flagged from '../components/Flagged';
import PrivateMessages from '../components/PrivateMessages';
import {headerForScreenWithTabs} from '../config/navigationHeaderStyle';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  tabBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DCDCDC',
    borderTopWidth: 0,
    shadowColor: '#D9D8D7',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    backgroundColor: '#fff',
  },
  label: {
    // color: '#0E141E',
    fontSize: 14,
    fontFamily: 'SFProDisplay-Bold',
    letterSpacing: 0.1,
  },
  indicator: {
    backgroundColor: '#17C491',
    // backgroundColor: 'rgba(16, 115, 240, 0.75)',
    height: 3,
  },
});

class Messages extends React.Component {
  static navigationOptions = () => ({
    title: 'Messages',
    ...headerForScreenWithTabs,
    headerTitleStyle: {
      fontSize: 18,
      fontFamily: 'SFProDisplay-Bold',
      marginTop: 10,
      marginBottom: 10,
      letterSpacing: 0.1,
    },
  });

  state = {
    index: 0,
    routes: [
      {key: 'messages', title: 'INBOX'},
      {key: 'flagged', title: 'FLAGGED'},
    ],
  };

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state);
  }

  render() {
    return (
      <React.Fragment>
        <TabView
          navigationState={{...this.state}}
          renderScene={SceneMap({
            messages: PrivateMessages,
            flagged: Flagged,
          })}
          onIndexChange={index => this.setState({index})}
          initialLayout={{width}}
          renderTabBar={props => (
            <TabBar
              {...props}
              style={styles.tabBar}
              labelStyle={styles.label}
              indicatorStyle={styles.indicator}
              activeColor={'#17C491'}
              inactiveColor={'#585C63'}
            />
          )}
          //swipeEnabled={false}
        />
      </React.Fragment>
    );
  }
}

export default Messages;
