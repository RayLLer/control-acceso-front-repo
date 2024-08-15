import { ColumnsType } from "@/app/interfaces/strapi";
import { ITestResponse } from "@/app/interfaces/test";

export const test_columns: ColumnsType<ITestResponse>[] = [
  {
    title: "Nombre",
    dataIndex: ["attributes", "name"],
    sorter: true,
    filtrable: true,
    filterType: "string",
  },
  {
    title: "Cuerpo",
    dataIndex: ["attributes", "category", "data", "attributes", "name"],
    sorter: true,
    filtrable: true,
    filterType: "string",
  },
  {
    title: "Tema",
    dataIndex: ["attributes", "theme", "data", "attributes", "name"],
    sorter: true,
    filtrable: true,
    filterType: "string",
  },
  {
    title: "SubTema",
    dataIndex: ["attributes", "sub_theme", "data", "attributes", "name"],
    sorter: true,
    filtrable: true,
    filterType: "string",
  },
  {
    title: "Tipo de Test",
    dataIndex: ["attributes", "testType"],
    sorter: true,
    filtrable: true,
    filterType: "string",
  },
  {
    title: "Cantidad de preguntas",
    dataIndex: ["attributes", "test_questions", "data"],
    render: (data) => data.length,
  },
  {
    title: "Fecha de creado",
    dataIndex: ["attributes", "createdAt"],
    sorter: true,
    filtrable: true,
    filterType: "date",
    render: (data) => (data ? new Date(data).toLocaleDateString() : ""),
  },
];
