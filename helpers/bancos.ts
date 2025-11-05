const bancos = [
  {
    Id: 1,
    Name: 'BANCO DE VENEZUELA S.A. BANCO UNIVERSAL',
    BankCode: '0102',
    Description: 'Banco de Venezuela',
  },
  {
    Id: 2,
    Name: 'VENEZOLANO DE CREDITO, S.A. BANCO UNIVERSAL',
    BankCode: '0104',
    Description: 'Banco Venezolano de Crédito',
  },
  {
    Id: 3,
    Name: 'MERCANTIL BANCO UNIVERSAL',
    BankCode: '0105',
    Description: 'Banco Mercantil',
  },
  {
    Id: 4,
    Name: 'BANCO PROVINCIAL S.A. BANCO UNIVERSAL',
    BankCode: '0108',
    Description: 'Banco Provincial',
  },
  {
    Id: 5,
    Name: 'BANCO DEL CARIBE S.A.C.A.',
    BankCode: '0114',
    Description: 'Banco del Caribe',
  },
  {
    Id: 6,
    Name: 'BANCO EXTERIOR, C.A.',
    BankCode: '0115',
    Description: 'Banco Exterior',
  },
  {
    Id: 7,
    Name: 'BANCO OCCIDENTAL DE DESCUENTO S.A.C.A.',
    BankCode: '0116',
    Description: 'Banco Occidental de Descuento',
  },
  {
    Id: 8,
    Name: 'BANCO CARONI, C.A. BANCO UNIVERSAL',
    BankCode: '0128',
    Description: 'Banco Caroni',
  },
  {
    Id: 9,
    Name: 'BANESCO BANCO UNIVERSAL',
    BankCode: '0134',
    Description: 'Banesco',
  },
  {
    Id: 10,
    Name: 'BANCO SOFITASA',
    BankCode: '0137',
    Description: 'Banco Sofitasa',
  },
  {
    Id: 11,
    Name: 'BANCO PLAZA',
    BankCode: '0138',
    Description: 'Banco Plaza',
  },
  {
    Id: 12,
    Name: 'FONDO COMUN, C.A. BANCO UNIVERSAL  ',
    BankCode: '0151',
    Description: 'Fondo Común',
  },
  {
    Id: 13,
    Name: '100% BANCO, BANCO UNIVERSAL C.A.',
    BankCode: '0156',
    Description: '100% banco',
  },
  {
    Id: 14,
    Name: 'DEL SUR BANCO UNIVERSAL, C.A.',
    BankCode: '0157',
    Description: 'Del Sur Banco Universal',
  },
  {
    Id: 15,
    Name: 'BANCO DEL TESORO',
    BankCode: '0163',
    Description: 'Banco del Tesoro',
  },
  {
    Id: 16,
    Name: 'BANCO AGRICOLA DE VENEZUELA C.A. ',
    BankCode: '0166',
    Description: 'Banco Agricola de Venezuela',
  },
  {
    Id: 17,
    Name: 'BANCRECER S.A. BANCO MICROFINANCIERO',
    BankCode: '0168',
    Description: 'Bancrecer',
  },
  {
    Id: 18,
    Name: 'MIBANCO BANCO DE DESARROLLO',
    BankCode: '0169',
    Description: 'Mibanco',
  },
  {
    Id: 19,
    Name: 'BANCO ACTIVO, C.A.',
    BankCode: '0171',
    Description: 'Banco Activo',
  },
  {
    Id: 20,
    Name: 'BANCAMIGA BANCO UNIVERSAL',
    BankCode: '0172',
    Description: 'Bancamiga',
  },
  {
    Id: 21,
    Name: 'BANPLUS BANCO UNIVERSAL, C.A. ',
    BankCode: '0174',
    Description: 'Banplus',
  },
  {
    Id: 22,
    Name: 'BANCO BICENTENARIO BANCO UNIVERSAL C.A.',
    BankCode: '0175',
    Description: 'Banco Bicentenario',
  },
  {
    Id: 23,
    Name: 'BANCO DE LA FUERZA ARMADA NACIONAL BOLIVARIANA',
    BankCode: '0177',
    Description: 'Banco de la Fuerza Armada Nacional Bolivariana',
  },
  {
    Id: 24,
    Name: 'BANCO NACIONAL DE CREDITO, C.A.',
    BankCode: '0191',
    Description: 'BNC',
  },
];

const formatSelectBancos = () => {
  return bancos.map(banco => ({
    label: banco.Description,
    value: banco.BankCode,
  }));
};

const includeInDivisas = ['0102', '0134', '0108', '0105'];

const formatSelectBancosDivisas = () => {
  return bancos
    .map(banco => ({
      label: banco.Description,
      value: banco.BankCode,
    }))
    .filter(banco => includeInDivisas.includes(banco.value));
};

export {formatSelectBancos, formatSelectBancosDivisas, bancos};
