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

export const dateMessage = (date: number) => {
  try {
    return `${moment(date).format('HH:mm')}`;
  } catch (err: any) {
    console.log('dateChat() => err', {err});
    return '';
  }
};
