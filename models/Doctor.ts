export interface DoctorModel {
  fullName: string;
  coordinate: {
    longitude: number;
    latitude: number;
  };
  deviceToken?: string;
  dataRaw: any;
  url?: string;
  id: string;
}

class Doctor {
  data: DoctorModel;

  constructor(data: DoctorModel) {
    this.data = data;
  }

  static formatData(data: any): DoctorModel {
    const splitLocation = data.geoLocation.split(',');
    return {
      fullName: data.fullName,
      coordinate: {
        latitude: parseFloat(splitLocation[0]),
        longitude: parseFloat(splitLocation[1]),
      },
      url: data.url,
      deviceToken: data.deviceToken,
      id: data.id,
      dataRaw: data,
    };
  }

  marker() {
    const {coordinate, fullName} = this.data;
    return {
      coordinate,
      //title: fullName,
      type: 'doctor',
    };
  }

  getTokenNotification() {
    const {deviceToken} = this.data;
    return deviceToken;
  }
}

export default Doctor;
