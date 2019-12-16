import React from 'react';
import {Dimensions, FlatList} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import {NavigationActions} from 'react-navigation';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {connect} from 'react-redux';
import _ from 'lodash';
import GoBack from '../components/GoBack';
import UserFollow from '../components/UserFollow';
import Separator from '../components/Separator';
import {headerForScreenWithTabs} from '../config/navigationHeaderStyle';

const {width} = Dimensions.get('window');

class Follow extends React.Component {
  static navigationOptions = ({navigation, screenProps}) => ({
    title: navigation.getParam('title', 'hola'),
    headerLeft: (
      <GoBack onPress={() => navigation.dispatch(NavigationActions.back())} />
    ),
    ...headerForScreenWithTabs({
      headerTintColor: screenProps.theme.headerTintColor,
      headerStyle: {
        backgroundColor: screenProps.theme.primaryBackgroundColor,
        borderBottomColor: screenProps.theme.borderBottomColor,
      },
    }),
  });

  state = {
    index: this.props.navigation.getParam('activeTab', 0),
    routes: [
      {key: 'following', title: 'FOLLOWING'},
      {key: 'followers', title: 'FOLLOWERS'},
    ],
    temporalFollowings: [],
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.follow.following.length > this.props.follow.following.length
    ) {
      const temporalFollowings = _.xor(
        prevProps.follow.following,
        this.props.follow.following,
      );
      this.setState(state => ({
        temporalFollowings: _.uniq(
          _.concat(state.temporalFollowings, temporalFollowings),
        ),
      }));
    }
  }

  renderItem = ({item}) => {
    return <UserFollow userId={item} />;
  };

  buildList = paramKey => {
    const {follow, users, theme} = this.props;
    const {temporalFollowings} = this.state;
    const data =
      paramKey === 'followers'
        ? follow[paramKey]
        : [...follow[paramKey], ...temporalFollowings];

    if (paramKey === 'following') console.log('data a renderizar ', data);
    const sortedValues =
      paramKey === 'followers'
        ? _.sortBy(data, [userId => users.data[userId].username])
        : _.sortedUniq(_.sortBy(data, [userId => users.data[userId].username]));

    return () => (
      <FlatList
        data={sortedValues}
        renderItem={this.renderItem}
        keyExtractor={item => item}
        ItemSeparatorComponent={Separator}
        extraData={follow}
        style={{
          flex: 1,
          backgroundColor: theme.primaryBackgroundColor,
        }}
      />
    );
  };

  followers = () => this.buildList('followers');

  following = () => this.buildList('following');

  render() {
    const {theme} = this.props;
    const FollowerList = this.followers();
    const FollowingList = this.following();
    return (
      <TabView
        navigationState={{...this.state}}
        renderScene={SceneMap({
          following: FollowingList,
          followers: FollowerList,
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

const mapStateToProps = ({
  themes,
  login,
  users,
  loggedUserFollow,
  currentFollowUserData,
}) => {
  const follow =
    login.user.id === users.currentUserIdProfile
      ? loggedUserFollow
      : currentFollowUserData;

  return {
    loggedUserId: login.user ? login.user.id : '',
    theme: themes[themes.current],
    follow,
    users,
  };
};

export default connect(mapStateToProps)(Follow);
