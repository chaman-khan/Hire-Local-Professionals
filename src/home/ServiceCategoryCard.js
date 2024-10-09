import {View, Text, ImageBackground} from 'react-native';
import React from 'react';
import styles from '../styles/Style';
import LinearGradient from 'react-native-linear-gradient';
import {decode} from 'html-entities';
import Translation from '../constants/Translation';

const ServiceCategoryCard = ({item}) => {
  return (
    <ImageBackground
      style={styles.serviceCatCardParentStyle}
      imageStyle={{
        borderRadius: 10,
      }}
      source={item.category_image != "" ? {uri: item.category_image}:require("../../assets/images/NoImage.png")}>
      <LinearGradient
        style={styles.serviceCatCardGradientStyle}
        colors={['#00000020', '#00000080', '#00000095']}>
        <View
          style={{
            alignItems: 'flex-start',
            padding: 15,
          }}>
          <View style={styles.serviceCatCardcountParentStyle}>
            <Text style={styles.serviceCatCardCountTextStyle}>
              {item.attached_listings >= 2
                ? item.attached_listings+" " + Translation.homeListings
                : item.attached_listings+" " + Translation.homeListing}
            </Text>
          </View>
          <Text style={styles.seviceCatcardtextStyle}>{decode(item.name)}</Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

export default ServiceCategoryCard;
