import React, {useContext, useEffect, useReducer, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Popover, Button as Butt, Divider} from 'native-base';
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Text, Icon, useTheme} from '@rneui/themed';
import {NAME_ICON} from '../../config/Constant';
import {AuthContext} from '../../context/AuthContext';

interface MapFilterValues {
  specialtyId?: number;
}

enum MapFilterAction {
  specialities = 'specialities',
}

type MapFilterComponetProps = {
  values: MapFilterValues;
  onChangeValues: (values: MapFilterValues) => void;
};

const reducerValues = (
  state: MapFilterValues,
  action: {type: MapFilterAction; value: string | number},
) => {
  try {
  } catch (err) {
    return false;
  }
  switch (action.type) {
    case MapFilterAction.specialities:
      return {...state, specialtyId: action.value};
    default:
      return state;
  }
};

const MapFilterComponet = ({values, onChangeValues}: MapFilterComponetProps) => {
  const initialFocusRef = React.useRef(null);
  const {theme} = useTheme();
  const {getEspecialitiesAll, specialities} = useContext(AuthContext);

  const [valuesFilter, dispatch] = useReducer(reducerValues, values);

  useEffect(() => {
    getEspecialitiesAll();
  }, []);

  return (
    <View style={styles.overlaySearch}>
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
            <Popover.Body>
              <TouchableOpacity>
                <Text>Descripción</Text>
              </TouchableOpacity>

              <Divider
                my='2'
                _light={{
                  bg: 'muted.800',
                }}
              />

              <TouchableOpacity>
                <Text>Espacialidad</Text>
              </TouchableOpacity>

              <Divider
                my='2'
                _light={{
                  bg: 'muted.800',
                }}
              />

              <TouchableOpacity>
                <Text>Región</Text>
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
    //backgroundColor: 'cyan',
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    position: 'relative',
  },
  dropdown1BtnStyle: {
    //width: '100%',
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
});
