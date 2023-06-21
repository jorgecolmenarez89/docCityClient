import React, {useContext, useEffect, useReducer, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Popover, Button as Butt, Divider, TextArea} from 'native-base';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Text, Icon, useTheme} from '@rneui/themed';
import {NAME_ICON} from '../../config/Constant';
import {AuthContext} from '../../context/AuthContext';

interface MapFilterValues {
  specialtyId?: number;
  description?: string;
  regionId?: string;
}

interface MapSelectorFilter {
  description: boolean;
  specialty: boolean;
  region: boolean;
}

enum MapFilterAction {
  specialities = 'specialities',
  description = 'description',
  region = 'region',
  all = 'all',
}

enum MapSelectorFilterAction {
  description = 'description',
  specialty = 'specialty',
  region = 'region',
}

type MapFilterComponetProps = {
  values: MapFilterValues;
  onChangeValues: (values: MapFilterValues) => void;
  onlyOneFilter?: boolean;
};

enum EnumSelectFilter {
  description = 'description',
  specialty = 'specialty',
  region = 'region',
}

const reducerSelectorFilter = (
  state: MapFilterValues,
  action: {type: MapSelectorFilterAction; value: boolean; onlyOneFilter?: boolean},
) => {
  try {
    let otherState = {};
    if (!action.onlyOneFilter) {
      otherState = state;
    }
    switch (action.type) {
      case MapSelectorFilterAction.description:
        return {...otherState, description: action.value};
      case MapSelectorFilterAction.specialty:
        return {...otherState, specialty: action.value};
      case MapSelectorFilterAction.region:
        return {...otherState, region: action.value};
      default:
        return state;
    }
  } catch (err) {
    return false;
  }
};

const reducerValues = (state: MapSelectorFilter, action: {type: MapFilterAction; value: any}) => {
  try {
    switch (action.type) {
      case MapFilterAction.specialities:
        return {...state, specialtyId: action.value};
      case MapFilterAction.region:
        return {...state, regionId: action.value};
      case MapFilterAction.description:
        return {...state, description: action.value};
      case MapFilterAction.all:
        return action.value;
      default:
        return state;
    }
  } catch (err) {
    return false;
  }
};

const MapFilterComponet = ({values, onChangeValues, onlyOneFilter}: MapFilterComponetProps) => {
  const initialFocusRef = React.useRef(null);
  const {theme} = useTheme();
  const {getEspecialitiesAll, specialities, getRegionsAll, regions} = useContext(AuthContext);

  const [valuesFilter, dispatch] = useReducer(reducerValues, values);
  const [valuesSelectorFilter, dispatchSelector] = useReducer(reducerSelectorFilter, {
    description: true,
    specialty: false,
    region: false,
  });

  useEffect(() => {
    getEspecialitiesAll();
    getRegionsAll();
  }, []);

  return (
    <View style={styles.overlaySearch}>
      <View style={styles.containerFilter}>
        {valuesSelectorFilter.description && (
          <View style={{marginBottom: 10}}>
            <TextArea
              h={20}
              placeholder='Escriba su dolencia'
              style={{backgroundColor: 'white'}}
              autoCompleteType={''}
              w='100%'
              onChangeText={val => {
                dispatch({type: MapFilterAction.description, value: val});
                onChangeValues({...valuesFilter, description: val});
              }}
            />
          </View>
        )}

        {valuesSelectorFilter.specialty && (
          <SelectDropdown
            data={specialities}
            onSelect={(selectedItem, index) => {
              console.log('onSelect() ==>', {selectedItem, index});
              dispatch({type: MapFilterAction.specialities, value: selectedItem.id});
              onChangeValues({...valuesFilter, specialtyId: selectedItem.id});
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.name;
            }}
            rowTextForSelection={(item, index) => {
              return item.name;
            }}
            buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
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
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
            defaultButtonText={'Especialidad Médica'}
          />
        )}

        {valuesSelectorFilter.region && (
          <SelectDropdown
            data={regions}
            onSelect={(selectedItem, index) => {
              console.log('onSelect() ==>', {selectedItem, index});
              dispatch({type: MapFilterAction.region, value: selectedItem.id});
              onChangeValues({...valuesFilter, regionId: selectedItem.id});
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem.name;
            }}
            rowTextForSelection={(item, index) => {
              return item.name;
            }}
            buttonStyle={styles.dropdown1BtnStyle}
            buttonTextStyle={styles.dropdown1BtnTxtStyle}
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
            dropdownStyle={styles.dropdown1DropdownStyle}
            rowStyle={styles.dropdown1RowStyle}
            rowTextStyle={styles.dropdown1RowTxtStyle}
            defaultButtonText={'Región'}
          />
        )}
      </View>

      <View>
        <Popover
          initialFocusRef={initialFocusRef}
          trigger={triggerProps => {
            return (
              <Butt
                {...triggerProps}
                style={{borderRadius: 999, backgroundColor: theme.colors.primary}}>
                <Icon name={NAME_ICON.dotsVertical} type={'material-community'} color='white' />
              </Butt>
            );
          }}>
          <Popover.Content w='56'>
            <Popover.Arrow />
            <Popover.Header>
              <Text>Tipo de busqueda</Text>
            </Popover.Header>
            <Popover.Body>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => {
                  dispatchSelector({
                    type: MapSelectorFilterAction.description,
                    value: !valuesSelectorFilter.description,
                    onlyOneFilter,
                  });
                  dispatch({type: MapFilterAction.all, value: {description: ''}});
                  onChangeValues({description: ''});
                }}>
                <Text style={{marginVertical: 4}}>Descripción</Text>
                {valuesSelectorFilter.description && (
                  <Icon name={NAME_ICON.checkmark} type={'ionicon'} color={theme.colors.success} />
                )}
              </TouchableOpacity>

              <Divider my='2' />

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => {
                  dispatchSelector({
                    type: MapSelectorFilterAction.specialty,
                    value: !valuesSelectorFilter.specialty,
                    onlyOneFilter,
                  });
                  dispatch({type: MapFilterAction.all, value: {description: ''}});
                  onChangeValues({description: ''});
                }}>
                <Text style={{marginVertical: 4}}>Especialidad</Text>
                {valuesSelectorFilter.specialty && (
                  <Icon name={NAME_ICON.checkmark} type={'ionicon'} color={theme.colors.success} />
                )}
              </TouchableOpacity>

              <Divider my='2' />

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => {
                  dispatchSelector({
                    type: MapSelectorFilterAction.region,
                    value: !valuesSelectorFilter.region,
                    onlyOneFilter,
                  });
                  dispatch({type: MapFilterAction.all, value: {description: ''}});
                  onChangeValues({description: ''});
                }}>
                <Text style={{marginVertical: 4}}>Región</Text>
                {valuesSelectorFilter.region && (
                  <Icon name={NAME_ICON.checkmark} type={'ionicon'} color={theme.colors.success} />
                )}
              </TouchableOpacity>
            </Popover.Body>
          </Popover.Content>
        </Popover>
      </View>
    </View>
  );
};

export default MapFilterComponet;

const styles = StyleSheet.create({
  overlaySearch: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    gap: 5,
    position: 'relative',
  },
  dropdown1BtnStyle: {
    width: '100%',
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginBottom: 10,
  },
  dropdown1BtnTxtStyle: {color: '#83859a', textAlign: 'left'},
  dropdown1DropdownStyle: {backgroundColor: '#EFEFEF'},
  dropdown1RowStyle: {backgroundColor: '#EFEFEF', borderBottomColor: '#C5C5C5'},
  dropdown1RowTxtStyle: {color: '#444', textAlign: 'left'},
  dropdownsearchInputStyleStyle: {
    backgroundColor: '#66bfc5',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
  },
  containerFilter: {
    flex: 1,
  },
});
