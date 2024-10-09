import {View, Text, Image} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as Constant from '../constants/globalConstant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/Style';
import FormButton from '../components/FormButton';
import Translation from '../constants/Translation';

const ServiceProviderCard = props => {
  return (
    <View style={[styles.ServiceProviderCardPrentStyle, {width: props.width}]}>
      <FontAwesome
        style={styles.jobCardMainViewBookmark}
        name={props.item.is_featured == 'yes' ? 'bookmark' : ''}
        size={20}
        color={Constant.primaryColor}
      />
      <View style={[styles.ServiceProviderCardNameParentStyle,{width:"85%"}]}>
        <Image
          resizeMode="contain"
          style={styles.serviceProviderCarImageStyle}
          source={{uri: props.item.profile_img}}
        />
        <Text 
        style={styles.ServiceProviderCardNameTextStyle}>
          {props.item.name}
        </Text>
        {props.item._is_verified == 'yes' && (
          <AntDesign name={'checkcircle'} size={13} color={'#22C55E'} />
        )}
      </View>
      {props.item._tag_line != '' && (
        <Text style={styles.ServiceProviderCardTaglineStyle}>
          {props.item._tag_line}
        </Text>
      )}

      <View
        style={{flexDirection: 'row', alignItems: 'center', marginBottom: 5}}>
        <AntDesign name={'star'} size={16} color={'#FFD101'} />
        <Text style={styles.serviceProviderRatingTextStyle}>
          {props.item.wt_average_rating}/5
        </Text>
        <Text style={styles.ServiceProviderCardReviewCountStyle}>
          (
          {props.item.reviews.length >= 2
            ? props.item.reviews.length + Translation.serviceProviderCardReviews
            : props.item.reviews.length + Translation.serviceProviderCardReview}
          )
        </Text>
      </View>

      {props.item.location._country != '' && (
        <View style={styles.ServiceProviderCardLocationParentStyle}>
          <Image
            resizeMode="stretch"
            style={styles.serviceProviderLocationImageStyle}
            source={props.item.location.flag != "" ? {uri: props.item.location.flag} :require("../../assets/images/NoImage.png")}
          />
          <Text style={styles.serviceProviderLocationTextStyle}>
            {props.item.location._country}
          </Text>
        </View>
      )}

      {props.item._perhour_rate != '' && (
        <View style={styles.serviceProviderPriceParentStyle}>
          <Text style={styles.serviceProviderStartingPriceTextStyle}>
           {Translation.serviceProviderCardStartingFrom}
          </Text>
          <Text style={styles.serviceProviderPriceTextStyle}>
            {props.item._perhour_rate}{Translation.serviceProviderCardHr}
          </Text>
        </View>
      )}
      {props.saved && (
        <FormButton
          onPress={() =>
            props.removeItem(
              props.item.profile_id,
              '_saved_freelancers',
              props.index,
            )
          }
          buttonTitle={Translation.serviceProviderCardRemove}
          backgroundColor={Constant.primaryColor}
          textColor={Constant.whiteColor}
        />
      )}
    </View>
  );
};

export default ServiceProviderCard;
