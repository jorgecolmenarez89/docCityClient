import firestore from '@react-native-firebase/firestore';

export interface IVacuna {
  id?: string;
  name: string;
  userId: string;
  createdAt: string;
}

export const getAllVacunas = async (id: string) => {
  try {
    const result = await firestore()
      .collection('vacunas')
      .where('userId', '==', id)
      .orderBy('createdAt', 'desc')
      .get();

    const vacunas: IVacuna[] = [];
    result.forEach(doc => {
      vacunas.push({
        id: doc.id,
        name: doc.data().name,
        createdAt: doc.data().createdAt,
        userId: doc.data().userId,
      });
    });
    return {status: true, data: vacunas};
  } catch (err: any) {
    console.log('getAllVacunas() ==> err', {err});
    return {status: false, message: 'No fue posible obtener los vacunas.'};
  }
};

export const getVacunaById = async (id: string) => {
  try {
    const doc = await firestore().collection('vacunas').doc(id).get();
    if (doc) {
      return {
        status: true,
        data: {...doc.data(), id: doc.id},
      };
    }
    return {status: false};
  } catch (err: any) {
    return {status: false, message: 'No fue posible obtener el chat.'};
  }
};
