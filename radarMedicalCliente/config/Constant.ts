import {Platform} from 'react-native';

const locationPin = require('../assets/location-pin.png');
const business = require('../assets/business.png');
const gifCard = require('../assets/gif-card.png');
const doctorPin = require('../assets/doctor-pin.png');

export const IS_ANDROID = Platform.OS === 'android';

export const API_URL = 'http://209.145.57.238:8080/api';
export const URL_MOCK = 'http://192.168.0.20:3000/';

export const ASSETS = {
  locationPin: locationPin,
  business: business,
  gifCard: gifCard,
  doctorPin: doctorPin,
};

export const DEFAULT_REGION = {
  latitudeDelta: 0.0122,
  longitudeDelta: 0.0121,
};
