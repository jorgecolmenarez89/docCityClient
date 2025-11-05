export enum StatusRequest {
  started = 'iniciada',
  inProgress = 'en proceso',
  cancelada = 'cancelada',
  finished = 'finalizada',
}

export enum TypeToast {
  success = 'success',
  error = 'error',
  info = 'info',
}

export enum NavigationRoutes {
  chat = 'Chat',
  chats = 'Chats',
  paymentMethods = 'PaymentMethods',
  paymentForm = 'PaymentForm',
}

export enum StateUserInUseApp {
  onLine = 'En linea',
  outLine = 'Fuera de linea',
}

export enum typeRelatives {
  madre = 'Madre',
  padre = 'Padre',
  hijo = 'Hijo',
  hija = 'Hija',
  hermano = 'Hermano',
  hermana = 'Hermana',
  abuelo = 'Abuelo',
  abuela = 'Abuela',
  prima = 'Prima',
  primo = 'Primo',
  tio = 'Tio',
  tia = 'Tia',
  otro = 'Otro',
}

export enum TypePayment {
  transferencia = 'Transferencia',
  pagoMovil = 'Pago Móvil',
  deposito = 'Depósito',
  divisa = 'Divisa',
}
