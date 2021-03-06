import React from 'react';
import {connect} from 'react-redux';
import {
  // TouchableOpacity,
  // Text,
  // SafeAreaView,
  StatusBar,
  // Platform,
  View,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import ChannelJoinModalAlert from '../ChannelJoinModalAlert';
import PostBottomActions from '../PostBottomActions';
import PostMediaModal from '../PostMediaModal';
import Navigator from '../../config/Navigator';
import NavigationService from '../../config/NavigationService';
import styles, {defaultConfig} from '../../config/styles';
import {changeTheme} from '../../actions/themeManager';
import ChartPopup from '../chart-popup';
import ChartModal from '../chart-modal';

class ThemeWrapper extends React.Component {
  constructor(props) {
    super(props);
    styles(defaultConfig);
  }

  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    const {theme, themeName} = this.props;
    return (
      <React.Fragment>
        <ChartModal>
          <ChartPopup />
        </ChartModal>
        <PostBottomActions />
        <PostMediaModal />
        <ChannelJoinModalAlert />
        <Navigator
          ref={navigatorRef => {
            if (navigatorRef) {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }
          }}
          screenProps={{theme, themeName}}
        />
        <View>
          <StatusBar
            barStyle={theme.barStyleColor}
            backgroundColor={theme.primaryBackgroundColor}
          />
        </View>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({themes}) => ({
  theme: themes[themes.current],
  themeName: themes.current,
});

export default connect(
  mapStateToProps,
  {changeTheme},
)(ThemeWrapper);
