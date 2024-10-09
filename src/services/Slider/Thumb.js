import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import * as Constant from '../../constants/globalConstant';

const THUMB_RADIUS = 12;

const Thumb = () => {
  return (
    <View style={styles.root}/>
  );
};

const styles = StyleSheet.create({
  root: {
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    borderWidth: 1,
    borderColor: Constant.whiteColor,
    backgroundColor: Constant.primaryColor,
  },
});

export default memo(Thumb);
