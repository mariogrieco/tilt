import React from 'react';
import {connect} from 'react-redux';
import {TouchableOpacity, Text, SafeAreaView} from 'react-native';
import ChannelJoinModalAlert from '../ChannelJoinModalAlert';
import PostBottomActions from '../PostBottomActions';
import PostMediaModal from '../PostMediaModal';
import Navigator from '../../config/Navigator';
import NavigationService from '../../config/NavigationService';
import styles, {defaultConfig} from '../../config/styles';
import {changeTheme} from '../../actions/themeManager';
class ThemeWrapper extends React.Component {
  constructor(props) {
    super(props);
    styles(defaultConfig);
  }

  render() {
    const {theme, themeName} = this.props;
    return (
      <React.Fragment>
        <PostBottomActions />
        <PostMediaModal />
        <ChannelJoinModalAlert />
        {/* <DeepLinking /> */}
        <SafeAreaView>
          <TouchableOpacity onPress={this.props.changeTheme}>
            <Text>Change theme</Text>
          </TouchableOpacity>
        </SafeAreaView>
        <Navigator
          ref={navigatorRef => {
            if (navigatorRef) {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }
          }}
          screenProps={{theme, themeName}}
        />
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
