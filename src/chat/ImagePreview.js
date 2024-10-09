import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Platform,
} from "react-native";
import * as Constant from '../constants/globalConstant';
import Entypo from "react-native-vector-icons/Entypo";

const ImagePreview = ({ route, navigation }) => {
  const [data, setData] = useState([]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        resizeMode={"contain"}
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
        source={{
          uri:
            route.params.item.hasOwnProperty("img") ? Platform.OS == "ios"
                ? route.params.item.img.sourceURL
                : route.params.item.img.path
              : route.params.item.image,
        }}
      >
        <View
          style={{
            backgroundColor: "#000",
            width: 60,
            height: 60,
            borderRadius: 30,
            marginBottom: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Entypo
            onPress={() => navigation.goBack()}
            name="cross"
            type="cross"
            color={Constant.whiteColor}
            size={32}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default ImagePreview;
