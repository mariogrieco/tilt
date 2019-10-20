import React from 'react';
import {
  DrawerItems,
  ScrollView,
  SafeAreaView
} from 'react-navigation';

const LoggedInDrawer = props => (
  <ScrollView>
    <SafeAreaView>
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
);

export default LoggedInDrawer;
