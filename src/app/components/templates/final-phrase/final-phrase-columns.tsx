import { IFinalPhraseResponse } from "@/app/interfaces/final-phrase";
import { ColumnsType } from '@/app/interfaces/strapi';

export const final_phrase_columns: ColumnsType<IFinalPhraseResponse>[] = [
  {
    title: 'Description',
    dataIndex: ['attributes', 'description'],
    sorter: true,
    filtrable: false,
    filterType: 'string',
  },
  {
    title: 'Porciento inicial',
    dataIndex: ['attributes', 'percentInitRange'],
    sorter: true,
    filtrable: false,
    filterType: 'number',
  },
  {
    title: 'Porciento final',
    dataIndex: ['attributes', 'percentFinishRange'],
    sorter: true,
    filtrable: false,
    filterType: 'number',
  }
]