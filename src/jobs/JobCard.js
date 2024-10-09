import {View, Text, ImageBackground, Image} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import styles from '../styles/Style';
import * as Constant from '../constants/globalConstant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FormButton from '../components/FormButton';
import {decode} from 'html-entities';
import Translation from '../constants/Translation';

const JobCard = ({item, index, saved, removeItem}) => {
  return (
    <View style={styles.jobCardMainView}>
      <FontAwesome
        style={styles.jobCardMainViewBookmark}
        name={item.is_featured != 'no' ? 'bookmark' : ''}
        size={20}
        color={Constant.primaryColor}
      />
      <View style={styles.jobCardNameView}>
        <Text style={styles.jobCardNameViewText}>{item.employer_name}</Text>

        <FontAwesome name={'check-circle'} size={16} color={'#22C55E'} />
      </View>

      <Text style={styles.jobCardMainHeading}>
        {decode(item.project_title)}
      </Text>
      {item.project_level.level_title != '' && (
        <View style={styles.jobCardInfoListMain}>
          <View style={styles.jobCardNameView}>
            <ImageBackground
              // imageStyle={{borderRadius: 25 / 2}}
              style={styles.jobCardInfoListImage}
              source={require('../../assets/images/jobIcon0.png')}
            />
            <Text style={styles.jobCardInfoListHeading}>
              {Translation.jobCardSkill}
            </Text>
          </View>
          <Text style={styles.jobCardInfoListHeadingValue}>
            {item.project_level.level_title}
          </Text>
        </View>
      )}
      {item.project_duration != '' && item.project_duration != null && (
        <View style={styles.jobCardInfoListMain}>
          <View style={styles.jobCardNameView}>
            <ImageBackground
              // imageStyle={{borderRadius: 25 / 2}}
              style={styles.jobCardInfoListImage}
              source={require('../../assets/images/jobIcon1.png')}
            />
            <Text style={styles.jobCardInfoListHeading}>
              {Translation.jobCardDuration}
            </Text>
          </View>
          <Text style={styles.jobCardInfoListHeadingValue}>
            {item.project_duration}
          </Text>
        </View>
      )}
      {item.job_type != '' && (
        <View style={styles.jobCardInfoListMain}>
          <View style={styles.jobCardNameView}>
            <ImageBackground
              // imageStyle={{borderRadius: 25 / 2}}
              style={styles.jobCardInfoListImage}
              source={require('../../assets/images/jobIcon2.png')}
            />
            <Text style={styles.jobCardInfoListHeading}>
              {Translation.jobCardJobType}
            </Text>
          </View>
          <Text style={styles.jobCardInfoListHeadingValue}>
            {item.job_type}
          </Text>
        </View>
      )}
      {item.project_type != '' && (
        <View style={styles.jobCardInfoListMain}>
          <View style={styles.jobCardNameView}>
            <ImageBackground
              // imageStyle={{borderRadius: 25 / 2}}
              style={styles.jobCardInfoListImage}
              source={require('../../assets/images/jobIcon3.png')}
            />
            <Text style={styles.jobCardInfoListHeading}>
              {Translation.jobCardProject}
            </Text>
          </View>
          <Text style={styles.jobCardInfoListHeadingValue}>
            {item.project_type}
          </Text>
        </View>
      )}
      {item.deadline_date != '' && (
        <View style={styles.jobCardInfoListMain}>
          <View style={styles.jobCardNameView}>
            <ImageBackground
              // imageStyle={{borderRadius: 25 / 2}}
              style={styles.jobCardInfoListImage}
              source={require('../../assets/images/jobIcon4.png')}
            />
            <Text style={styles.jobCardInfoListHeading}>
              {Translation.jobCardDeadline}
            </Text>
          </View>
          <Text style={styles.jobCardInfoListHeadingValue}>
            {item.deadline_date}
          </Text>
        </View>
      )}
      {item.location._country != '' && (
        <View style={styles.jobCardInfoListMain}>
          <View style={styles.jobCardNameView}>
            <ImageBackground
              // imageStyle={{borderRadius: 25 / 2}}
              style={styles.jobCardInfoListImage}
              source={require('../../assets/images/jobIcon5.png')}
            />
            <Text style={styles.jobCardInfoListHeading}>
              {Translation.jobCardLocation}
            </Text>
          </View>
          <Text style={styles.jobCardInfoListHeadingValue}>
            {item.location._country}
          </Text>
        </View>
      )}
      <View style={{marginVertical: 10}}>
        {item.estimated_hours != '' ? (
          <Text style={styles.jobCardRateText}>
            {Translation.jobCardEstimated}{' '}
            <Text style={styles.jobCardRateTextBold}>
              {item.estimated_hours} {Translation.jobCardHours}
            </Text>
          </Text>
        ) : (
          <Text style={styles.jobCardRateText}>
            {Translation.jobCardEstimatedCost}
          </Text>
        )}
        {item.estimated_hours != '' ? (
          <Text style={styles.jobCardRateTextValue}>
            {decode(item.hourly_rate)}
          </Text>
        ) : (
          <Text style={styles.jobCardRateTextValue}>
            {decode(item.project_cost)}
            {item.max_price != '' ? ' - ' + decode(item.max_price) : ''}
          </Text>
        )}
      </View>
      {saved && (
        <FormButton
          onPress={() => removeItem(item.job_id, '_saved_projects', index)}
          buttonTitle={Translation.jobCardRemoveSavedItems}
          backgroundColor={Constant.primaryColor}
          textColor={Constant.whiteColor}
        />
      )}
    </View>
  );
};

export default JobCard;
