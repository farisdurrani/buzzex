import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { BackCancelButtons, BButton } from "../../components";
import { COLORS, LAYOUT } from "../../constants";

const ConfirmDelivery = ({ navigation, route }) => {
  const { receiverItem, packageItem } = route.params;

  let snapURI = null;

  if (route.params && route.params.snapURI) {
    snapURI = route.params.snapURI;
  }

  return (
    <View style={styles.mainContainer}>
      <BackCancelButtons navigation={navigation} />
      <View>
        <Text style={styles.titleText}>Now to complete your delivery!</Text>
      </View>
      <View style={[LAYOUT.centerMiddle, { marginBottom: 50 }]}>
        <TouchableOpacity
          style={[styles.pictureContainer, LAYOUT.centerMiddle]}
          onPress={() => {
            navigation.navigate("TakePicture", {
              nextScreen: "ConfirmDelivery",
            });
          }}
        >
          <Image
            style={styles.picture}
            source={{ uri: route.params.snapURI }}
          />
        </TouchableOpacity>
      </View>
      <BButton
        text="Confirm"
        onPress={() =>
          navigation.replace("DeliveryComplete", {
            homeScreen: "DeliveriesAvailable",
            receiverItem: receiverItem,
            packageItem: packageItem,
          })
        }
      />
    </View>
  );
};

export default ConfirmDelivery;

const styles = StyleSheet.create({
  mainContainer: {
    height: "90%",
    marginVertical: 60,
    marginHorizontal: 20,
    alignItems: "center",
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 40,
    textAlign: "center",
  },
  pictureContainer: {
    marginTop: 10,
    height: 450,
    width: 300,
    backgroundColor: COLORS.transparent_gray,
  },
  picture: {
    width: "90%",
    height: "90%",
  },
});
