import {axiosInstance} from '../../config/api';


export const getCenters = () => {
    return axiosInstance.get(`/centers/GetAllHealthCenters`);
}

export const getCenter = (id) => {
    return axiosInstance.get(`/centers/GetGenterById${id}`);
}

export const getCentersByUser = (userId) => {
    return axiosInstance.get(`/centers/GetHealthCenterByUser/${userId}`);
}


export const getCentersByEstado = (estadoId) => {
    return axiosInstance.get(`/centers/GetCentrosByEstadoId/${estadoId}`);
}
export const getCentersByParroquia = (parroquiaId) => {
    return axiosInstance.get(`/centers/GetCentrosByParroquiaId/${parroquiaId}`);
}
export const getCentersByMunicipio = (municipioId) => {
    return axiosInstance.get(`/centers/GetCentrosByMunicupioId/${municipioId}`);
}
export const getCentersByCiudad = (ciudadId) => {
    return axiosInstance.get(`/centers/GetCentrosByCiudadId/${ciudadId}`);
}


export const updateCenter = (body, id) => {
    return axiosInstance.put(`/centers/UpdateUserDoctorInfo${id}`, body);
}

export const createCenter = (body) => {
    return axiosInstance.post(`/centers/InsertHealthCenter`, body, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export const deleteCenter = (id) => {
    return axiosInstance.get(`/centers/GetAllHealthCenters`);
}
export const addDoctorCenter = (healthCenterId, userName) => {
    return axiosInstance.post(`/centers/AddUserHealthCenter/${healthCenterId}/${userName}`, {}, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

