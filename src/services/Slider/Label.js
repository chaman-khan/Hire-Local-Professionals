import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Constant from '../../constants/globalConstant';

const Label = ({ text, ...restProps }) => {
  return (
    <View style={styles.root} {...restProps}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 8,
    backgroundColor: Constant.primaryColor,
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    color: Constant.whiteColor,
  },
});

export default memo(Label);
