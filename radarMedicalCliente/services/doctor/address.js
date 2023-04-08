import {axiosInstance} from '../../config/api';

export const getProivinces = () => {
    return axiosInstance.get(`/address/GetEstados`);
}

export const getProivincesById = (id) => {
    return axiosInstance.get(`/address/GetEstadosById/${id}`);
}

export const getMunicipalities = () => {
    return axiosInstance.get(`/address/GetMunicipios`);
}

export const getMunicipalitiesByProvinceId = (id) => {
    return axiosInstance.get(`/address/GetMunicipiosByEstadoId/${id}`);
}

export const getParroquies = () => {
    return axiosInstance.get(`/address/GetParroquias`);
}

export const getParroquiesByMinicipalyId = (id) => {
    return axiosInstance.get(`/address/GetParroquiasByMunicipioId/${id}`);
}

export const getCities = () => {
    return axiosInstance.get(`/address/GetCiudades`);
}

export const getCitiesByParroquieId = (id) => {
    return axiosInstance.get(`/address/GetCiudadesByParroquiaId/${id}`);
}