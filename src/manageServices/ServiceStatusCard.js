import {Image, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import styles from '../styles/Style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import * as Constant from '../constants/globalConstant';
import {decode} from 'html-entities';
import Translation from '../constants/Translation';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import StarRating from 'react-native-star-rating';

const ServiceStatusCard = ({item, status, viewHistory}) => {
  const profileInfo = useSelector(state => state.value.profileInfo);
  const navigationforword = useNavigation();
  const [ratings, setRatings] = useState(5);
  return (
    <>
      <View style={[styles.projectProposalCardView, {padding: 0}]}>
        {item.service_downloadable == 'yes' && (
          <>
            <View
              style={{
                overflow: 'visible',
                backgroundColor: 'transparent',
                borderStyle: 'solid',
                borderRightWidth: 40,
                borderTopWidth: 40,
                borderTopLeftRadius: 10,
                borderRightColor: 'transparent',
                borderTopColor: Constant.greenColor,
              }}
            />
            <Feather
              style={{
                marginTop: -36,
                marginLeft: 2,
                position: 'relative',
              }}
              name={'download'}
              size={16}
              color={Constant.whiteColor}
            />
          </>
        )}
        <View
          style={{
            padding: 15,
            width: '100%',
            paddingTop: item.service_downloadable == 'yes' ? 0 : 15,
          }}>
          <View style={styles.serviceStatusCardViewTile}>
            <View
              style={{
                width: '15%',
              }}>
              <Image
                // resizeMode="contain"
                style={styles.serviceStatusCardViewTileImage}
                source={{uri: item.featured_img}}
              />
            </View>

            <View style={{width: '80%'}}>
              <Text style={styles.serviceStatusCardViewTileHeading}>
                {item.service_title}
              </Text>
              <View style={styles.rowView}>
                <Text style={styles.serviceStatusCardViewTilePriceText}>
                  {Translation.serviceStatusCardOfferedPrice}
                </Text>
                <Text style={styles.serviceStatusCardViewTilePriceValue}>
                  {item.order_total}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.serviceStatusCardSeparatorView}>
            <View style={styles.separatorViewUper} />
            <Feather name={'circle'} size={9} color={'#00000040'} />
            <View style={styles.separatorViewBottom} />
          </View>
          <View style={styles.serviceStatusCardViewTileBottom}>
            <View
              style={{
                width: '15%',
              }}>
              <Image
                // resizeMode="cover"
                style={styles.serviceStatusCardViewTileImage}
                source={{
                  uri:
                    profileInfo.user_type == 'employer'
                      ? item.service.freelancer_avatar
                      : item.employer.employer_avatar,
                }}
              />
            </View>

            <View style={{width: '80%'}}>
              <View style={[styles.rowView, {marginLeft: 15}]}>
                <Text style={styles.jobCardNameViewText}>
                  {profileInfo.user_type == 'employer'
                    ? item.service.freelancer_title
                    : item.employer.employer_title}
                </Text>

                {(profileInfo.user_type == 'employer'
                  ? item.service.freelancer_verified == 'yes'
                  : item.employer.employer_verified == 'yes') && (
                  <FontAwesome
                    name={'check-circle'}
                    size={16}
                    color={'#22C55E'}
                  />
                )}
              </View>
              <Text style={styles.serviceStatusCardViewTileHeading}>
                {profileInfo.user_type == 'employer'
                  ?decode(item.service.freelancertagline) : decode(item.employer.employertagline)}
              </Text>
            </View>
          </View>
          {status == 'complete' && (
            <View style={[styles.rowView, {marginTop: 10}]}>
              <Text style={styles.serviceStatusCardRatingText}>{Translation.serviceStatusCardRating}</Text>
              <View style={styles.serviceStatusCardRatingStars}>
                <StarRating
                  disabled={false}
                  maxStars={5}
                  starSize={20}
                  fullStarColor={'#fecb02'}
                  emptyStarColor={'#fecb02'}
                  rating={parseInt(item.service_ratings)}
                  // selectedStar={rating => setRatings(rating)}
                />
              </View>
            </View>
          )}
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() =>
            navigationforword.navigate('ViewHistory', {
              data: item,
              type: 'service',
              status: status,
            })
          }
          style={styles.serviceStatusCardViewButton}>
          <Text style={styles.serviceStatusCardViewButtonText}>
            {Translation.serviceStatusCardViewHistory}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ServiceStatusCard;
