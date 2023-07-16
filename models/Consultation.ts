import {UserModel} from './User';

export type ConsultationModel = {
  createdDate?: string;
  id?: string;
  userId?: string;
  medicoId?: string;
  doctor?: UserModel;
  description?: string;
  user?: UserModel;
  serviceRating?: number;
  status?: string;
};

class Consultation {
  data: ConsultationModel;

  constructor(data: ConsultationModel) {
    this.data = data;
  }

  static formatData(data: any): ConsultationModel {
    const {createdDate, id, userId, medicoId, doctor, description, user, serviceRating, status} =
      data;

    return {
      createdDate: createdDate,
      id: id,
      userId: userId,
      medicoId: medicoId,
      doctor: doctor,
      description: description,
      user: user,
      serviceRating: serviceRating,
      status: status,
    };
  }
}

export default Consultation;
