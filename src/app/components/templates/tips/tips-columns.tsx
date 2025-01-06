import { ITipResponse } from "@/app/interfaces/tip";
import { ColumnsType } from '@/app/interfaces/strapi';

export const tip_columns: ColumnsType<ITipResponse>[] = [
  {
    title: 'Texto',
    dataIndex: ['attributes', 'tipText'],
    sorter: true,
    filtrable: true,
    filterType: 'string',
  }
]