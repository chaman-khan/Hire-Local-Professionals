import {SafeAreaView, Text, View} from 'react-native';
import {decode} from 'html-entities';
import moment from "moment";
import React,{useState,useEffect} from 'react';
import * as Constant from '../constants/globalConstant';

const SimpleMessage = ({item}) => {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    if (item.timestamp == "") {
      getCurrentTime();
    } else {
      getMessageTime(item.timestamp);
    }
  }, []);

  const getCurrentTime = (timeData) => {
    var date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours %= 12;
    hours = hours || 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes} ${ampm}`;
    setDateTime(strTime);
  };
  const getMessageTime = (timeData) => {
    const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let date = null;
    const time = new Date(parseInt(timeData) * 1000);
    var currentMessageDate = moment(time, "DD-MM-YYYY HH:mm:ss");
    var today = moment().endOf("day");
    let dateDifference = today.diff(currentMessageDate, "days");
    if (dateDifference == 0) {
      let hours = time.getHours();
      let minutes = time.getMinutes();
      hours %= 12;
      hours = hours || 12;
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      const ampm = time.getHours() >= 12 ? "pm" : "am";
      date = hours + ":" + minutes + " " + ampm;
    } else if (dateDifference == 1) {
      date = "Yesterday";
    } else if (dateDifference > 1 && dateDifference < 7) {
      date = week[time.getDay()];
    } else {
      let month = time.getMonth() + 1;
      date = time.getDate() + "-" + month + "-" + time.getFullYear();
    }
    setDateTime(date);
    return date;
  };
  return (
    <SafeAreaView>
      <View
        style={{
          width: '100%',
          alignItems: item.chat_is_sender != 'no' ? 'flex-end' : 'flex-start',
        }}>
        <View
          style={{
            backgroundColor: Constant.whiteColor,
            maxWidth: '75%',
            marginHorizontal: 15,
            marginTop: 10,
            marginBottom: 5,
            borderTopRightRadius: 13,
            borderTopLeftRadius: item.chat_is_sender == 'yes' ? 13 : 0,
            borderBottomRightRadius: item.chat_is_sender == 'yes' ? 0 : 13,
            borderBottomLeftRadius: 13,
            elevation: 3,
            shadowOffset: {width: 0, height: 1},
            shadowColor: '#000000',
            shadowOpacity: 0.1,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              ellipsizeMode="tail"
              style={{
                marginHorizontal: 10,
                marginTop: 10,
                marginBottom: 10,
                fontFamily: Constant.primaryFontRegular,
                lineHeight: 25,
                fontSize: 13,
                letterSpacing: 0.5,
                color: Constant.fontColor,
              }}>
              {decode(item.chat_message)}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent:
              item.chat_is_sender == 'yes' ? 'flex-end' : 'flex-start',
            marginHorizontal: 15,
          }}>
          <Text
            style={{
              marginRight: 2,
              marginHorizontal: item.chat_is_sender == 'yes' ? 5 : 0,
              fontFamily: 'OpenSans-Regular',
              fontSize: 10,
              letterSpacing: 0.5,
              color: Constant.lightGrayColor,
            }}>
            {dateTime}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SimpleMessage;
