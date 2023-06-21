import {axiosInstance} from '../../config/api';
import {URL_MOCK} from '../../config/Constant';

export const getProivinces = () => {
  return axiosInstance.get(`/address/GetEstados`);
};

export const getProivincesById = id => {
  return axiosInstance.get(`/address/GetEstadosById/${id}`);
};

export const getMunicipalities = () => {
  return axiosInstance.get(`/address/GetMunicipios`);
};

export const getMunicipalitiesByProvinceId = id => {
  return axiosInstance.get(`/address/GetMunicipiosByEstadoId/${id}`);
};

export const getParroquies = () => {
  return axiosInstance.get(`/address/GetParroquias`);
};

export const getParroquiesByMinicipalyId = id => {
  return axiosInstance.get(`/address/GetParroquiasByMunicipioId/${id}`);
};

export const getCities = () => {
  return axiosInstance.get(`/address/GetCiudades`);
};

export const getCitiesByParroquieId = id => {
  return axiosInstance.get(`/address/GetCiudadesByParroquiaId/${id}`);
};

export const getRegions = () => {
  return axiosInstance({url: URL_MOCK}).get(`/regions`);
};
