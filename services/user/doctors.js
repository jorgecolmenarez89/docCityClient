import {axiosInstance} from '../../config/api';

export const getEspecialistasByEstado = (estadoId, especialidadId) => {
  return axiosInstance({isNode: false}).get(
    `/users/GetDoctorByStateAndSpeciality/${estadoId}/${especialidadId}`,
  );
};

export const getEspecialistasByMunicipio = (municipioId, especialidadId) => {
  return axiosInstance({isNode: false}).get(
    `/users/GetDoctorByMunicipioAndSpeciality/${municipioId}/${especialidadId}`,
  );
};

export const getEspecialistasByParroquia = (parroquiaId, especialidadId) => {
  return axiosInstance({isNode: false}).get(
    `/users/GetDoctorByParroquiaAndSpeciality/${parroquiaId}/${especialidadId}`,
  );
};

export const getEspecialistasByCenter = (centerId, especialidadId) => {
  return axiosInstance({isNode: false}).get(
    `/users/GetDoctorByHealthCenterId/${centerId}/${especialidadId}`,
  );
};

export const getPopulars = () => {
  return axiosInstance({isNode: true}).get(`/getPopularDoctors`);
};
