import {axiosInstance} from '../../config/api';

export const updateDoctorInfo = (body) => {
    return axiosInstance.put(`/users/UpdateUserDoctorInfo`, body, { 
        headers: {'Content-Type': 'application/json'}
    });
}

export const updateUserInfo = (body) => {
    return axiosInstance.put(`/users/UpdateUserInfo`, body, { 
        headers: {'Content-Type': 'application/json'}
    });
}