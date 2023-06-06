import {Platform} from 'react-native';
import {API_URL as apiUrl, URL_MOCK as urlMock, URL_NODE as urlNode} from '@env';

const locationPin = require('../assets/location-pin.png');
const business = require('../assets/business.png');
const doctorPin = require('../assets/doctor-pin.png');
const flatMessage = require('../assets/flat-message.svg');
const flatReceiverMessage = require('../assets/flat-message-receiver.svg');

export const IS_ANDROID = Platform.OS === 'android';

export const API_URL = apiUrl;
export const URL_MOCK = urlMock;
export const URL_NODE = urlNode;
export const API_URL_NODE = `${URL_NODE}/api`;

export const BACKGROUNG_COLOR_MODAL = 'rgba(0,0,0,0.6)';

export const ASSETS = {
  locationPin: locationPin,
  business: business,
  doctorPin: doctorPin,
  user: 'https://cdn-icons-png.flaticon.com/512/3033/3033143.png',
  flatMessage: flatMessage,
  flatReceiverMessage: flatReceiverMessage,
};

export const NAME_ICON = {
  // ionicons
  sendOutline: 'send-outline',
  close: 'close-circle-outline',
  // materials
  arrowLeft: 'arrow-back-ios',
  photo: 'photo',
  camera: 'camera-alt',
  attachment: 'attachment',
};

export const DEFAULT_REGION = {
  latitudeDelta: 0.0122,
  longitudeDelta: 0.0121,
};

export const PREFIXES = {
  navigation: 'doccity://',
};

// distancia de busqueda para doctores en mts
export const SEARCH_DISTANCE = 9000;
