import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  FlatList,
  TextInput,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import * as Constant from '../constants/globalConstant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styles from '../styles/Style';
import Translation from '../constants/Translation';
import FormButton from '../components/FormButton';
import axios from 'axios';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {useSelector, useDispatch} from 'react-redux';
const sliderWidth = Dimensions.get('window').width;
const itemWidth = 300;

const PortfolioDetail = ({route, navigation}) => {
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const profileInfo = useSelector(state => state.value.profileInfo);
  const profileName = useSelector(state => state.value.profileName);
  const profileImage = useSelector(state => state.value.profileImage);
  const portfolioDetail = route.params.data;
  const [refreshFlatlist, setRefreshFlatlist] = useState(false);
  const [detail, setDetail] = useState('');
  const [commentID, setCommentID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [reply, setReply] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    tags.length = 0;
    for (var i = 0; i < portfolioDetail.categories.length; i++) {
      tags.push(portfolioDetail.categories[i].name);
      setRefresh(!refresh);
    }
  }, []);
  const getCommentsArray = () => {
    return fetch(
      Constant.BaseUrl +
        'portfolios/get_portfolios?listing_type=single&portfolio_id=' +
        portfolioDetail.ID,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        setLoading(false);
        setDetail('');
        setCommentID(null);
        portfolioDetail.comments = responseJson.portfolios[0].comments;
        setRefreshFlatlist(!refreshFlatlist);
      })
      .catch(error => {
        setLoading(false);
        // console.error(error);
      });
  };

  const sendComment = () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'portfolios/post_portfolio_comments',
        {
          user_id: userInfo.id,
          post_id: portfolioDetail.ID,
          comment_content: detail,
          comment_parent: commentID,
        },
        {
          headers: {
            Accept: 'application/json',
            // 'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          getCommentsArray();
        } else if (response.data.type == 'error') {
          setLoading(false);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.imageCarouselView}>
        <Image style={styles.imageCarouselImage} source={{uri: item.url}} />
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.globalContainer}>
      <View
        style={[styles.headerMainView, {backgroundColor: Constant.whiteColor}]}>
        <TouchableOpacity
          activeOpacity={0.2}
          onPress={() => navigation.goBack()}
          style={styles.headerDrawerIcon}>
          <Feather name="chevron-left" color={Constant.fontColor} size={25} />
        </TouchableOpacity>
        <View style={styles.rowView}>
          <TouchableOpacity>
            <Image
              style={styles.headerPhoto}
              source={
                profileImage != ''
                  ? {uri: profileImage}
                  : require('../../assets/images/NoImage.png')
              }
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.cardView}>
          <Text style={styles.inputHeading}>
            {Translation.portfolioDetailHeading}
          </Text>
          <TouchableOpacity
            //   onPress={()=>setSelectedHistory(selectedHistory == index  ?  null : index)}
            style={{
              borderColor: Constant.borderColor,
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 10,
            }}>
            <View style={styles.jobCardInfoListMain}>
              <View style={styles.rowView}>
                <ImageBackground
                  resizeMode="cover"
                  imageStyle={{
                    borderRadius: 55 / 2,
                  }}
                  style={{
                    width: 55,
                    height: 55,
                  }}
                  source={
                    profileImage != ''
                      ? {uri: profileImage}
                      : require('../../assets/images/NoImage.png')
                  }
                />
                <View style={{marginLeft: 15}}>
                  <View style={styles.jobCardNameView}>
                    <Text
                      style={{
                        fontSize: 16,
                        lineHeight: 26,
                        letterSpacing: 0.5,
                        color: Constant.fontColor,
                        marginRight: 5,
                        fontFamily: Constant.primaryFontSemiBold,
                      }}>
                      {profileName}
                    </Text>

                    <FontAwesome
                      name={'check-circle'}
                      size={16}
                      color={'#22C55E'}
                    />
                  </View>
                </View>
              </View>
              <Feather name={'chevron-right'} color={'#676767'} size={20} />
            </View>
          </TouchableOpacity>
          <View style={{width: '100%', marginVertical: 15}}>
            <Carousel
              loop={true}
              layout={'default'}
              data={portfolioDetail.gallery_imgs}
              renderItem={renderItem}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              autoplay={false}
            />
          </View>
          <Text
            style={{
              fontSize: 18,
              lineHeight: 26,
              letterSpacing: 0.5,
              fontFamily: Constant.primaryFontSemiBold,
              color: Constant.fontColor,
              marginTop: 10,
              marginBottom: 5,
            }}>
            {portfolioDetail.title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 22,
              letterSpacing: 0.5,
              fontFamily: Constant.primaryFontRegular,
              color: '#484848',
              marginBottom: 5,
            }}>
            {tags.toString()}
          </Text>
        </View>
        <View style={styles.cardView}>
          <Text style={styles.inputHeading}>
            {portfolioDetail.comments.length}{' '}
            {Translation.portfolioDetailComment}
          </Text>
          {portfolioDetail.comments.length != 0 && (
            <View style={styles.subCardView}>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={portfolioDetail.comments}
                extraData={refreshFlatlist}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item, index}) => (
                  <>
                    <Text
                      style={{
                        fontSize: 16,
                        lineHeight: 26,
                        letterSpacing: 0.5,
                        fontFamily: Constant.primaryFontRegular,
                        color: Constant.fontColor,
                      }}>
                      {item.comment_author}
                    </Text>
                    <View
                      style={{
                        padding: 15,
                        borderColor: Constant.borderColor,
                        borderWidth: 1,
                        borderRadius: 15,
                        borderTopLeftRadius: 0,
                        marginVertical: 10,
                        backgroundColor: Constant.whiteColor,
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          lineHeight: 26,
                          letterSpacing: 0.5,
                          fontFamily: Constant.primaryFontRegular,
                          color: '#484848',
                        }}>
                        {item.comment_content}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          lineHeight: 22,
                          letterSpacing: 0.5,
                          fontFamily: Constant.primaryFontRegular,
                          color: Constant.lightGrayColor,
                        }}>
                        {item.comment_date}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        setReply(true);
                        setCommentID(item.id);
                      }}
                      style={[styles.rowView, {alignSelf: 'flex-end'}]}>
                      <Feather
                        name="corner-up-left"
                        color={Constant.greenColor}
                        size={18}
                      />
                      <Text
                        style={{
                          marginLeft: 10,
                          fontSize: 14,
                          lineHeight: 22,
                          letterSpacing: 0.5,
                          fontFamily: Constant.primaryFontSemiBold,
                          color: Constant.greenColor,
                        }}>
                        {Translation.portfolioDetailClickReply}
                      </Text>
                    </TouchableOpacity>
                    <FlatList
                      style={{paddingLeft: 30}}
                      showsVerticalScrollIndicator={false}
                      data={item.comment_child}
                      keyExtractor={(x, i) => i.toString()}
                      renderItem={({item, index}) => (
                        <>
                          <Text
                            style={{
                              fontSize: 16,
                              lineHeight: 26,
                              letterSpacing: 0.5,
                              fontFamily: Constant.primaryFontRegular,
                              color: Constant.fontColor,
                            }}>
                            {item.comment_author}
                          </Text>
                          <View
                            style={{
                              padding: 15,
                              borderColor: Constant.borderColor,
                              borderWidth: 1,
                              borderRadius: 15,
                              borderTopLeftRadius: 0,
                              marginVertical: 10,
                              backgroundColor: Constant.whiteColor,
                            }}>
                            <Text
                              style={{
                                fontSize: 16,
                                lineHeight: 26,
                                letterSpacing: 0.5,
                                fontFamily: Constant.primaryFontRegular,
                                color: '#484848',
                              }}>
                              {item.comment_content}
                            </Text>
                            <Text
                              style={{
                                fontSize: 14,
                                lineHeight: 22,
                                letterSpacing: 0.5,
                                fontFamily: Constant.primaryFontRegular,
                                color: Constant.lightGrayColor,
                              }}>
                              {item.comment_date}
                            </Text>
                          </View>
                        </>
                      )}
                    />
                  </>
                )}
              />
            </View>
          )}
          <View style={[styles.rowView, {justifyContent: 'space-between'}]}>
            <Text style={styles.inputHeading}>
              {Translation.portfolioDetailLeaveYour}{' '}
              {reply
                ? Translation.portfolioDetailReply
                : Translation.portfolioDetailCommentEnd}
            </Text>
            {reply && (
              <TouchableOpacity
                onPress={() => {
                  setCommentID(null);
                  setReply(false);
                }}>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 14,
                    lineHeight: 22,
                    letterSpacing: 0.5,
                    fontFamily: Constant.primaryFontSemiBold,
                    color: Constant.primaryColor,
                  }}>
                  {Translation.portfolioDetailCancelReply}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.multilineTextInputView}>
            <TextInput
              placeholder={
                reply
                  ? Translation.portfolioDetailTypeYourReply
                  : Translation.portfolioDetailTypeYourComment
              }
              multiline
              value={detail}
              onChangeText={text => setDetail(text)}
              placeholderTextColor={Constant.lightGrayColor}
              style={styles.multilineTextInput}
            />
          </View>
          <FormButton
            onPress={() => sendComment()}
            buttonTitle={Translation.portfolioDetailSend}
            backgroundColor={Constant.primaryColor}
            textColor={Constant.whiteColor}
            loader={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PortfolioDetail;
