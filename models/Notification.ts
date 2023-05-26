export enum TypeNotification {
  request = 'request',
}
export interface NotificationModel {
  id?: string | number;
  title?: string;
  description?: string;
  type?: TypeNotification;
  data?: any;
}

class Notification {
  data: NotificationModel;

  constructor(data: NotificationModel) {
    this.data = data;
  }

  static formatData(data: any) {
    const {title, description, type, ...other} = data;

    return {title, description, type, data: other};
  }
}

export default Notification;
