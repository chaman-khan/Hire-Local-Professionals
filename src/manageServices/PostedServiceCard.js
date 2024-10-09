import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import styles from '../styles/Style';
import * as Constant from '../constants/globalConstant';
import Feather from 'react-native-vector-icons/Feather';
import Notification from '../components/Notification';
import Translation from '../constants/Translation';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {decode} from 'html-entities';
import FormButton from '../components/FormButton';
import {MaterialIndicator} from 'react-native-indicators';

const PostedServiceCard = ({item, index, showStatus}) => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const [loader, setLoader] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const changePostedServiceStatus = val => {
    setLoader(true);
    setSelectedStatus(null);
    axios
      .post(
        Constant.BaseUrl + 'dashboard/update_service_status',
        {
          user_id: userInfo.id,
          post_id: item.ID,
          status: val,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          item.post_status = val;
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
          setLoader(false);
        } else if (response.data.type == 'error') {
          setLoader(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        setLoader(false);
        console.log(error);
      });
  };
  const hideAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      <View style={styles.managePortfolioListView}>
        <Notification
          show={showAlert}
          hide={hideAlert}
          type={type}
          title={title}
          desc={desc}
        />
        <View style={styles.postedServiceCardView}>
          <View
            style={{
              width: '22%',
            }}>
            <Image
              resizeMode="cover"
              style={styles.postedServiceCardViewImage}
              source={
                item.featured_img == ''
                  ? require('../../assets/images/NoImage.png')
                  : {uri: item.featured_img}
              }
            />
          </View>

          <View style={styles.postedServiceCardViewText}>
            {item.is_featured == 'yes' && (
              <View style={styles.rowView}>
                <View style={styles.postedServiceFeatureView}>
                  <Text style={styles.postedServiceFeatureText}>
                    {Translation.postedServiceCardFeatured}
                  </Text>
                </View>
              </View>
            )}
            <Text style={styles.postedServiceHeading}>{item.title}</Text>
            <View style={styles.rowView}>
              <Text style={styles.postedServicePriceText}>
                {Translation.postedServiceCardOfferedPrice}
              </Text>
              <Text style={styles.postedServicePriceValue}>
                {decode(item.formated_price)}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.rowView,
            {justifyContent: 'space-between', marginBottom: 5},
          ]}>
          <View style={styles.rowView}>
            <Text style={styles.postedServiceQueueText}>
              {Translation.postedServiceCardInQueue}
            </Text>
            <Text style={styles.postedServiceQueueValue}>
              {item.queu_services} {Translation.postedServiceCardInQueueVal}
            </Text>
          </View>
          <Feather
            onPress={() => showStatus(item, index)}
            name="more-vertical"
            color={Constant.fontColor}
            size={24}
          />
        </View>
      </View>
      <View style={styles.managePortfolioListBottomView}>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'space-between',
            borderBottomColor: Constant.borderColor,
            borderBottomWidth: selectedStatus == index ? 1 : 0,
            padding: 12,
          }}>
          <Text
            style={{
              fontSize: 15,
              lineHeight: 24,
              letterSpacing: 0.5,
              marginLeft: 10,
              fontFamily: Constant.secondryFontRegular,
              color: Constant.lightGrayColor,
            }}>
            {item.post_status == 'publish' ? Translation.postedServiceCardPublished : Translation.postedServiceCardDraft}
          </Text>

          {loader ? (
            <View style={{marginRight: 10}}>
              <MaterialIndicator
                count={8}
                size={14}
                color={Constant.lightGrayColor}
              />
            </View>
          ) : (
            <Feather
              onPress={() =>
                setSelectedStatus(selectedStatus == index ? null : index)
              }
              name="chevron-down"
              color={Constant.fontColor}
              size={24}
            />
          )}
        </View>
        {selectedStatus == index && (
          <>
            <TouchableOpacity
              onPress={() => changePostedServiceStatus('publish')}
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                paddingTop: 5,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  lineHeight: 24,
                  letterSpacing: 0.5,
                  marginLeft: 10,
                  fontFamily: Constant.secondryFontRegular,
                  color: Constant.fontColor,
                }}>
                {Translation.postedServiceCardPublished}
              </Text>

              {item.post_status == 'publish' && (
                <Feather
                  onPress={() => setVisible(true)}
                  name="check"
                  color={Constant.fontColor}
                  size={18}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => changePostedServiceStatus('draft')}
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}>
              <Text
                style={{
                  fontSize: 15,
                  lineHeight: 24,
                  letterSpacing: 0.5,
                  marginLeft: 10,
                  fontFamily: Constant.secondryFontRegular,
                  color: Constant.fontColor,
                }}>
                {Translation.postedServiceCardDraft}
              </Text>

              {item.post_status == 'draft' && (
                <Feather
                  onPress={() => setVisible(true)}
                  name="check"
                  color={Constant.fontColor}
                  size={18}
                />
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </>
  );
};

export default PostedServiceCard;
