import {Image, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import styles from '../styles/Style';
import Feather from 'react-native-vector-icons/Feather';
import {useSelector, useDispatch} from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Translation from '../constants/Translation';
import {decode} from 'html-entities';
import * as Constant from '../constants/globalConstant';

const QuoteCard = ({item,index,editQoute,deleteQoute}) => {
  const settings = useSelector(state => state.setting.settings);
  const profileInfo = useSelector(state => state.value.profileInfo);

  return (
    <>
      <View style={styles.projectProposalCardView}>
        <View style={styles.qouteCardViewTile}>
          <View style={{width: '15%'}}>
            <Image
              // resizeMode="center"
              style={styles.qouteCardViewTileImage}
              source={item.quote_listing_basic.featured_img == "" ? require("../../assets/images/NoImage.png"): {uri: item.quote_listing_basic.featured_img  }}
            />
          </View>
          <View style={{width: '80%'}}>
            <Text style={styles.qouteCardViewTileHeading}>
             {item.quote_listing_basic.service_title}
            </Text>
            <View style={styles.rowView}>
              <Text style={styles.qouteCardViewTilePriceText}>
                {Translation.qouteCardOfferedPrice}
              </Text>
              <Text style={styles.qouteCardViewTilePriceValue}>{decode(settings.currency_symbol)}{item.quote_listing_basic.user_price}</Text>
            </View>
          </View>
        </View>
        <View style={styles.qouteCardSeparatorView}>
          <View style={styles.separatorViewUper} />
          <Feather name={'circle'} size={9} color={'#00000040'} />
          <View style={styles.separatorViewBottom} />
        </View>
        <View style={styles.qouteCardViewTileBottom}>
          <View
            style={{
              width: '15%',
            }}>
           {profileInfo.user_type == "freelancer" ?
            <Image
              resizeMode="cover"
              style={styles.qouteCardViewTileImage}
              source={item.service_employer.employer_avatar == "" ? require("../../assets/images/NoImage.png"): {uri: item.service_employer.employer_avatar  }}
            />:
            <Image
              resizeMode="cover"
              style={styles.qouteCardViewTileImage}
              source={item.freelancer_detail.freelancer_avatar == "" ? require("../../assets/images/NoImage.png"): {uri: item.freelancer_detail.freelancer_avatar  }}
            />}
          </View>

          <View style={{width: '80%'}}>
            <View style={[styles.rowView, {marginLeft: 15}]}>
              <Text style={styles.jobCardNameViewText}>{profileInfo.user_type == "freelancer" ? item.service_employer.employer_title: item.freelancer_detail.freelancer_title}</Text>

              <FontAwesome name={'check-circle'} size={16} color={'#22C55E'} />
            </View>
            <Text style={styles.qouteCardViewTileHeading}>
             {profileInfo.user_type == "freelancer" ? decode(item.service_employer.tagline):  decode(item.freelancer_detail.tagline)}
            </Text>
          </View>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={()=> editQoute(item)} style={styles.qouteCardLeftButton}>
          <Text style={styles.qouteCardLeftButtonText}>{profileInfo.user_type == 'employer' ?Translation.qouteCardAcceptPay :Translation.globalEdit}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> deleteQoute(item.quote_listing_basic.id,index)} style={styles.qouteCardRightButton}>
          <Text style={styles.qouteCardRightButtonText}>{profileInfo.user_type == 'employer' ?Translation.qouteCardDecline:Translation.globalDelete}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default QuoteCard;
