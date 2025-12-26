import firestore from '@react-native-firebase/firestore';

export interface ISearch {
  id?: string;
  userId: string;
  status?: string;
  type?: string;
  data?: any;
  createdAt?: any;
  [key: string]: any;
}

export const getSearchesByUserId = async (userId: string) => {
  try {
    let result;
    // Intentar obtener con ordenamiento, solo búsquedas activas (status 'green')
    try {
      result = await firestore()
        .collection('search')
        .where('userId', '==', userId)
        .where('status', '==', 'green')
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();
    } catch (orderError: any) {
      // Si falla el ordenamiento (por ejemplo, falta índice), obtener sin ordenar
      console.log('getSearchesByUserId() orderBy error, trying without orderBy', orderError);
      result = await firestore()
        .collection('search')
        .where('userId', '==', userId)
        .where('status', '==', 'green')
        .limit(10)
        .get();
    }

    const searches: ISearch[] = [];
    result.forEach(doc => {
      searches.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Ordenar manualmente si no se pudo ordenar en la consulta
    if (searches.length > 0 && searches[0].createdAt) {
      searches.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds || 0;
        return bTime - aTime;
      });
    }

    return {status: true, data: searches};
  } catch (err: any) {
    console.log('getSearchesByUserId() ==> err', {err});
    return {status: false, message: 'No fue posible obtener las búsquedas.', data: []};
  }
};
