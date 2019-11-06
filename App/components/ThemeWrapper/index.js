import React from 'react';
import {connect} from 'react-redux';
import {TouchableOpacity, Text} from 'react-native';
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
    const {theme} = this.props;
    return (
      <React.Fragment>
        <PostBottomActions />
        <PostMediaModal />
        <ChannelJoinModalAlert />
        {/* <DeepLinking /> */}
        <TouchableOpacity
          onPress={this.props.changeTheme}
          style={{paddingBottom: 10}}>
          <Text>Change theme</Text>
        </TouchableOpacity>
        <Navigator
          ref={navigatorRef => {
            if (navigatorRef) {
              NavigationService.setTopLevelNavigator(navigatorRef);
            }
          }}
          screenProps={{theme}}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});

export default connect(
  mapStateToProps,
  {changeTheme},
)(ThemeWrapper);
