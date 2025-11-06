import React, {useContext, useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Button, Icon} from '@rneui/themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {AuthContext} from '../../context/AuthContext';
import {RootStackParamList} from '../../config/Types';
import {TypePayment, TypeToast} from '../../config/Enum';
import MaskInput, {Masks} from 'react-native-mask-input';
import {getDollarOficial} from '../../services/doctor/dollar';
import {bancos, formatSelectBancos, formatSelectBancosDivisas} from '../../helpers/bancos';
import {createPaymentSender} from '../../services/doctor/payments';
import {sendNotificationPaymentSender} from '../../services/doctor/notification';
import {dateToYYYYMMDD} from '../../helpers/Converts';

type PaymentFormScreenProps = NativeStackScreenProps<RootStackParamList, 'PaymentForm'>;

interface PaymentMethod {
  id?: string;
  Id?: number;
  type?: string;
  PaymentType?: string;
  accountNumber?: string;
  AccountNumber?: string;
  bankName?: string;
  BankName?: string;
  accountName?: string;
  AccountType?: string;
  phoneNumber?: string;
  PhoneNumber?: string;
  BankCode?: string;
  DniNumber?: string;
  Titular?: string;
}

interface PaymentData {
  Id?: number;
  ReceiverUserId: string;
  PaymentType: string;
  BankCode: string;
  BankName: string;
  Titular: string;
  AccountNumber: string;
  DniNumber: string;
  AccountType: string;
  PhoneNumber: string;
  AmountBs: number;
  AmountUsd: number;
  TransactionDate: Date;
  RateOfDay: number;
  RequestId: string;
  SenderUserId: string;
  BankCodeSender: string;
  BankNameSender: string;
  AccountNumberSender: string;
  DniNumberSender: string;
  AccountTypeSender: string;
  PhoneNumberSender: string;
  Status: string;
  ReferenceCode: string;
  PaymentTypeSender: string;
}

const paymentOptions = [
  {label: 'Seleccione..', value: 'Seleccione'},
  {label: 'Pago Móvil', value: 'Pago Móvil'},
  {label: 'Transferencia', value: 'Transferencia'},
  {label: 'Depósito', value: 'Depósito'},
  {label: 'Divisa', value: 'Divisa'},
];

const consultationPrice = 10;

function PaymentFormScreen({navigation, route}: PaymentFormScreenProps) {
  const {userLoged, showToast} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [selectedPaymentMethodObj, setSelectedPaymentMethodObj] = useState<PaymentMethod | null>(
    null,
  );
  const [paymentData, setPaymentData] = useState<Partial<PaymentData>>({
    ReceiverUserId: '',
    PaymentType: '',
    BankCode: '',
    BankName: '',
    Titular: '',
    AccountNumber: '',
    DniNumber: '',
    AccountType: '',
    PhoneNumber: '',
    AmountBs: 0,
    AmountUsd: consultationPrice,
    TransactionDate: new Date(),
    RateOfDay: 0,
    RequestId: '',
    SenderUserId: '',
    BankCodeSender: '',
    BankNameSender: '',
    AccountNumberSender: '',
    DniNumberSender: '',
    AccountTypeSender: '',
    PhoneNumberSender: '',
    Status: 'pendiente',
    ReferenceCode: '',
    PaymentTypeSender: 'Seleccione',
  });
  const [dollarOficial, setDollarOficial] = useState<any>(null);

  // Estados para campos del formulario (temporal para los inputs)
  const [formAmount, setFormAmount] = useState('');
  const [formReference, setFormReference] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Estados para datos del remitente (sender)
  const [senderBankCode, setSenderBankCode] = useState('');
  const [senderBankName, setSenderBankName] = useState('');
  const [senderAccountNumber, setSenderAccountNumber] = useState('');
  const [senderDniNumber, setSenderDniNumber] = useState('');
  const [senderAccountType, setSenderAccountType] = useState('');
  const [senderPhoneNumber, setSenderPhoneNumber] = useState('');
  const [senderPaymentType, setSenderPaymentType] = useState('');

  // Estado para bancos
  const bankOptions = formatSelectBancos();

  const params = route.params as any;
  const doctor = params?.doctor;
  const requestId = params?.requestId;
  const paymentMethodsRaw = params?.paymentMethods || [];
  const preselectedMethod = params?.selectedPaymentMethod;

  // Normalizar los métodos de pago para que tengan un formato consistente (usando useMemo para evitar recrear el array)
  const paymentMethods: PaymentMethod[] = useMemo(() => {
    return paymentMethodsRaw.map((method: any) => ({
      id: method.Id?.toString() || method.id || '',
      Id: method.Id || method.id,
      type: method.PaymentType || method.type || '',
      PaymentType: method.PaymentType || method.type,
      accountNumber: method.AccountNumber || method.accountNumber,
      AccountNumber: method.AccountNumber || method.accountNumber,
      bankName: method.BankName || method.bankName,
      BankName: method.BankName || method.bankName,
      accountName: method.AccountType || method.accountName || method.Titular,
      AccountType: method.AccountType || method.accountName || method.Titular,
      phoneNumber: method.PhoneNumber || method.phoneNumber,
      PhoneNumber: method.PhoneNumber || method.phoneNumber,
      BankCode: method.BankCode || '',
      DniNumber: method.DniNumber || '',
      Titular: method.Titular || '',
    }));
  }, [paymentMethodsRaw]);

  useEffect(() => {
    // Si viene un método preseleccionado desde la pantalla anterior, establecerlo
    if (preselectedMethod && paymentMethods.length > 0) {
      setPaymentData(prev => ({
        ...prev,
        PaymentType: preselectedMethod.PaymentType || preselectedMethod.type || '',
        BankCode: preselectedMethod.BankCode || '',
        BankName: preselectedMethod.BankName || preselectedMethod.bankName || '',
        Titular: preselectedMethod.Titular || '',
        AccountNumber: preselectedMethod.AccountNumber || preselectedMethod.accountNumber || '',
        DniNumber: preselectedMethod.DniNumber || '',
        AccountType: preselectedMethod.AccountType || preselectedMethod.accountName || '',
        PhoneNumber: preselectedMethod.PhoneNumber || preselectedMethod.phoneNumber || '',
        RequestId: requestId || '',
      }));

      const methodId = preselectedMethod.Id?.toString() || preselectedMethod.id || '';
      setSelectedPaymentMethod(methodId);

      // Buscar el método en la lista normalizada
      const foundMethod = paymentMethods.find(
        m => m.Id?.toString() === methodId || m.id === methodId,
      );
      if (foundMethod) {
        setSelectedPaymentMethodObj(foundMethod);
      }
    }
  }, [preselectedMethod, paymentMethods]);

  useEffect(() => {
    findDollarOficial();
  }, []);

  const findDollarOficial = async () => {
    try {
      const response = await getDollarOficial();
      if (response.data) {
        const objectDolar = response.data.dolar;
        const promedio = objectDolar.promedio || 0;
        setDollarOficial(promedio);
        // Actualizar RateOfDay en paymentData
        const amountBs = parseFloat((consultationPrice * promedio).toFixed(2));
        setPaymentData(prev => ({
          ...prev,
          RateOfDay: promedio,
          AmountBs: amountBs,
          AmountUsd: consultationPrice,
        }));
      } else {
        setDollarOficial(null);
      }
    } catch (error) {
      console.log('error en getDollarOficial', error);
    }
  };

  // Actualizar paymentData cuando se selecciona un método de pago
  useEffect(() => {
    if (selectedPaymentMethodObj && doctor) {
      setPaymentData(prev => ({
        ...prev,
        ReceiverUserId: doctor.id || '',
        PaymentType:
          selectedPaymentMethodObj.PaymentType ||
          selectedPaymentMethodObj.type ||
          prev.PaymentType ||
          '',
        BankCode: selectedPaymentMethodObj.BankCode || prev.BankCode || '',
        BankName:
          selectedPaymentMethodObj.BankName ||
          selectedPaymentMethodObj.bankName ||
          prev.BankName ||
          '',
        Titular:
          selectedPaymentMethodObj.Titular ||
          selectedPaymentMethodObj.AccountType ||
          selectedPaymentMethodObj.accountName ||
          prev.Titular ||
          '',
        AccountNumber:
          selectedPaymentMethodObj.AccountNumber ||
          selectedPaymentMethodObj.accountNumber ||
          prev.AccountNumber ||
          '',
        DniNumber: selectedPaymentMethodObj.DniNumber || prev.DniNumber || '',
        AccountType:
          selectedPaymentMethodObj.AccountType ||
          selectedPaymentMethodObj.accountName ||
          prev.AccountType ||
          '',
        PhoneNumber:
          selectedPaymentMethodObj.PhoneNumber ||
          selectedPaymentMethodObj.phoneNumber ||
          prev.PhoneNumber ||
          '',
        RequestId: requestId || prev.RequestId || '',
        SenderUserId: userLoged.id || prev.SenderUserId || '',
      }));
    }
  }, [selectedPaymentMethodObj, doctor, requestId, userLoged]);

  const handleChange = (text: string, field: string) => {
    setPaymentData({
      ...paymentData,
      [field]: text,
    });
  };

  const validateForm = (): boolean => {
    if (!selectedPaymentMethod || selectedPaymentMethod === 'Seleccione') {
      Alert.alert('Atención', 'Debe seleccionar un método de pago');
      return false;
    }
    const amountBsValue =
      typeof paymentData.AmountBs === 'string'
        ? parseFloat(paymentData.AmountBs)
        : Number(paymentData.AmountBs);
    if (!amountBsValue || isNaN(amountBsValue) || amountBsValue <= 0) {
      Alert.alert('Atención', 'Debe ingresar un monto válido');
      return false;
    }
    if (!paymentData.ReferenceCode || paymentData.ReferenceCode === '') {
      Alert.alert('Atención', 'Debe ingresar el número de referencia');
      return false;
    }
    if (!formDate) {
      Alert.alert('Atención', 'Debe ingresar la fecha del pago');
      return false;
    }
    return true;
  };

  const buildPaymentData = (): PaymentData => {
    const amountBs = parseFloat(formAmount) || 0;
    const rate = dollarOficial || paymentData.RateOfDay || 1;
    const amountUsd = amountBs / rate;
    return {
      ReceiverUserId: paymentData.ReceiverUserId || doctor?.id || '',
      PaymentType: paymentData.PaymentType || selectedPaymentMethod || '',
      BankCode: paymentData.BankCode || '',
      BankName: paymentData.BankName || '',
      Titular: paymentData.Titular || '',
      AccountNumber: paymentData.AccountNumber || '',
      DniNumber: paymentData.DniNumber || '',
      AccountType:
        paymentData.AccountType === '' || paymentData.AccountType === null
          ? 'Corriente'
          : paymentData.AccountType || '',
      PhoneNumber: paymentData.PhoneNumber || '',
      AmountBs: paymentData.AmountBs || amountBs,
      AmountUsd: paymentData.AmountUsd || amountUsd,
      TransactionDate: dateToYYYYMMDD(paymentData.TransactionDate || new Date()) || new Date(),
      RateOfDay: rate,
      RequestId: paymentData.RequestId || requestId || '',
      SenderUserId: paymentData.SenderUserId || userLoged.id || '',
      BankCodeSender: paymentData.BankCodeSender || senderBankCode || '',
      BankNameSender: paymentData.BankNameSender || senderBankName || '',
      AccountNumberSender: paymentData.AccountNumberSender || senderAccountNumber || '',
      DniNumberSender: paymentData.DniNumberSender || senderDniNumber || '',
      AccountTypeSender:
        paymentData.AccountTypeSender === '' || paymentData.AccountTypeSender === null
          ? 'Corriente'
          : paymentData.AccountTypeSender || senderAccountType || '',
      PhoneNumberSender: paymentData.PhoneNumberSender || senderPhoneNumber || '',
      Status: 'pendiente',
      ReferenceCode: paymentData.ReferenceCode || formReference || '',
      PaymentTypeSender: paymentData.PaymentTypeSender || selectedPaymentMethod || '',
    } as PaymentData;
  };

  const clearForm = () => {
    setSelectedPaymentMethod('');
    setSelectedPaymentMethodObj(null);
    setFormAmount('');
    setFormReference('');
    setFormDate('');
    setFormDescription('');
    setSenderBankCode('');
    setSenderBankName('');
    setSenderAccountNumber('');
    setSenderDniNumber('');
    setSenderAccountType('');
    setSenderPhoneNumber('');
    setSenderPaymentType('');
    setPaymentData({
      ReceiverUserId: '',
      PaymentType: '',
      BankCode: '',
      BankName: '',
      Titular: '',
      AccountNumber: '',
      DniNumber: '',
      AccountType: '',
      PhoneNumber: '',
      AmountBs: 0,
      AmountUsd: consultationPrice,
      TransactionDate: new Date(),
      RateOfDay: dollarOficial || 0,
      RequestId: '',
      SenderUserId: '',
      BankCodeSender: '',
      BankNameSender: '',
      AccountNumberSender: '',
      DniNumberSender: '',
      AccountTypeSender: '',
      PhoneNumberSender: '',
      Status: 'pendiente',
      ReferenceCode: '',
      PaymentTypeSender: 'Seleccione',
    });
  };

  const handleSubmitPayment = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Construir el objeto de pago con la estructura completa
      const paymentPayload = buildPaymentData();
      const response = await createPaymentSender(paymentPayload);
      if (response.data) {
        showToast({
          description: 'Pago registrado exitosamente',
          type: TypeToast.success,
        });
        const responseNotification = await sendNotificationPaymentSender({
          doctor: doctor,
          user: userLoged,
          idRequest: requestId,
          amount: paymentData.AmountBs,
        });

        if (responseNotification.status) {
          showToast({
            description: 'Notificación enviada exitosamente',
            type: TypeToast.success,
          });
        } else {
          showToast({
            description: 'Error al enviar notificación',
            type: TypeToast.error,
          });
        }
        clearForm();
        navigation.navigate('Home');
      } else {
        showToast({
          description: 'Error al registrar el pago',
          type: TypeToast.error,
        });
      }
    } catch (error: any) {
      console.log('Error al procesar pago:', error);
      showToast({
        description: 'Error al procesar el pago. Intente nuevamente.',
        type: TypeToast.error,
      });
    } finally {
      setLoading(false);
    }
  };

  const isPagoMovil = () => {
    return selectedPaymentMethod === TypePayment.pagoMovil;
  };

  const hasSelectedPaymentMethod = () => {
    return paymentData.PaymentTypeSender !== 'Seleccione' && paymentData.PaymentTypeSender !== '';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps='handled'>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Datos del Pago</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Método de Pago *</Text>
            <SelectDropdown
              data={paymentOptions}
              onSelect={(selectedItem: {label: string; value: string}) => {
                setSelectedPaymentMethod(selectedItem.value);
                handleChange(selectedItem.value, 'PaymentTypeSender');
              }}
              buttonTextAfterSelection={(selectedItem: {label: string; value: string}) => {
                return selectedItem.label || selectedItem.value || '';
              }}
              rowTextForSelection={(item: {label: string; value: string}) => {
                return item.label || item.value || '';
              }}
              buttonStyle={styles.dropdown}
              buttonTextStyle={styles.dropdownText}
              renderDropdownIcon={isOpened => {
                return (
                  <FontAwesome
                    name={isOpened ? 'chevron-up' : 'chevron-down'}
                    color={'#9fa0af'}
                    size={16}
                  />
                );
              }}
              dropdownIconPosition={'right'}
              dropdownStyle={styles.dropdownStyle}
              rowStyle={styles.dropdownRow}
              rowTextStyle={styles.dropdownRowText}
              defaultButtonText={'Seleccione un método de pago'}
              defaultValueByIndex={paymentMethods.findIndex(
                m => m.Id?.toString() === selectedPaymentMethod || m.id === selectedPaymentMethod,
              )}
            />
          </View>

          {hasSelectedPaymentMethod() && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Banco *</Text>
                <SelectDropdown
                  data={bankOptions}
                  onSelect={(selectedItem: {label: string; value: string}) => {
                    const selectedBanco = bancos.find(b => b.BankCode === selectedItem.value);
                    setSenderBankCode(selectedItem.value);
                    setSenderBankName(selectedItem.label);
                    setPaymentData(prev => ({
                      ...prev,
                      BankCodeSender: selectedItem.value,
                      BankNameSender: selectedItem.label,
                    }));
                  }}
                  buttonTextAfterSelection={(selectedItem: {label: string; value: string}) => {
                    return selectedItem.label || selectedItem.value || '';
                  }}
                  rowTextForSelection={(item: {label: string; value: string}) => {
                    return item.label || item.value || '';
                  }}
                  buttonStyle={styles.dropdown}
                  buttonTextStyle={styles.dropdownText}
                  renderDropdownIcon={isOpened => {
                    return (
                      <FontAwesome
                        name={isOpened ? 'chevron-up' : 'chevron-down'}
                        color={'#9fa0af'}
                        size={16}
                      />
                    );
                  }}
                  dropdownIconPosition={'right'}
                  dropdownStyle={styles.dropdownStyle}
                  rowStyle={styles.dropdownRow}
                  rowTextStyle={styles.dropdownRowText}
                  defaultButtonText={'Seleccione un banco'}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Documento de Identidad *</Text>
                <TextInput
                  style={styles.input}
                  placeholder='Ingrese su número de cédula'
                  placeholderTextColor={'#7d7d7d'}
                  value={paymentData.DniNumberSender || ''}
                  onChangeText={(text: string) => handleChange(text, 'DniNumberSender')}
                  keyboardType='numeric'
                  maxLength={10}
                />
              </View>

              {isPagoMovil() && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Teléfono *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder='Ingrese el teléfono'
                    placeholderTextColor={'#7d7d7d'}
                    value={paymentData.PhoneNumberSender || ''}
                    onChangeText={(text: string) => handleChange(text, 'PhoneNumberSender')}
                    keyboardType='numeric'
                    maxLength={11}
                  />
                </View>
              )}

              {!isPagoMovil() && (
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Número de cuenta *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder='Ingrese el número de cuenta'
                    placeholderTextColor={'#7d7d7d'}
                    value={paymentData.AccountNumberSender || ''}
                    onChangeText={(text: string) => handleChange(text, 'AccountNumberSender')}
                    keyboardType='numeric'
                    maxLength={20}
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Monto *</Text>
                <View style={styles.amountContainer}>
                  <Text style={styles.currencySymbol}>Bs.</Text>
                  <TextInput
                    style={styles.inputAmount}
                    keyboardType='numeric'
                    placeholder='0.00'
                    placeholderTextColor={'#7d7d7d'}
                    value={(paymentData.AmountBs || 0).toString()}
                    onChangeText={text => handleChange(text, 'AmountBs')}
                    editable={false}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Número de Referencia *</Text>
                <TextInput
                  style={styles.input}
                  placeholder='Ingrese el número de referencia'
                  placeholderTextColor={'#7d7d7d'}
                  value={paymentData.ReferenceCode || ''}
                  onChangeText={(text: string) => handleChange(text, 'ReferenceCode')}
                  maxLength={50}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Fecha del Pago *</Text>
                <MaskInput
                  value={formDate}
                  style={styles.input}
                  placeholder='DD/MM/AAAA'
                  keyboardType='numeric'
                  onChangeText={(masked, unmasked) => {
                    setFormDate(masked);
                    handleChange(masked, 'TransactionDate');
                  }}
                  mask={Masks.DATE_DDMMYYYY}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Descripción (Opcional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder='Descripción adicional del pago'
                  placeholderTextColor={'#7d7d7d'}
                  value={formDescription}
                  onChangeText={setFormDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical='top'
                  maxLength={200}
                />
              </View>
            </>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title='Registrar Pago'
              onPress={handleSubmitPayment}
              buttonStyle={styles.submitButton}
              titleStyle={styles.buttonTitle}
              loading={loading}
              iconRight
              icon={
                <Icon
                  name='check-circle'
                  type='material'
                  color='white'
                  size={20}
                  style={{marginLeft: 10}}
                />
              }
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fc',
  },
  scrollContent: {
    padding: 20,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 22,
    color: '#06060a',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: '#15193f',
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  input: {
    height: 45,
    width: '100%',
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7d7d7d',
    paddingHorizontal: 15,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
  },
  textArea: {
    height: 100,
    paddingTop: 10,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7d7d7d',
    paddingHorizontal: 15,
  },
  currencySymbol: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#0b445e',
    marginRight: 10,
  },
  inputAmount: {
    flex: 1,
    height: 45,
    fontFamily: 'Poppins-Medium',
    color: '#000000',
    fontSize: 16,
  },
  dropdown: {
    width: '100%',
    height: 45,
    backgroundColor: '#f5f6fa',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#7d7d7d',
  },
  dropdownText: {
    color: '#7d7d7d',
    textAlign: 'left',
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
  },
  dropdownStyle: {
    backgroundColor: '#EFEFEF',
    borderRadius: 10,
  },
  dropdownRow: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#C5C5C5',
  },
  dropdownRowText: {
    color: '#444',
    textAlign: 'left',
    fontFamily: 'Poppins-Medium',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  submitButton: {
    backgroundColor: '#0b445e',
    borderRadius: 30,
    height: 50,
  },
  buttonTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
});

export default PaymentFormScreen;
