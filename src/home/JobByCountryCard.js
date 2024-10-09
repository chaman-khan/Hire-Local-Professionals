import {
  View,
  Text,
  Image,
} from 'react-native';
import React from 'react';
import styles from '../styles/Style';
import Translation from '../constants/Translation';

const JobByCountryCard = ({item}) => {
  return (
    <View
    style={styles.jobByCountryCardParentStyle}>
    <Image
      // resizeMode="contain"
      style={[styles.jobbyCountryCardImageStyle,{borderRadius:25}]}
      source={item.country_flag != "" ? {uri:item.country_flag} :require("../../assets/images/NoImage.png")}
    />
    <Text
      style={styles.jobByCountryCardTeztStyle}>
     {item.country_name}
    </Text>
    <Text
      style={styles.jobByCountryCardlistingCountTextStyle}>
      {item.active_jobs} {Translation.homeListings}
    </Text>
  </View>

  )
}

export default JobByCountryCard