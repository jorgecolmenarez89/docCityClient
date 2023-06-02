import axios from 'axios';
import {ASSETS, SEARCH_DISTANCE, URL_MOCK} from '../../config/Constant';
import {axiosInstance} from '../../config/api';

export const agregarUbicacion = async body => {};

export const actualizarUbicacion = (body, id) => {};

export const mostrarUbicaciones = async (params: {
  user: {longitude: string; latitude: string};
  especialidadId: number;
}) => {
  try {
    return await axiosInstance({}).get(
      `users/GetDoctorsNearMeBySpeciality/${params.user.latitude},${params.user.longitude}/${SEARCH_DISTANCE}/${params.especialidadId}`,
      {
        headers: {'Content-Type': 'application/json; charset=utf-8'},
      },
    );
  } catch (err) {
    console.log('mostrarUbicaciones() ==> err', {err});
    return {status: false, msg: err?.message};
  }
};

export const eliminarUbicacion = id => {};

export const mostarUbicacion = id => {};
