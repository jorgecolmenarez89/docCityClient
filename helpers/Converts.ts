import moment from 'moment';

export const dateChat = (date: number) => {
  try {
    if (moment(date).isSame(moment(), 'day')) {
      return `${moment(date).format('HH:mm')}`;
    } else if (moment(date).isSame(moment().subtract('day', 1), 'day')) {
      return 'Ayer';
    }
    return moment(date).format('MM/DD/YY');
  } catch (err: any) {
    console.log('dateChat() => err', {err});
    return '';
  }
};

export const dateMessage = (date: number | Date) => {
  try {
    return `${moment(date).format('hh:mm A')}`;
  } catch (err: any) {
    console.log('dateChat() => err', {err});
    return '';
  }
};

export const dateToYYYYMMDD = (date: Date | number | string) => {
  try {
    let momentDate;
    // Si es string y tiene formato dd/mm/yyyy, parsearlo específicamente
    if (typeof date === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      momentDate = moment(date, 'DD/MM/YYYY');
    } else {
      // Para Date, number o otros formatos de string
      momentDate = moment(date);
    }
    // Establecer hora a medianoche en UTC y formatear como ISO sin milisegundos
    return momentDate.utc().startOf('day').format('YYYY-MM-DDTHH:mm:ss') + 'Z';
  } catch (err: any) {
    console.log('dateToYYYYMMDD() => err', {err});
    return '';
  }
};
