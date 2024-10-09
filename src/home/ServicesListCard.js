import {View, Text, Image, ImageBackground} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import * as Constant from '../constants/globalConstant';
import styles from '../styles/Style';
import FormButton from '../components/FormButton';
import { decode } from "html-entities";
import Translation from '../constants/Translation';

const ServicesListCard = props => {
  
  return (
    <View style={[styles.serviceListCardParentStyle, {width: props.width}]}>
      <ImageBackground
        style={styles.serviceListImageBackgeoundStyle}
        imageStyle={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
        source={props.item.images.length >= 1 ?   {uri : props.item.images[0].url} : require('../../assets/images/NoImage.png')}>
        <View style={styles.serviceListCardImagebackgroundOverlyStyle} />
      </ImageBackground>
      <View style={styles.serviceListCardImageParentStyle}>
        <View style={styles.servisListImageParentStyle}>
          <Image
            resizeMode="contain"
            style={styles.serviceListImageStyle}
            source={{uri: props.item.auther_image}}
          />
        </View>
        {props.item.favorit == 'yes' ? (
          <AntDesign
          style={{alignSelf: 'flex-end'}}
          name={'heart'}
          size={20}
          color={'#FA4753'}
        />
        ) : (
          <AntDesign
            style={{alignSelf: 'flex-end'}}
            name={'hearto'}
            size={20}
            color={Constant.borderColor}
          />
        )}
      </View>
      <View style={styles.serviceListCardNameParentStyle}>
        <Text style={styles.serviceListCardNameStyle}>
          {decode(props.item.auther_title)}
        </Text>
        <AntDesign name={'checkcircle'} size={13} color={'#22C55E'} />
      </View>
      <Text style={styles.serviceListCardTaglineStyle}>{decode(props.item.title)}</Text>
      <View style={styles.serviceListCardReviewParentStyle}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AntDesign name={'star'} size={13} color={'#FFD101'} />
          <Text style={styles.serviceListCardratingTextStyle}>
            {props.item.total_rating}
          </Text>
          <Text style={styles.serviceListCardRatingCountStyle}>
            (
            {props.item.reviews.length >= 2
              ? props.item.reviews.length + Translation.serviceProviderCardReviews
              : props.item.reviews.length + Translation.serviceProviderCardReview}
            )
          </Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Feather name={'eye'} size={13} color={Constant.lightGrayColor} />
          <Text style={styles.serviceListViewstestStyle}>
            {props.item.service_views}
          </Text>
        </View>
      </View>
      <View style={styles.serviceListCardPriceParentStyle}>
        <Text style={styles.serviceListStartingFromTestStyle}>
          {Translation.serviceProviderCardStartingFrom}
        </Text>
        <Text style={styles.serviceListPriceTextStyle}>
          {props.item.formated_price}
        </Text>
      </View>
      {props.saved && (
        <View style={{paddingHorizontal: 10, marginBottom: 5}}>
          <FormButton
           onPress={() => props.removeItem(props.item.service_id,"_saved_services",props.index)}
            buttonTitle={Translation.serviceProviderCardRemoveItems}
            backgroundColor={Constant.primaryColor}
            textColor={Constant.whiteColor}
          />
        </View>
      )}
    </View>
  );
};

export default ServicesListCard;
