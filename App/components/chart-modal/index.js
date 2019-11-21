import React, {useCallback} from 'react';
import {View} from 'react-native';
import {closePopup} from '../../actions/chartPopup';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modal';

import styles from './styles';

const ChartModal = ({children}) => {
  const chartPopupModalIsActive = useSelector(
    state => state.chartPopup.isActive,
  );
  const dispatch = useDispatch();
  const closePopupCallback = useCallback(
    () => dispatch(closePopup()),
    [dispatch],
  );
  return (
    <Modal
      isVisible={chartPopupModalIsActive}
      onBackdropPress={closePopupCallback}>
      <View style={styles.container}>{children}</View>
    </Modal>
  );
};

export default ChartModal;
