import {Platform} from 'react-native';

const locationPin = require('../assets/location-pin.png');
const business = require('../assets/business.png');
const gifCard = require('../assets/gif-card.png');
const doctorPin = require('../assets/doctor-pin.png');
const flatMessage = require('../assets/flat-message.svg');
const flatReceiverMessage = require('../assets/flat-message-receiver.svg');

export const IS_ANDROID = Platform.OS === 'android';

export const API_URL = 'http://209.145.57.238:8080/api';
export const URL_MOCK = 'http://192.168.0.20:3000/';
export const URL_NODE = 'http://192.168.0.20:3100';
export const API_URL_NODE = `${URL_NODE}/api`;

export const BACKGROUNG_COLOR_MODAL = 'rgba(0,0,0,0.6)';

export const ASSETS = {
  locationPin: locationPin,
  business: business,
  gifCard: gifCard,
  doctorPin: doctorPin,
  user: 'https://cdn-icons-png.flaticon.com/512/147/147133.png',
  flatMessage: flatMessage,
  flatReceiverMessage: flatReceiverMessage,
};

export const NAME_ICON = {
  // ionicons
  arrowLeft: 'arrow-back',
  sendOutline: 'send-outline',
};

export const DEFAULT_REGION = {
  latitudeDelta: 0.0122,
  longitudeDelta: 0.0121,
};

export const PREFIXES = {
  navigation: 'doccity://',
};
