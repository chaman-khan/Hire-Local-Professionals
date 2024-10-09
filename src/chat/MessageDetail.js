import {
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import {useSelector, useDispatch} from 'react-redux';
import React, {useState, useEffect, useRef} from 'react';
import Notification from '../components/Notification';
import Feather from 'react-native-vector-icons/Feather';
import {BallIndicator,UIActivityIndicator} from 'react-native-indicators';
import axios from 'axios';
import * as Constant from '../constants/globalConstant';
import SimpleMessage from './SimpleMessage';
import MediaMessage from './MediaMessage';
import Translation from '../constants/Translation';

const MessageDetail = ({navigation, route}) => {
  const flatlistRef = useRef(null);
  const chatData = route.params.data;
  const token = useSelector(state => state.value.token);
  const userInfo = useSelector(state => state.value.userInfo);
  const [data, setData] = useState([]);
  const [refreshList, setRefreshList] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  useEffect(() => {
    getMessageDetail();
  }, []);

  const getMessageDetail = async () => {
    setLoader(true)
    return fetch(
      Constant.BaseUrl +
        'chat/list_user_messages?current_id=' +
        userInfo.id +
        '&reciver_id=' +
        chatData.receiver_id +
        '&msg_id=' +
        chatData.msg_id,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.authToken,
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        setLoader(false);
        setData(responseJson.chat_nodes);
        setPageNumber(1)
      })
      .catch(error => {
        setLoader(false);
        console.error(error);
      });
  };
  const LoadMoreMessageDetail = async () => {
    return fetch(
      Constant.BaseUrl +
        'chat/list_user_messages?current_id=' +
        userInfo.id +
        '&reciver_id=' +
        chatData.receiver_id +
        '&page_number=' +
        pageNumber +
        '&msg_id=' +
        chatData.msg_id,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.authToken,
        },
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        let chats = responseJson.chat_nodes
        setData(chats.concat(data));
        setPageNumber(pageNumber+1)
        setRefreshList(!refreshList)
      })
      .catch(error => {
        console.error(error);
      });
  };

  const choosePictureFromGallery = async val => {
    ImagePicker.openPicker({
      width: 1200,
      height: 1200,
      mediaType: 'photo',
    }).then(async(img) => {
      data.push({
        chat_avatar: '',
        chat_current_user_id: userInfo.id,
        chat_date: Date.now(),
        img: img,
        chat_is_sender: 'yes',
        chat_message: '',
        chat_username: '',
      });
      setRefreshList(!refreshList);
      await sendMessageAttachment(img)
    });
  };
  const sendTextMessage = async () => {
    if (message != '') {
      data.push({
        chat_avatar: '',
        chat_current_user_id: userInfo.id,
        chat_date: Date.now(),
        chat_is_sender: 'yes',
        chat_message: message,
        chat_username: '',
        timestamp: "",
      });
      setRefreshList(!refreshList);
      setMessage("")
      await sendMessage()
    }
  };
  const sendMessage = () => {
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'chat/sendUserMessage',
        {
          user_id: userInfo.id,
          sender_id: userInfo.id,
          receiver_id: chatData.receiver_id,
          message: message,
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
          setMessage('');
          setLoading(false);
        } else if (response.data.type == 'error') {
          setLoading(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        setLoading(false);
        console.log(error);
      });
  };
  const sendMessageAttachment = (img) => {
    let obj = {
        uri: Platform.OS == 'ios' ? img.sourceURL : img.path,
        type: img.mime,
        name:
          Platform.OS == 'ios'
            ? img.filename
            : img.path.substring(img.path.lastIndexOf('/') + 1),
    }
    setLoading(true);
    axios
      .post(
        Constant.BaseUrl + 'chat/send_user_attachment',
        {
          user_id: userInfo.id,
          receiver_id: chatData.receiver_id,
          msg_type: "attachment",
          file_info:obj
        },
        {
          headers: {
            Authorization: 'Bearer ' + token.authToken,
          },
        },
      )
      .then(async response => {
        if (response.data.type == 'success') {
        //   setMessage('');
          setLoading(false);
        } else if (response.data.type == 'error') {
        data.pop()
      setRefreshList(!refreshList);
        setLoading(false);
          setShowAlert(true);
          setType(response.data.type);
          setTitle(response.data.title);
          setDesc(response.data.message);
        }
      })
      .catch(error => {
        setLoading(false);
        data.pop()
      setRefreshList(!refreshList);
        console.log(error);
        
      });
  };
  const hideAlert = () => {
    setShowAlert(false);
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Constant.whiteColor}}>
        <Notification
        show={showAlert}
        hide={hideAlert}
        type={type}
        title={title}
        desc={desc}
      />
      <View
        style={{
          height: 70,
          backgroundColor: Constant.whiteColor,
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '25%',
          }}>
          <Ionicons
            onPress={() => navigation.goBack()}
            style={{paddingHorizontal: 10}}
            name="chevron-back"
            type="chevron-back"
            color={Constant.iconColor}
            size={25}
          />

          <TouchableOpacity
          // onPress={() =>
          //   navigationforword.navigate("imagePreview", {
          //     imageData: image,
          //     profImage: "show",
          //   })
          // }
          >
            <Image
              style={{
                width: 45,
                height: 45,
                borderRadius: 45 / 2,
                borderColor: Constant.borderColor,
                borderWidth: 0.6,
              }}
              source={{
                uri: chatData.image_url != '' ? chatData.image_url : null,
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: '60%',
            justifyContent: 'center',
          }}>
          <Text
            numberOfLines={1}
            style={{
              color: '#0A0F26',
              fontSize: 18,
              fontFamily: Constant.primaryFontBold,
              marginLeft: 10,
            }}>
            {chatData.user_name}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 10,
              marginTop: 5,
            }}>
            {/* {
          isTyping == true ? (
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  color: settings.chatSetting.primaryColor,
                  fontSize: 14,
                  fontFamily: Constant.primaryFontRegular,
                }}
                numberOfLines={1}
              >
                typing
              </Text>
              <View style={{ marginTop: 5, marginLeft: 2 }}>
                <DotIndicator
                  count={3}
                  size={3}
                  color={settings.chatSetting.primaryColor}
                />
              </View>
            </View>
          ) : (
            <>
              {chatType == 1 && (
                <> */}
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 8 / 2,
                backgroundColor:
                  chatData.is_online == true ? '#22C55E' : '#dddddd',
              }}
            />
            <Text
              style={{
                color: '#0A0F26',
                fontSize: 14,
                fontFamily: Constant.primaryFontRegular,
                marginLeft: 5,
              }}>
              {chatData.is_online == true ? 'Online' : 'Offline'}
            </Text>
            {/* </>
              )}
            </>
          )} */}
          </View>
        </View>
        <View style={{width: '15%'}} />
      </View>
      <View style={{flex: 1, backgroundColor: Constant.darkGrayColor}}>
     {loader ?
      <View
      style={{
        width: "100%",
        height: "95%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <UIActivityIndicator
        size={35}
        color={Constant.fontColor}
      />
    </View>:
    <FlatList
          inverted={true}
          showsVerticalScrollIndicator={false}
          data={JSON.parse(JSON.stringify(data)).reverse()}
          ref={flatlistRef}
          extraData={refreshList}
          listKey={(x, i) => x.chat_id}
          keyExtractor={(x, i) => x.chat_id}
          onScrollBeginDrag={() => LoadMoreMessageDetail()}
          renderItem={({item, index}) => (
            <>
              {item.chat_message != '' ? (
                <SimpleMessage item={item} />
              ) : (
                <MediaMessage item={item} />
              )}
            </>
          )}
        />
     }
        
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          // backgroundColor:"#000",
          elevation: 3,
          shadowOffset: {width: 0, height: 1},
          shadowColor: '#000000',
          shadowOpacity: 0.1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            paddingVertical: 10,
          }}>
          <Feather
            onPress={() => choosePictureFromGallery()}
            style={{width: '3%', textAlign: 'center'}}
            name=""
            type=""
            color={'#807f7f'}
            size={22}
          />
          {/* <View style={{height:40 }}> */}
          <TextInput
            style={{
              fontSize: 15,
              maxHeight: 120,
              minHeight: 35,
              width: '83%',
              color: '#323232',
              fontFamily: Constant.primaryFontRegular,
              borderColor: '#DDDDDD',
              borderWidth: 1,
              borderRadius: 4,
              paddingHorizontal: 10,
              lineHeight: 20,
            }}
            multiline={true}
            underlineColorAndroid="transparent"
            name={'messgae'}
            autoCorrect={false}
            placeholder={Translation.messageDetailsType}
            placeholderTextColor="#807f7f"
            value={message}
            onChangeText={message => {
              setMessage(message);
            }}
            // onFocus={() => manageFoucus()}
            // onBlur={() => setShowSend(false)}
          />
          {/* </View> */}
          <TouchableOpacity
            activeOpacity={0.7}
            // onPress={() => appendInArray()}
            style={{
              width: '12%',
              alignItems: 'center',
              height: '100%',
              paddingTop: Platform.OS === 'ios' ? 5 : 15,
            }}>
                {loading ? (
                  <BallIndicator color={Constant.fontColor} size={14} />
              ):
            <Feather
              onPress={() => sendTextMessage()}
              name="send"
              type="send"
              color={'#807f7f'}
              size={22}
            />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageDetail;
