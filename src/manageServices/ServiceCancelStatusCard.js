import {Image, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import styles from '../styles/Style';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Translation from '../constants/Translation';
import {decode} from 'html-entities';
import * as Constant from '../constants/globalConstant';
import {useNavigation} from '@react-navigation/native';
import StarRating from 'react-native-star-rating';

const ServiceCancelStatusCard = ({item, status, showReason}) => {
  const navigationforword = useNavigation();
  const [ratings, setRatings] = useState(4);
  return (
    <>
      <View style={styles.projectProposalCardView}>
        <View style={styles.serviceCancelStatusCardView}>
          <View
            style={{
              width: '22%',
            }}>
            <Image
              // resizeMode="center"
              style={styles.serviceCancelStatusCardImage}
              source={{uri:item.featured_img}}
            />
          </View>

          <View style={styles.serviceCancelStatusCardTextView}>
           {item.is_featured == "yes" &&
            <View style={styles.rowView}>
              <View style={styles.serviceCancelStatusCardFeature}>
                <Text style={styles.serviceCancelStatusCardFeatureText}>
                 {Translation.serviceStatusCardFeatured}
                </Text>
              </View>
            </View>}
            <Text style={styles.serviceCancelStatusCardHeading}>
            {item.service_title}
            </Text>
            <View style={styles.rowView}>
              <Text style={styles.serviceCancelStatusCardPrice}>
                {Translation.serviceStatusCardOfferedPrice}
              </Text>
              <Text style={styles.serviceCancelStatusCardPriceValue}>
              {item.order_total}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.serviceCancelStatusSeparator}>
          <View style={styles.separatorViewUper} />
          <Feather name={'circle'} size={9} color={'#00000040'} />
          <View style={styles.separatorViewBottom} />
        </View>
        <View
          style={styles.serviceCancelStatusCardViewBottom}>
          <View
            style={{
              width: '22%',
            }}>
            <Image
              // resizeMode="cover"
              style={styles.serviceCancelStatusCardImage}
              source={{uri:item.employer.employer_avatar}}
            />
          </View>

          <View style={{width: '78%'}}>
            <View style={styles.rowView}>
              <Text style={styles.jobCardNameViewText}>{item.employer.employer_title}</Text>

              {item.employer.employer_verified == "yes" &&
              <FontAwesome name={'check-circle'} size={16} color={'#22C55E'} />}
            </View>
            <Text
              style={styles.serviceCancelStatusCardHeading}>
             {decode(item.employer.employertagline)}
            </Text>
          </View>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => showReason(item)}
          style={styles.serviceCancelStatusLeftButton}>
          <Text
            style={styles.serviceCancelStatusLeftButtonText}>
            {Translation.serviceStatusCardShowReason}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
           onPress={() => navigationforword.navigate('ViewHistory',{data:item,type:"service",status:status})}
          style={styles.serviceCancelStatusRightButton}>
          <Text
            style={styles.serviceCancelStatusRightButtonText}>
           {Translation.serviceStatusCardViewHistory}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ServiceCancelStatusCard;
