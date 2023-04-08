import {axiosInstance} from '../../config/api';

export const sendUserSecurityCode = async (data) => {
	return axiosInstance.post(`/users/SendUserSecurityCode`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const changePassword = async (userName, newPassword, securiyCode) => {
	return axiosInstance.get(`/users/ResetPassword/${userName}/${newPassword}/${securiyCode}`)
}

export const resetPassword = async () => {

}