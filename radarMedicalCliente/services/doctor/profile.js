import {axiosInstance} from '../../config/api';

export const updateDoctorInfo = (body) => {
    return axiosInstance.put(`/users/UpdateUserDoctorInfo`, body, { 
        headers: {'Content-Type': 'application/json'}
    });
}
