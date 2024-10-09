import React, { memo } from 'react';
import {StyleSheet, View} from 'react-native';
import * as Constant from '../../constants/globalConstant';

const RailSelected = () => {
  return (
    <View style={styles.root}/>
  );
};

export default memo(RailSelected);

const styles = StyleSheet.create({
  root: {
    height: 4,
    backgroundColor: Constant.primaryColor,
    borderRadius: 2,
  },
});
