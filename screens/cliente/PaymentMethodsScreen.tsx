import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert} from 'react-native';
import {Button, Icon, Card, Avatar} from '@rneui/themed';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthContext} from '../../context/AuthContext';
import {RootStackParamList} from '../../config/Types';
import {getPayments} from '../../services/doctor/payments';
import {TypePayment} from '../../config/Enum';

type PaymentMethodsScreenProps = NativeStackScreenProps<RootStackParamList, 'PaymentMethods'>;

interface PaymentMethod {
  AccountNumber?: string;
  AccountType?: string;
  BankCode?: string;
  BankName?: string;
  DniNumber?: string;
  PaymentType: string;
  PhoneNumber?: string;
  Titular?: string;
  User?: any;
  UserId?: string;
  Id?: number;
}

function PaymentMethodsScreen({navigation, route}: PaymentMethodsScreenProps) {
  const {userLoged, showToast} = useContext(AuthContext);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [doctor, setDoctor] = useState<any>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

  useEffect(() => {
    // Obtener datos pasados por parámetros
    if (route.params) {
      const params = route.params as any;
      if (params.doctor) {
        setDoctor(params.doctor);
        findPaymentMethodsByDoctor(params.doctor?.id || '');
      }
      if (params.requestId) {
        setRequestId(params.requestId);
      }
    }
  }, [route.params]);

  const findPaymentMethodsByDoctor = async (doctorId: string) => {
    try {
      const response = (await getPayments(doctorId)) as any;
      if (response.data.data) {
        setPaymentMethods(response.data.data);
      } else {
        setPaymentMethods([]);
      }
    } catch (error) {
      console.log('error en getPayments', error);
    }
  };

  const handleGeneratePayment = () => {
    if (!doctor || !requestId) {
      Alert.alert('Error', 'Faltan datos necesarios para generar el pago');
      return;
    }

    if (!selectedPaymentMethod) {
      Alert.alert('Atención', 'Debe seleccionar un método de pago antes de continuar');
      return;
    }

    navigation.navigate('PaymentForm', {
      doctor,
      requestId,
      paymentMethods,
      selectedPaymentMethod,
    } as any);
  };

  const buildIcon = (typePayment: TypePayment) => {
    switch (typePayment) {
      case TypePayment.transferencia:
        return 'account-balance';
      case TypePayment.pagoMovil:
        return 'phone-android';
      case TypePayment.deposito:
        return 'attach-money';
      case TypePayment.divisa:
        return 'monetization-on';
      default:
        return 'account-balance';
    }
  };
  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    // Si el método ya está seleccionado, deseleccionarlo
    if (selectedPaymentMethod?.Id === method.Id) {
      setSelectedPaymentMethod(null);
    } else {
      setSelectedPaymentMethod(method);
    }
  };

  const isNotPagoMovil = (paymentMethod: PaymentMethod) => {
    return paymentMethod.PaymentType !== TypePayment.pagoMovil;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {doctor && (
          <Card containerStyle={styles.doctorCard}>
            <View style={styles.doctorInfo}>
              <Avatar
                size={60}
                rounded
                source={doctor.url ? {uri: doctor.url} : require('../../assets/icon-user.png')}
              />
              <View style={styles.doctorDetails}>
                <Text style={styles.doctorName}>{doctor.fullName}</Text>
                {doctor.colegioMedicoId && (
                  <Text style={styles.doctorId}>CM: {doctor.colegioMedicoId}</Text>
                )}
              </View>
            </View>
          </Card>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Métodos de Pago Disponibles</Text>
          {paymentMethods.length === 0 ? (
            <Text style={styles.noMethods}>No hay métodos de pago disponibles</Text>
          ) : (
            paymentMethods.map((method, index) => {
              const isSelected = selectedPaymentMethod?.Id === method.Id;
              return (
                <TouchableOpacity
                  key={method.Id}
                  onPress={() => handleSelectPaymentMethod(method)}
                  activeOpacity={0.7}>
                  <Card
                    containerStyle={[styles.methodCard, isSelected && styles.methodCardSelected]}>
                    <View style={styles.methodHeader}>
                      <Icon
                        name={buildIcon(method.PaymentType as TypePayment)}
                        type='material'
                        color={isSelected ? '#0b445e' : '#7d7d7d'}
                        size={30}
                      />
                      <Text style={[styles.methodType, isSelected && styles.methodTypeSelected]}>
                        {method.PaymentType}
                      </Text>
                      {isSelected && (
                        <Icon
                          name='check-circle'
                          type='material'
                          color='#0b445e'
                          size={24}
                          style={{marginLeft: 'auto'}}
                        />
                      )}
                    </View>
                    {method.BankName && (
                      <View style={styles.methodDetail}>
                        <Text style={styles.methodValue}>{method.BankName}</Text>
                      </View>
                    )}
                    {isNotPagoMovil(method) && method.AccountNumber && (
                      <View style={styles.methodDetail}>
                        <Text style={styles.methodLabel}>Número de cuenta:</Text>
                        <Text style={styles.methodValue}>{method.AccountNumber}</Text>
                      </View>
                    )}
                    {method.DniNumber && (
                      <View style={styles.methodDetail}>
                        <Text style={styles.methodLabel}>Documento:</Text>
                        <Text style={styles.methodValue}>{method.DniNumber}</Text>
                      </View>
                    )}
                    {isNotPagoMovil(method) && method.AccountType && (
                      <View style={styles.methodDetail}>
                        <Text style={styles.methodLabel}>Titular:</Text>
                        <Text style={styles.methodValue}>{method.AccountType}</Text>
                      </View>
                    )}
                    {method.PaymentType === TypePayment.pagoMovil && method.PhoneNumber && (
                      <View style={styles.methodDetail}>
                        <Text style={styles.methodLabel}>Teléfono:</Text>
                        <Text style={styles.methodValue}>{method.PhoneNumber}</Text>
                      </View>
                    )}
                  </Card>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title='Reportar pago'
            onPress={handleGeneratePayment}
            buttonStyle={[
              styles.generateButton,
              !selectedPaymentMethod && styles.generateButtonDisabled,
            ]}
            titleStyle={styles.buttonTitle}
            disabled={!selectedPaymentMethod}
            disabledStyle={styles.generateButtonDisabled}
            iconRight
            icon={
              <Icon
                name='payment'
                type='material'
                color={selectedPaymentMethod ? 'white' : '#999'}
                size={20}
                style={{marginLeft: 10}}
              />
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fc',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
    flexGrow: 1,
  },
  doctorCard: {
    borderRadius: 15,
    marginBottom: 20,
    padding: 15,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorDetails: {
    marginLeft: 15,
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#06060a',
    marginBottom: 5,
  },
  doctorId: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#7d7d7d',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#06060a',
    marginBottom: 15,
  },
  noMethods: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#7d7d7d',
    textAlign: 'center',
    padding: 20,
  },
  methodCard: {
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  methodCardSelected: {
    borderColor: '#0b445e',
    backgroundColor: '#f0f8ff',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  methodType: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#06060a',
    marginLeft: 10,
    flex: 1,
  },
  methodTypeSelected: {
    color: '#0b445e',
  },
  methodDetail: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  methodLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#7d7d7d',
    marginRight: 5,
  },
  methodValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#06060a',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  generateButton: {
    backgroundColor: '#0b445e',
    borderRadius: 30,
    height: 50,
    paddingHorizontal: 20,
  },
  generateButtonDisabled: {
    backgroundColor: '#cccccc',
    opacity: 0.6,
  },
  buttonTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
});

export default PaymentMethodsScreen;
