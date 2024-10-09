import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import Notification from '../components/Notification';
import {useSelector, useDispatch} from 'react-redux';
import styles from '../styles/Style';
import {BallIndicator} from 'react-native-indicators';
import * as Constant from '../constants/globalConstant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Translation from '../constants/Translation';

const EmployerCard = ({item, noBorder, index, saved, removeItem}) => {
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const [showAlert, setShowAlert] = useState(false);
  const [loader, setLoader] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const saveEmployer = async () => {
    setLoader(true);
    axios
      .post(
        Constant.BaseUrl + 'user/favorite',
        {
          user_id: userInfo.id,
          favorite_id: item.employ_id,
          type: '_following_employers',
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {

        if (response.data.type == 'success') {
          item.favorit = 'yes';
          // setRefreshFlatList(!refreshFlatList);
          setLoader(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        } else if (response.data.type == 'error') {
          setLoader(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
        setLoader(false);
      });
  };
  const hideAlert = () => {
    setShowAlert(false);
  };
  return (
    <View
      style={
        noBorder
          ? styles.employerCardMainViewNoBorder
          : styles.employerCardMainView
      }>
      <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
      />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <ImageBackground
          resizeMode="cover"
          imageStyle={{
            borderRadius: 55 / 2,
            borderColor: Constant.borderColor,
            borderWidth: 1,
          }}
          style={styles.employerCardprofileImage}
          source={
            item.profile_img != ''
              ? {uri: item.profile_img}
              : require('../../assets/images/NoImage.png')
          }
        />
        <View style={{width: '80%', marginLeft: 15}}>
          <View style={styles.employerCardNameView}>
            <Text style={styles.employerCardNameText}>{item.name}</Text>
            <FontAwesome name={'check-circle'} size={16} color={'#22C55E'} />
          </View>
          {item._tag_line != '' && (
            <Text style={styles.employerCardHeadingText}>{item._tag_line}</Text>
          )}
        </View>
      </View>
      <View style={styles.employerCardFollowerListView}>
        <View style={styles.employerCardFollowerListSection}>
          {item.followers.length != 0 &&
            <FlatList
            horizontal
            style={{flexDirection: 'row'}}
            showsVerticalScrollIndicator={false}
            data={item.followers}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.employerCardFollowerListImagesView,
                  {marginLeft: index == 0 ? 0 : -16},
                ]}>
                <Image
                  style={styles.employerCardFollowerListImage}
                  source={{uri: item.profile_image}}
                />
              </View>
            )}
          />}
          <Text style={styles.employerCardFollowerText}>
            {item.followers_count <= 1
              ? item.followers_count + Translation.employerCardFollower
              : item.followers_count + Translation.employerCardFollowers}{' '}
          </Text>
        </View>
        {saved ? (
          <TouchableOpacity
            onPress={() =>
              removeItem(item.profile_id, '_following_employers', index)
            }
            style={[
              styles.employerCardButtonFollowing,
              {backgroundColor: Constant.primaryColor, paddingHorizontal: 15},
            ]}>
            <Text style={styles.employerCardFollowingText}>
              {Translation.employerCardUnfollow}
            </Text>
          </TouchableOpacity>
        ) : (
          <>
            {(item.profile_id != userInfo.profile_id && token != null) && (
              <>
                {item.favorit == 'yes' ? (
                  <TouchableOpacity
                    onPress={() => {
                      setShowAlert(true);
                      setType('success');
                      setTitle(Translation.employerCardAlraedy);
                      setDesc(Translation.employerCardAlreadylist);
                    }}
                    style={styles.employerCardButtonFollowing}>
                    <Text style={styles.employerCardFollowingText}>
                     {Translation.employerCardFollowing}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => saveEmployer()}
                    style={styles.employerCardButtonFollow}>
                    {loader ? (
                      <BallIndicator
                        style={{marginHorizontal: 25}}
                        color={Constant.fontColor}
                        size={14}
                      />
                    ) : (
                      <Text style={styles.employerCardFollowText}>
                       {Translation.employerCardFollow}
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default EmployerCard;
