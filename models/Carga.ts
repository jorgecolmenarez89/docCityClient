import {typeRelatives} from '../config/Enum';

export interface CargaModel {
  id?: number;
  name: string;
  relationship: string;
  age: string | number;
  sex: string;
}

class Carga {
  data: CargaModel;

  constructor(data: CargaModel) {
    this.data = data;
  }

  static formatData(data: any) {
    const {id, name, relationship, age, sex} = data;
    return {id, name, relationship, age, sex, data};
  }
}

export default Carga;
