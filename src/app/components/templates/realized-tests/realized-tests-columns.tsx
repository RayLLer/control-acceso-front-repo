import { IRealizedTestAttemptsResponse } from "@/app/interfaces/realized-tests";
import { ColumnsType } from "@/app/interfaces/strapi";
import { Typography } from "antd";
import moment from "moment";

export const realized_tests_columns: ColumnsType<IRealizedTestAttemptsResponse>[] =
  [
    {
      title: "Usuario",
      dataIndex: ["users_permissions_user", "username"],
      filtrable: true,
      filterType: "string",
    },
    {
      title: "Tema",
      dataIndex: ["themes"],
      filtrable: true,
      filterType: "string",
    },
    // {
    //   title: 'Test',
    //   dataIndex: ['lastTest', 'test', 'name'],
    //   filtrable: true,
    //   filterType: 'string',
    // },
    {
      title: "Cantidad de intentos",
      dataIndex: ["attempts"],
      filtrable: false,
      filterType: "number",
      render: (value) => `${value ?? 0}`,
    },
    // {
    //   title: 'Calificación',
    //   dataIndex: ['lastTest', 'evaluationPercent'],
    //   // render: (value) => (value ? `${value}` : 'No calificado'),
    // },
    {
      title: "Último resultado",
      dataIndex: ["evaluationPercent"],
      filtrable: true,
      filterType: "number",
      render: (value) => (
		<Typography.Text
		  type={value <= 50 ? 'danger' : 'success'}>
		  {value}%
		</Typography.Text>
	  ),
    },
    {
      title: "fecha del último intento",
      dataIndex: ["finishDate"],
      filtrable: true,
      filterType: "date",
      render: (value) =>
        value ? moment(value).format("DD/MM/YYYY HH:mm:ss") : "",
    },
  ];
