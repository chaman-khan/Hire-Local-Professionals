import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import React, {useState, useRef} from 'react';
import styles from '../styles/Style';
import * as Constant from '../constants/globalConstant';
import {decode} from 'html-entities';
import Feather from 'react-native-vector-icons/Feather';
import Translation from '../constants/Translation';
import HTML from 'react-native-render-html';
import Notification from '../components/Notification';
import {useSelector, useDispatch} from 'react-redux';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import axios from 'axios';

const BlogDetail = ({navigation, route}) => {
  const scrollViewRef = useRef();
  const blogDetail = route.params.item;
  console.log('blogDetail', blogDetail);
  const profileImage = useSelector(state => state.value.profileImage);
  const userInfo = useSelector(state => state.value.userInfo);
  console.log(' userInfo.id', userInfo.id);
  const token = useSelector(state => state.value.token);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [desc, setDesc] = useState('');
  const [commentId, setCommentId] = useState('');
  const [loader, setLoader] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [descAlert, setDescAlert] = useState('');
  const [commentItem, setCommentItem] = useState([]);
  const [commentIndex, setCommentIndex] = useState('');
  const [commentParent, setCommentParent] = useState('');
  const [reviewText, setReviewText] = useState('Add your review');
  const [refresh, setRefresh] = useState(false);
  const tagsStyles = {
    body: {
      fontFamily: Constant.secondryFontRegular,
      color: Constant.fontColor,
      marginBottom: 10,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.5,
    },
  };

  const postReview = async () => {
    console.log("review")
    setLoader(true);
    axios
      .post(
        Constant.BaseUrl + 'blog/send_post_comment',
        {
          user_id: userInfo.id,
          post_id: blogDetail.ID,
          content: desc,
          comment_parent: commentParent,
          comment_id: commentId,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        setLoader(false);
        if (response.status == 200) {
          blogDetail.comments = response.data.comment;
          setDesc('');
          setShowAlert(true);
          setType(response.data.type);
          setTitle(Translation.globalSuccess);
          setDescAlert(response.data.message);
        } else if (response.status == 203) {
          setDesc('');
          setShowAlert(true);
          setType(response.data.type);
          setTitle(Translation.globalOops);
          setDescAlert(response.data.message);
        }
      })
      .catch(error => {
        setDesc('');
        setLoader(false);
        Alert.alert('oops', error);
      });
  };

  const postReply = async () => {
    setLoader(true);
    axios
      .post(
        Constant.BaseUrl + 'blog/send_comment_reply',
        {
          user_id: userInfo.id,
          post_id: blogDetail.ID,
          content: desc,
          comment_parent: commentParent,
          comment_id: commentId,
          reply_type : commentId == "" ? 'new' : "",
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        setLoader(false);
        if (response.status == 200) {
          blogDetail.comments = response.data.comment;
          setDesc('');
          setCommentParent('');
          setCommentId('');
          setReviewText('Add your review');
          setShowAlert(true);
          setType(response.data.type);
          setTitle(Translation.globalSuccess);
          setDescAlert(response.data.message);
        } else if (response.status == 203) {
          setDesc('');
          setCommentParent('');
          setCommentId('');
          setReviewText('Add your review');
          setShowAlert(true);
          setType(response.data.type);
          setTitle(Translation.globalOops);
          setDescAlert(response.data.message);
        }
      })
      .catch(error => {
        setDesc('');
        setLoader(false);
        Alert.alert('oops', error);
      });
  };

  const deleteComment = (item, index, parentId) => {
    axios
      .post(
        Constant.BaseUrl + 'blog/delete_post_comment',
        {
          user_id: userInfo.id,
          comment_id: item.id,
          post_id: blogDetail.ID,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        console.log('response delete', response);
        if (response.status == 200) {
          blogDetail.comments = response.data.comment;
          setCommentParent('');
          setCommentId('');
          setRefresh(!refresh);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(Translation.globalSuccess);
          setDescAlert(response.data.message);
        } else if (response.status == 203) {
          setCommentParent('');
          setCommentId('');
          setShowAlert(true);
          setType(response.data.type);
          setTitle(Translation.globalOops);
          setDescAlert(response.data.message);
        }
      })
      .catch(error => {
        Alert.alert('oops', error);
      });
  };
  const hideAlert = () => {
    setShowAlert(false);
  };
  return (
    <SafeAreaView style={styles.globalContainer}>
      <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={descAlert}
      />
      <View
        style={[styles.headerMainView, {backgroundColor: Constant.whiteColor}]}>
        <TouchableOpacity
          activeOpacity={0.2}
          onPress={() => navigation.goBack()}
          style={styles.headerDrawerIcon}>
          <Feather
            name="chevron-left"
            type="chevron-left"
            color={Constant.fontColor}
            size={25}
          />
          <Text
            style={[
              styles.serviceDetailTitleStyle,
              {fontFamily: Constant.primaryFontMedium, fontSize: 15},
            ]}>
            Blog detail
          </Text>
        </TouchableOpacity>
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
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.ServiceProviderCardPrentStyle,
            {width: '100%', backgroundColor: Constant.whiteColor},
          ]}>
          {blogDetail.categories.length >= 1 && (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={blogDetail.categories}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => (
                <Text style={styles.serviceDetailCatTextStyle}>
                  {decode(item.name)}{' '}
                  {index + 1 == blogDetail.categories.length ? '' : ','}
                </Text>
              )}
            />
          )}

          <Text style={styles.serviceDetailTitleStyle}>
            {decode(blogDetail.title)}
          </Text>

          <View
            style={[
              styles.serviceListCardReviewParentStyle,
              {marginBottom: 10, paddingHorizontal: 0},
            ]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Feather
                name={'calendar'}
                size={13}
                color={Constant.lightGrayColor}
              />
              <Text style={[styles.serviceListViewstestStyle, {fontSize: 11}]}>
                {blogDetail.date}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Feather
                name={'message-square'}
                size={13}
                color={Constant.lightGrayColor}
              />
              <Text style={[styles.serviceListViewstestStyle, {fontSize: 11}]}>
                {blogDetail.comments_counts}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Feather name={'eye'} size={13} color={Constant.lightGrayColor} />
              <Text style={[styles.serviceListViewstestStyle, {fontSize: 11}]}>
                {blogDetail.post_views}
              </Text>
            </View>
          </View>
          <Image
            style={{width: '100%', height: 200, borderRadius: 10}}
            source={{uri: blogDetail.thumbnail}}
          />
        </View>
        <View
          style={[
            styles.ServiceProviderCardPrentStyle,
            styles.serviceDetailDescParentStyle,
          ]}>
          <Text style={styles.serviceDetailDescTitleStyle}>
            {Translation.serviceDetailDescription}
          </Text>

          <HTML
            tagsStyles={tagsStyles}
            source={{
              html: blogDetail.content,
            }}
          />
        </View>

        {blogDetail.tags.length >= 1 && (
          <View
            style={[
              styles.ServiceProviderCardPrentStyle,
              styles.serviceDetailDescParentStyle,
            ]}>
            <Text style={styles.serviceDetailDescTitleStyle}>
              {Translation.serviceDetailTags}
            </Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={blogDetail.tags}
              style={{marginBottom: 10}}
              columnWrapperStyle={{flexWrap: 'wrap'}}
              numColumns={20}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => (
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.JobDetailItemView}>
                    <Text style={styles.JobDetailItemText}>
                      {decode(item.name)}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        )}

        {blogDetail.comments.length >= 1 && (
          <View
            style={[
              styles.ServiceProviderCardPrentStyle,
              styles.serviceDetailDescParentStyle,
            ]}>
            <Text style={styles.serviceDetailDescTitleStyle}>
              {blogDetail.comments_counts}
            </Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={blogDetail.comments}
              style={{marginBottom: 10}}
              extraData={refresh}
              keyExtractor={(x, i) => i.toString()}
              renderItem={({item, index}) => {
                let parentId = item.id;

                return (
                  <View style={{padding: 10, margin: 5}}>
                    <View style={styles.ServiceProviderCardNameParentStyle}>
                      <Image
                        resizeMode="contain"
                        style={styles.serviceProviderCarImageStyle}
                        source={{uri: item.avatar}}
                      />
                      <View style={{justifyContent: 'center'}}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text style={styles.ServiceProviderCardNameTextStyle}>
                            {item.comment_author}
                          </Text>
                          {token != null && (
                            <>
                              {userInfo.id.toString() == item.user_id && (
                                <>
                                  <Feather
                                    onPress={() => {
                                      setDesc(item.comment_content),
                                        setCommentParent(''),
                                        setCommentIndex(index),
                                        setCommentItem(item),
                                        scrollViewRef.current.scrollToEnd({
                                          animated: true,
                                        }),
                                        setCommentId(item.id);
                                    }}
                                    name="edit"
                                    type="edit"
                                    color={'#1976D2'}
                                    size={20}
                                    style={{marginLeft: 20}}
                                  />
                                  <Feather
                                    onPress={() =>
                                      deleteComment(item, index, parentId)
                                    }
                                    name="trash-2"
                                    type="trash-2"
                                    color={'#EF5350'}
                                    size={20}
                                    style={{marginLeft: 10}}
                                  />
                                </>
                              )}

                              <Feather
                                onPress={() => {
                                  setCommentParent(item.id),
                                    setCommentId(''),
                                    scrollViewRef.current.scrollToEnd({
                                      animated: true,
                                    });
                                  setReviewText(
                                    'Add your reply to ' + item.comment_author,
                                  );
                                }}
                                name="message-square"
                                type="message-square"
                                color={'#689F38'}
                                size={20}
                                style={{marginLeft: 10}}
                              />
                            </>
                          )}
                        </View>
                        <Text>{item.comment_duration}</Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.serviceListViewstestStyle,
                        {fontSize: 13, fontFamily: Constant.primaryFontRegular},
                      ]}>
                      {item.comment_content}
                    </Text>
                    {item.hasOwnProperty('child_comment') &&
                      item.child_comment.length >= 1 && (
                        <FlatList
                          showsVerticalScrollIndicator={false}
                          data={item.child_comment}
                          style={{marginBottom: 10, width: '100%'}}
                          columnWrapperStyle={{flexWrap: 'wrap'}}
                          numColumns={20}
                          keyExtractor={(x, i) => i.toString()}
                          renderItem={({item, index}) => (
                            <View
                              style={{
                                backgroundColor: '#F7F8FC',
                                marginTop: 10,
                                marginHorizontal: 20,
                                width: '90%',
                                padding: 15,
                                borderRadius: 10,
                              }}>
                              <View
                                style={[
                                  styles.ServiceProviderCardNameParentStyle,
                                  {marginBottom: 0},
                                ]}>
                                <Image
                                  resizeMode="contain"
                                  style={[
                                    styles.serviceProviderCarImageStyle,
                                    {
                                      width: 30,
                                      height: 30,
                                      borderRadius: 30 / 2,
                                    },
                                  ]}
                                  source={{uri: item.avatar}}
                                />
                                <View style={{justifyContent: 'center'}}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                    }}>
                                    <Text
                                      style={[
                                        styles.ServiceProviderCardNameTextStyle,
                                        {fontSize: 13, marginBottom: 0},
                                      ]}>
                                      {item.comment_author}
                                    </Text>
                                    {token != null && (
                                      <>
                                        {userInfo.id.toString() ==
                                          item.user_id && (
                                          <>
                                            <Feather
                                              onPress={() => {
                                                setDesc(item.comment_content),
                                                  setCommentParent(parentId),
                                                  setCommentIndex(index),
                                                  setCommentItem(item),
                                                  scrollViewRef.current.scrollToEnd(
                                                    {animated: true},
                                                  ),
                                                  setCommentId(item.id);
                                              }}
                                              name="edit"
                                              type="edit"
                                              color={'#1976D2'}
                                              size={20}
                                              style={{marginLeft: 20}}
                                            />
                                            <Feather
                                              onPress={() =>
                                                deleteComment(
                                                  item,
                                                  index,
                                                  parentId,
                                                )
                                              }
                                              name="trash-2"
                                              type="trash-2"
                                              color={'#EF5350'}
                                              size={20}
                                              style={{marginLeft: 10}}
                                            />
                                          </>
                                        )}
                                      </>
                                    )}
                                  </View>
                                  <Text
                                    style={{fontSize: 10, color: '#767676'}}>
                                    {item.comment_duration}
                                  </Text>
                                </View>
                              </View>
                              <Text
                                style={[
                                  styles.serviceListViewstestStyle,
                                  {
                                    fontSize: 13,
                                    marginTop: 0,
                                    fontFamily: Constant.primaryFontRegular,
                                  },
                                ]}>
                                {item.comment_content}
                              </Text>
                            </View>
                          )}
                        />
                      )}
                  </View>
                );
              }}
            />
          </View>
        )}
        {token != null && (
          <View
            style={[
              styles.ServiceProviderCardPrentStyle,
              styles.serviceDetailDescParentStyle,
            ]}>
            <Text style={styles.serviceDetailDescTitleStyle}>{reviewText}</Text>
            <View style={[styles.multilineTextInputView, {marginTop: 10}]}>
              <TextInput
                multiline
                value={desc}
                onChangeText={text => setDesc(text)}
                placeholderTextColor={Constant.lightGrayColor}
                placeholder={'Comment'}
                style={styles.multilineTextInput}
              />
            </View>
            <FormButton
              onPress={() => {
                commentParent != '' ? postReply() : postReview();
              }}
              buttonTitle={Translation.globalSaveUpdate}
              backgroundColor={Constant.primaryColor}
              textColor={Constant.whiteColor}
              loader={loader}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BlogDetail;
