export interface UserModel {
  fullName: string;
  coordinate: {
    longitude: number;
    latitude: number;
  };
  deviceToken: string;
  dataRaw: any;
}

class User {
  data: UserModel;

  constructor(data: UserModel) {
    this.data = data;
  }

  static formatData(data: any): UserModel {
    const splitLocation = data.geoLocation.split(',');
    return {
      fullName: data.fullName,
      coordinate: {
        latitude: parseFloat(splitLocation[0]),
        longitude: parseFloat(splitLocation[1]),
      },
      deviceToken: data.deviceToken,
      dataRaw: data,
    };
  }
}

export default User;
