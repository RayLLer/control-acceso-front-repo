export const selectFilters = [
  {
    label: 'Igual (Mayúsculas)',
    value: '$eq',
  },
  {
    label: 'Igual',
    value: '$eqi',
  },
  // {
  //   label: 'Distinto',
  //   value: '$nei',
  // },
  {
    label: 'Menor que',
    value: '$lt',
  },
  {
    label: 'Menor o igual',
    value: '$lte',
  },
  {
    label: 'Mayor que',
    value: '$gt',
  },
  {
    label: 'Mayor igual que',
    value: '$gte',
  },
  {
    label: 'Contiene (Mayúsculas)',
    value: '$contains',
  },
  {
    label: 'No contiene (Mayúsculas)',
    value: '$notContains',
  },
  {
    label: 'Contiene',
    value: '$containsi',
  },
  {
    label: 'No contiene',
    value: '$notContainsi',
  },
  {
    label: 'Es nulo',
    value: '$null',
  },
  {
    label: 'No es nulo',
    value: '$notNull',
  },
  {
    label: 'Comienza con (Mayúsculas)',
    value: '$startsWith',
  },
  {
    label: 'Comienza con',
    value: '$startsWithi',
  },
  {
    label: 'Termina en (Mayúsculas)',
    value: '$endsWith',
  },
  {
    label: 'Termina en',
    value: '$endsWithi',
  },
];

export const filtersSelectString = [
  {
    label: 'Igual',
    value: '$eq',
  },
  {
    label: 'Contiene',
    value: '$containsi',
  },
  {
    label: 'No contiene',
    value: '$notContainsi',
  },

  {
    label: 'Es nulo',
    value: '$null',
  },
  {
    label: 'No es nulo',
    value: '$notNull',
  },
  {
    label: 'Comienza con',
    value: '$startsWithi',
  },
  {
    label: 'Termina en',
    value: '$endsWithi',
  },
];

export const filtersSelectNumberOrDate = [
  {
    label: 'Igual',
    value: '$eq',
  },
  // {
  //   label: 'Distinto',
  //   value: '$nei',
  // },
  {
    label: 'Menor que',
    value: '$lt',
  },
  {
    label: 'Menor o igual',
    value: '$lte',
  },
  {
    label: 'Mayor que',
    value: '$gt',
  },
  {
    label: 'Mayor igual que',
    value: '$gte',
  },
  {
    label: 'Es nulo',
    value: '$null',
  },
  {
    label: 'No es nulo',
    value: '$notNull',
  },
];

export const filtersSelectBoolean = [
  {
    label: 'Igual',
    value: '$eq',
  },
];
