import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { BButton, BackCancelButtons } from "../../components/index";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { COLORS, LAYOUT } from "../../constants";
import {
  addFirestoreData,
  getServerTimestamp,
  generateGeolocation,
  getCurrentUser,
} from "../../firebase";

const SellerConfirmScreen = ({ navigation, route }) => {
  const { itemName, itemPrice } = route.params;

  const DELIVERY_FEE = 2.31;

  const ItemDetailGroup = (props) => {
    const { title, text } = props;
    return (
      <View style={[LAYOUT.centerMiddle]}>
        <Text style={styles.detailTitle}>{title}</Text>
        <View>
          <Text style={styles.inputText}>{text}</Text>
        </View>
      </View>
    );
  };

  const _saveDeliveryJob = () => {
    addFirestoreData({
      completed: false,
      timestamp: getServerTimestamp(),
      deliverer_location: null,
      createdAt: getServerTimestamp(),
      deliverer_uid: null,
      destinaton: generateGeolocation(79, 79),
      package: {
        name: itemName,
        base_price: itemPrice,
        delivery_fee: DELIVERY_FEE,
        sender_photoURL: null,
        tax: 2.3,
        tip: 0,
      },
      receiver_uid: null,
      sender_uid: getCurrentUser().uid,
      source: generateGeolocation(89, 89),
    });
  };

  const PriceItem = (props) => {
    const { itemName, price, bold } = props;
    const stylesPI = StyleSheet.create({
      mainContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: COLORS.transparent_gray,
        padding: 10,
        width: 300,
      },
      text: {
        fontWeight: bold ? "bold" : "normal",
        fontSize: 20,
      },
    });
    return (
      <View style={stylesPI.mainContainer}>
        <Text style={stylesPI.text}>{itemName}</Text>
        <Text style={stylesPI.text}>{price}</Text>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <BackCancelButtons navigation={navigation} />

      <View>
        <Text style={styles.receiverText}>Receiver</Text>
      </View>

      <View
        style={[
          LAYOUT.centerMiddle,
          LAYOUT.row,
          { marginTop: 20, width: "75%" },
        ]}
      >
        <Image
          source={require("../../assets/earth_face.png")}
          style={{
            width: 130,
            height: 130,
            borderRadius: 130 / 2,
          }}
        />
        <View style={[{ marginLeft: 20 }]}>
          <Text style={styles.name}>Bob The Buyer</Text>
          <Text style={styles.username}>@bobTheBuyer</Text>
        </View>
      </View>

      <View style={[LAYOUT.row]}>
        <View style={LAYOUT.centerMiddle}>
          <Text style={styles.detailTitle}>Item Picture</Text>
          <TouchableOpacity
            style={[styles.cameraButton, LAYOUT.centerMiddle]}
            onPress={() => {
              navigation.navigate("TakePicture");
            }}
          >
            {route.params.snapURI ? (
              <Image
                style={styles.picture}
                source={{
                  uri: route.params.snapURI,
                }}
              />
            ) : (
              <AntDesign name="camera" size={50} color={COLORS.primary_red} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.nameEta}>
          <ItemDetailGroup title="Item Name" text={route.params.itemName} />
          <ItemDetailGroup title="ETA" text="12:43 pm" />
        </View>
      </View>

      <View>
        <PriceItem
          itemName="Item price"
          price={`\$${route.params.itemPrice}`}
        />
        <PriceItem itemName="Delivery" price={`\$${DELIVERY_FEE}`} />
        <PriceItem
          itemName="Subtotal"
          price={`\$${route.params.itemPrice + DELIVERY_FEE}`}
          bold="bold"
        />
      </View>

      <View style={LAYOUT.centerMiddle}></View>

      <BButton
        text="Confirm"
        onPress={() => {
          navigation.navigate("SellerAwaiting");
          _saveDeliveryJob();
        }}
      />
    </View>
  );
};

export default SellerConfirmScreen;

const styles = StyleSheet.create({
  mainContainer: {
    height: "95%",
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  upperButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
  },
  username: {
    fontSize: 20,
    color: COLORS.primary_red,
  },
  detailTitle: {
    paddingTop: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  inputContainer: {
    marginTop: 10,
    width: 150,
    paddingVertical: 8,
    backgroundColor: COLORS.transparent_gray,
  },
  inputText: {
    fontSize: 20,
  },
  picture: {
    width: "90%",
    height: "90%",
  },
  cameraButton: {
    marginTop: 10,
    height: 150,
    width: 150,
    backgroundColor: COLORS.transparent_gray,
  },
  receiverText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  nameEta: {
    width: "50%",
  },
});
