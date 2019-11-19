import React, {PureComponent} from 'react';
import {Text, View, TouchableHighlight, Image} from 'react-native';
import {connect} from 'react-redux';
import getUserProfilePicture from '../../selectors/getUserProfilePicture';

import styles from './styles';

class UserMentionPreview extends PureComponent {
  handleOnPress = () => {
    const {username} = this.props;
    this.props.onMention(`${username}`);
  };

  render() {
    const {id, last_picture_update, username, theme} = this.props;
    return (
      <TouchableHighlight
        underlayColor="#17C491"
        onPress={this.handleOnPress}
        style={{backgroundColor: theme.primaryBackgroundColor}}>
        <View style={styles.mentions}>
          <Image
            style={styles.mentionsProfileImage}
            source={{uri: getUserProfilePicture(id, last_picture_update)}}
          />
          <Text
            style={[
              styles.commandContainer,
              styles.mentionsColor,
              {color: theme.primaryTextColor},
            ]}>
            {username}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const mapStateToProps = ({themes}) => ({theme: themes[themes.current]});

export default connect(mapStateToProps)(UserMentionPreview);
