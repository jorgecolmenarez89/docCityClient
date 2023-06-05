import {axiosInstance} from '../../config/api';

export const updateDoctorInfo = body => {
  return axiosInstance.put(`/users/UpdateUserDoctorInfo`, body, {
    headers: {'Content-Type': 'application/json'},
  });
};

export const updateUserInfo = body => {
  return axiosInstance({isNode: false}).put(`/users/UpdateUserCompleteInfo`, body, {
    headers: {'Content-Type': 'application/json'},
  });
};

export const formatBodyUser = body => {
  return {
    id: body.id,
    userName: body.userName,
    normalizedUserName: body.normalizedUserName,
    email: body.email,
    normalizedEmail: body.normalizedEmail,
    emailConfirmed: body.emailConfirmed,
    passwordHash: body.passwordHash,
    securityStamp: body.securityStamp,
    concurrencyStamp: body.concurrencyStamp,
    phoneNumber: body.phoneNumber ? body.phoneNumber : '',
    phoneNumberConfirmed: body.phoneNumberConfirmed,
    twoFactorEnabled: body.twoFactorEnabled,
    lockoutEnd: body.lockoutEnd,
    lockoutEnabled: body.lockoutEnabled ? body.lockoutEnabled : true,
    accessFailedCount: body.accessFailedCount ? body.accessFailedCount : 0,
    fullName: body.fullName,
    colegioMedicoId: body.colegioMedicoId ? body.colegioMedicoId : '',
    experienceYears: body.colegioMedicoId,
    medicalSpecialityId: body.medicalSpecialityId,
    sexo: body.sexo ? body.sexo : '',
    isAuthorizedDoctor: true,
    deviceToken: body.deviceToken,
    geoLocation: body.geoLocation,
    statusDoctor: body.statusDoctor,
    statusDoctorDescription: body.statusDoctorDescription,
    isCompletedInfo: body.isCompletedInfo,
    url: body.url,
    doctorUserHealthCenters: [],
  };
};

export const getProfile = async id => {
  return await axiosInstance({isNode: true}).get(`/users/${id}`);
};
