import {axiosInstance} from '../../config/api';

export const getEspecialistasByEstado = (estadoId, especialidadId) => {
  return axiosInstance.get(`/users/GetDoctorByStateAndSpeciality/${estadoId}/${especialidadId}`);
};

export const getEspecialistasByMunicipio = (municipioId, especialidadId) => {
  return axiosInstance.get(
    `/users/GetDoctorByMunicipioAndSpeciality/${municipioId}/${especialidadId}`,
  );
};

export const getEspecialistasByParroquia = (parroquiaId, especialidadId) => {
  return axiosInstance.get(
    `/users/GetDoctorByParroquiaAndSpeciality/${parroquiaId}/${especialidadId}`,
  );
};

export const getEspecialistasByCenter = (centerId, especialidadId) => {
  return axiosInstance.get(`/users/GetDoctorByHealthCenterId/${centerId}/${especialidadId}`);
};
