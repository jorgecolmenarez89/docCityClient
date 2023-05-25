interface DoctorModel {
  fullName: string;
  coordinate: {
    longitude: number;
    latitude: number;
  };
  deviceToken?: string;
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
      deviceToken: data.deviceToken,
    };
  }

  marker() {
    const {coordinate, fullName} = this.data;
    return {
      coordinate,
      title: fullName,
      type: 'doctor',
    };
  }

  getTokenNotification() {
    const {deviceToken} = this.data;
    return deviceToken;
  }
}

export default Doctor;
