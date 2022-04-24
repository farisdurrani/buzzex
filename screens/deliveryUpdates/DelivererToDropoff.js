import React, { useEffect, useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  TextInput,
  View,
  Image,
  Dimensions,
} from "react-native";
import { Input, Button, Text, useTheme } from "react-native-elements";
import { BButton } from "../../components/index";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/Feather";
import MapComponent from "../../components/MapComponent";
import { onDeliveryUpdate } from "../../firebase";

const { width, height } = Dimensions.get("window"); //Screen dimensions
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.04; // Controls the zoom level of the map. Smaller means more zoomed in
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO; // Dependent on LATITUDE_DELTA

const DelivererToDropoff = ({ navigation, route }) => {
  const { senderItem, receiverItem, initPackageItem, delivererItem } =
    route.params;

  const [deliveryNotes, onAddDeliveryNotes] = useState("");
  const [packageItem, setPackageItem] = useState(initPackageItem);

  const deliverer_coord = initPackageItem.deliverer_coord;
  const dropOff_address = packageItem.data.destination_address;
  const [sourceLat, sourceLong] = [
    deliverer_coord.latitude,
    deliverer_coord.longitude,
  ];
  const [destinationLat, destinationLong] = [
    dropOff_address.address_coord.latitude,
    dropOff_address.address_coord.longitude,
  ];
  const hasLocationData = dropOff_address && deliverer_coord;
  const mapProps = hasLocationData
    ? {
        source: { sourceLat: sourceLat, sourceLong: sourceLong },
        dest: { destLat: destinationLat, destLong: destinationLong },
        LATITUDE_DELTA: LATITUDE_DELTA,
        LONGITUDE_DELTA: LONGITUDE_DELTA,
        style: styles.map,
      }
    : null;
  const unsubscribe = unsubscribeDeliveryJob(
    initPackageItem.id,
    setPackageItem
  );

  useEffect(async () => {
    if (packageItem.data.status >= 4) {
      unsubscribe();
      navigation.navigate("DeliveryComplete", {
        packageItem: packageItem,
        receiverItem: receiverItem,
        senderItem: senderItem,
        homeScreen: "Home",
        delivererItem: delivererItem,
        user_type: "Buyer/Seller",
      });
    }
  }, [packageItem]);

  return (
    <View style={styles.container}>
      <View style={styles.topleftbutton}>
        <TouchableOpacity onPress={navigation.goBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.lineone}>ETA - 2:55</Text>
      <Text style={styles.linetwo}>
        Dan is on the way to dropoff the delivery!
      </Text>
      <Image
        source={require("../../assets/buzzExLogo.png")}
        style={{
          marginTop: 16,
          width: 150,
          height: 167,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      />

      <View style={{ marginTop: 16, marginBottom: 30 }}>
        {/* Icon.Button Component */}
        <Icon.Button
          name="phone"
          backgroundColor="#000000"
          onPress={() => navigation.navigate("DeliveryComplete")}
        ></Icon.Button>
      </View>

      <View style={styles.headingContainer}>
        <Text style={styles.lineone}>ETA - 2:55</Text>
      </View>
      {hasLocationData ? (
        <MapComponent mapProps={{ ...mapProps, style: styles.map }} />
      ) : (
        <Text style={styles.paragraph}>Loading Map...</Text>
      )}
      <View style={styles.bottomContainer}>
        <Text style={styles.linetwo}>
          Dan is on the way to deliver the package!
        </Text>
        <TextInput
          style={styles.linetwo}
          placeholder="Any delivery notes?"
          value={deliveryNotes}
          onChangeText={onAddDeliveryNotes}
        ></TextInput>
        <Icon.Button
          name="phone"
          backgroundColor="#000000"
          onPress={() => navigation.navigate("DelivererToDropoff")}
        ></Icon.Button>
        <BButton
          text="Go to Delivery Complete Screen"
          onPress={() =>
            navigation.navigate("DeliveryComplete", {
              mapProps: mapProps,
              homeScreen: "Home",
            })
          }
          containerStyle={{
            width: 200,
            marginHorizontal: 50,
            marginVertical: 20,
          }}
        />
      </View>
    </View>
  );
};

export default DelivererToDropoff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lineone: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  linetwo: {
    paddingBottom: 25,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  linethree: {
    paddingBottom: 25,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    padding: 20,
  },
  buttonView: {
    position: "absolute",
    top: (5 / 6) * height,
  },
  buttonContainer: {},
  buttonOutline: {},
  buttonOutlineText: {},
  buttonText: {
    color: "blue",
  },
  input: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, .2)",
  },
  inputContainer: {},
  headingContainer: {
    position: "absolute",
    top: 50,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 25,
  },
  font: {
    textAlign: "center",
    maxWidth: 200,
    fontWeight: "bold",
  },
  topleftbutton: {
    position: "absolute",
    left: 25,
    top: 50,
  },
  toprightbutton: {
    position: "absolute",
    right: 25,
    top: 50,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    top: (1 / 7) * height,
    bottom: (1 / 3) * height,
  },
});
