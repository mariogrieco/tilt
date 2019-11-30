import React from 'react';
import {Dimensions, FlatList} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {NavigationActions} from 'react-navigation';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {connect} from 'react-redux';
import GoBack from '../components/GoBack';
import UserFollow from '../components/UserFollow';
import {headerForScreenWithTabs} from '../config/navigationHeaderStyle';
import getFollows from '../actions/follow';

const {width} = Dimensions.get('window');

class Follow extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('title', 'hola'),
    headerLeft: (
      <GoBack onPress={() => navigation.dispatch(NavigationActions.back())} />
    ),
    ...headerForScreenWithTabs(),
  });

  state = {
    index: this.props.navigation.getParam('activeTab', 0),
    routes: [
      {key: 'following', title: 'FOLLOWING'},
      {key: 'followers', title: 'FOLLOWERS'},
    ],
  };

  renderItem = ({item}) => {
    return <UserFollow userId={item} />;
  };

  buildList = paramKey => {
    const {navigation} = this.props;
    const data = navigation.getParam(paramKey, []);
    return (
      <FlatList
        data={data}
        renderItem={this.renderItem}
        keyExtractor={item => item}
      />
    );
  };

  Followers = () => this.buildList('followers');

  Following = () => this.buildList('following');

  render() {
    const {theme} = this.props;

    return (
      <TabView
        navigationState={{...this.state}}
        renderScene={SceneMap({
          following: this.Following,
          followers: this.Followers,
        })}
        onIndexChange={index => this.setState({index})}
        initialLayout={{width}}
        renderTabBar={props => (
          <TabBar
            {...props}
            style={[
              styles.tabBar,
              {
                backgroundColor: theme.primaryBackgroundColor,
                borderBottomColor: theme.borderBottomColor,
              },
            ]}
            labelStyle={styles.label}
            indicatorStyle={styles.indicator}
            activeColor="#17C491"
            inactiveColor="#585C63"
          />
        )}
        //swipeEnabled={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DCDCDC',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  label: {
    fontSize: 14,
    letterSpacing: 0.1,
    fontFamily: 'SFProDisplay-Bold',
  },
  indicator: {
    backgroundColor: '#17C491',
    height: 3,
  },
});

const mapDispatchToProps = {
  getFollows,
};

const mapStateToProps = ({follows, themes, login}) => ({
  loggedUserId: login.user ? login.user.id : '',
  follows,
  theme: themes[themes.current],
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Follow);
