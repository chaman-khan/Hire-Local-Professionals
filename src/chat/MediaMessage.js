import { SafeAreaView, Text, View,TouchableOpacity ,Image} from 'react-native'
import { useNavigation } from "@react-navigation/native";
import React from 'react'

const MediaMessage = ({item}) => {
  const navigationforword = useNavigation();
  return (
    <SafeAreaView>
    <View
      style={{
        width: "100%",
        alignItems:
        item.chat_is_sender != "no" ?
        "flex-end"
            : "flex-start",
      }}
    >
        <View
            style={{
              backgroundColor: Constant.whiteColor,
              width: "25%",
              marginHorizontal: 15,
              marginTop: 10,
              marginBottom: 5,
              borderTopRightRadius: 13,
              borderTopLeftRadius: item.chat_is_sender == "yes" ? 13 : 0,
              borderBottomRightRadius: item.chat_is_sender == "yes" ? 0 : 13,
              borderBottomLeftRadius: 13,
              elevation: 3,
              shadowOffset: { width: 0, height: 1 },
              shadowColor: "#000000",
              shadowOpacity: 0.1,
              paddingHorizontal:10,
              paddingVertical: 10,
            }}
          >
            <TouchableOpacity
                style={{
                  width: "100%",
                  height: 90,
                  borderRadius: 5,
                }}
                onPress={() =>navigationforword.navigate("ImagePreview", {
                        item: item
                      })
                }
              >
                <Image
                  // resizeMode={"contain"}
                  style={{
                    width: "100%",
                    height: 90,
                    borderRadius: 5,
                  }}
                  source={{
                    uri: 
                    item.hasOwnProperty("img")
                      ? Platform.OS == "ios"
                        ? item.img.sourceURL
                        : item.img.path
                      : item.image  ,
                  }}
                />
              </TouchableOpacity>
          </View>
        </View>
        </SafeAreaView>
  )
}

export default MediaMessage
