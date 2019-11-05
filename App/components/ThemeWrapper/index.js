import React from 'react';
import {connect} from 'react-redux';
import StyleSheet from 'react-native-extended-stylesheet';
import ChannelJoinModalAlert from '../ChannelJoinModalAlert';
import PostBottomActions from '../PostBottomActions';
import PostMediaModal from '../PostMediaModal';
import Navigator from '../../config/Navigator';
import NavigationService from '../../config/NavigationService';
import styles, {DarkTheme, LightTheme} from '../../config/styles';

class ThemeWrapper extends React.Component {
  state = {
    shouldRender: true,
  };

  constructor(props) {
    super(props);
    const {theme} = props;
    if (theme === 'light') {
      styles(LightTheme);
    } else {
      styles(DarkTheme);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.theme !== nextProps.theme ||
      this.state.shouldRender !== nextState.shouldRender
    );
  }

  componentDidUpdate() {
    const {theme} = this.props;
    if (theme === 'light') {
      StyleSheet.build(LightTheme);
      this.setState({shouldRender: false}, () =>
        this.setState({shouldRender: true}),
      );
    } else {
      StyleSheet.build(DarkTheme);
      this.setState({shouldRender: false}, () =>
        this.setState({shouldRender: true}),
      );
    }
  }

  render() {
    const {shouldRender} = this.state;
    if (shouldRender) {
      return (
        <React.Fragment>
          <PostBottomActions />
          <PostMediaModal />
          <ChannelJoinModalAlert />
          {/* <DeepLinking /> */}
          <Navigator
            ref={navigatorRef => {
              if (navigatorRef) {
                NavigationService.setTopLevelNavigator(navigatorRef);
              }
            }}
          />
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

ThemeWrapper.defaultProps = {
  theme: 'light',
};

const mapStateToProps = ({theme}) => ({theme});

export default connect(mapStateToProps)(ThemeWrapper);
