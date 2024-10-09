import React, { useState, useEffect, useReducer } from "react";
import {
  View,
  Image,
  ImageBackground,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Constant from '../constants/globalConstant';
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BarIndicator, DotIndicator } from "react-native-indicators";
import Translation from '../constants/Translation';
// import moment from "moment";
// var moments = require("moment-timezone");

const ListCard = (props) => {
//   const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
//   const [groupImages, setGroupImeages] = useState([]);
//   const navigationforword = useNavigation();
//   const settings = useSelector((state) => state.setting.settings);
//   const translation = useSelector((state) => state.setting.translations);
//   var groupSize = props.groupDetail ? props.groupDetail.totalMembers : null;

//   const [statusLoader, setStatusLoader] = useState(false);
//   const [dateTime, setDateTime] = useState("");
//   const [notificationMessage, setNotificationMessage] = useState("");

//   useEffect(() => {
//     if (props.groupDetail) {
//       Object.entries(props.groupDetail.memberAvatars).map(([key, value]) => {
//         if (props.groupDetail.memberAvatars[key].memberStatus == "1") {
//           groupImages.push(value);
//         }
//       });
//     }
//     messageText(props.item, props.chatType);
//     getMessageTime(props.time);
//     forceUpdate();
//   }, [props.time]);



//   const getMessageTime = (timeData) => {
//     const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//     let date = null;
//     const time = new Date(parseInt(timeData) * 1000);
//     var currentMessageDate = moment(time, "DD-MM-YYYY HH:mm:ss");
//     var today = moment().endOf("day");
//     let dateDifference = today.diff(currentMessageDate, "days");
//     if (dateDifference == 0) {
//       let hours = time.getHours();
//       let minutes = time.getMinutes();
//       hours %= 12;
//       hours = hours || 12;
//       minutes = minutes < 10 ? `0${minutes}` : minutes;
//       const ampm = time.getHours() >= 12 ? "pm" : "am";
//       date = hours + ":" + minutes + " " + ampm;
//     } else if (dateDifference == 1) {
//       date = "Yesterday";
//     } else if (dateDifference > 1 && dateDifference < 7) {
//       date = week[time.getDay()];
//     } else {
//       month = ("0" + (time.getMonth() + 1)).slice(-2);
//       date =
//         ("0" + time.getDate()).slice(-2) +
//         "/" +
//         month +
//         "/" +
//         time.getFullYear();
//     }
//     setDateTime(date);
//     return date;
//   };
 

  
  return (
    <View
      style={{
        backgroundColor: Constant.whiteColor,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 10,
          paddingVertical: 10,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            // overflow: "hidden",
            width: "70%",
          }}
        >
          <View>
            
              <ImageBackground
                imageStyle={{ borderRadius: 45 / 2,borderColor:Constant.borderColor,borderWidth:1 }}
                style={{
                  width: 45,
                  height: 45,
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
                source={
                  props.image == ""
                    ? require("../../assets/images/NoImage.png")
                    : { uri: props.image }
                }
              >
              </ImageBackground>
              <View
                style={{
                  backgroundColor: props.isOnline ? "#22C55E" : "#ffc30d",
                  width: 15,
                  height: 15,
                  marginTop: -12,
                  marginRight: -3,
                  borderRadius: 15 / 2,
                  borderColor: Constant.whiteColor,
                  borderWidth: 3,
                  alignSelf: "flex-end",
                }}
              ></View>
          </View>

          <View>
            <Text
              numberOfLines={1}
              style={{
                marginLeft: 10,
                color: Constant.fontColor,
                fontSize: 15,
                lineHeight: 21,
                letterSpacing: 0.5,
                fontFamily: Constant.primaryFontSemiBold,
              }}
            >
              {props.name}
            </Text>
           
            
                {props.message != "" &&
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: 10,
                      marginTop: 5,
                    }}
                  >
                    {
                    props.isTyping == true ? (
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={{
                            color: Constant.primaryColor,
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
                            color={Constant.primaryColor}
                          />
                        </View>
                      </View>
                    ) : (
                      <Text
                        style={{
                          color: Constant.fontColor,
                          fontSize: 14,
                          fontFamily: Constant.primaryFontRegular,
                        }}
                        numberOfLines={1}
                      >
                        {props.isSender == "1" ? "You: "
                            : props.name + ": "
                          }
                        {props.message}
                      </Text>
                    )}
                  </View>
                }
                {/* {props.chat === "1" && props.messageStatus != "2" && (
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: 10,
                      marginTop: 5,
                      width: "100%",
                    }}
                  >
                    {props.typingText.length >= 1 &&
                    props.typingType == props.chatType &&
                    props.isTyping == true &&
                    props.item.chatId.split("_")[0] ==
                      (props.chatType != 1
                        ? props.typingId.split("_")[0]
                        : parseInt(props.typingSenderId)) ? (
                      <View style={{ flexDirection: "row" }}>
                        <Text
                          style={{
                            color: Constant.primaryColor,
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
                            color={Constant.primaryColor}
                          />
                        </View>
                      </View>
                    ) : (
                      <>
                        <Text
                          style={{
                            color: Constant.fontColor,
                            fontSize: 14,
                            fontFamily: Constant.primaryFontRegular,
                          }}
                        >
                          {props.chatType == "2"
                            ? props.isSender
                              ? "You:"
                              : props.userName + ":"
                            : ""}
                        </Text>
                        <Feather
                          style={{ marginLeft: 5 }}
                          name="paperclip"
                          type="paperclip"
                          color={"#999999"}
                          size={15}
                        />
                        {props.chatType != "2" && (
                          <Text
                            numberOfLines={1}
                            style={{
                              marginLeft: 5,
                              color: Constant.fontColor,
                              fontSize: 14,
                              fontFamily: Constant.primaryFontRegular,
                            }}
                          >
                            {props.isSender
                              ? translation.you_sent_attachment
                              : translation.sent_you_attachment}
                          </Text>
                        )}
                      </>
                    )}
                  </View>
                )} */}
                
          </View>
        </View>
        {/* {props.time && (
          <View style={{ alignItems: "flex-end", justifyContent: "center" }}>
            
            <Text
              style={{
                // backgroundColor:"#EF4444",
                color: "#999999",
                paddingHorizontal: 15,
                fontSize: 11,
                fontFamily: "OpenSans-Medium",
              }}
            >
              {dateTime}
            </Text> */}
            {props.unread != 0 && (
              <View
                style={{
                  backgroundColor: "#EF4444",
                  marginHorizontal: 10,
                  padding: 4,
                  marginTop: 5,
                  borderRadius: 50,
                }}
              >
                <Text
                  style={{
                    // backgroundColor:"#EF4444",
                    color: Constant.whiteColor,
                    fontSize: 9,
                    fontFamily: "OpenSans-Medium",
                  }}
                >
                  {props.unread.toString().length == 1
                    ? "0" + props.unread
                    : props.unread}
                  +
                </Text>
              </View>
            )}
          {/* </View>
         )} */}

      </View>
    </View>
  );
};

export default ListCard;
