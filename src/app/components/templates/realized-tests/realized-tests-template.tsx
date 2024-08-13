"use client";
import { IRealizedTestAttemptsResponse } from "@/app/interfaces/realized-tests";
import { paths } from "@/app/routes/paths";
import { EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import MagicTable from "../../table-v2/table-custom";
import { realized_tests_columns } from "./realized-tests-columns";

const RealizedTestsTemplate = () => {
  const router = useRouter();
  return (
    <MagicTable<IRealizedTestAttemptsResponse, IRealizedTestAttemptsResponse>
      url="realized-tests/last-grouped-by-user"
      columns={realized_tests_columns}
      onAdd={function (): void {
        throw new Error("Function not implemented.");
      }}
      onEdit={function (id: number): void {
        throw new Error("Function not implemented.");
      }}
      moreActions={[
        {
          icon: <EyeOutlined />,
          onClick: (record) => {
            router.push(
              paths.realized_tests.details(
                record!.users_permissions_user.id,
                record!.test.id
              )
            );
          },
          tooltip: "Ver detalles",
        },
      ]}
    />
  );
};

export default RealizedTestsTemplate;

// "https://testopo.countigodev.store:6060/api/realized-tests/last-grouped-by-user?pagination[page]=1&pagination[pageSize]=10&filters[users_permissions_user][name][%24containsi]=Daniel";

// "https://testopo.countigodev.store:6060/api/realized-tests/last-grouped-by-user?populate=*&sort[0][createdAt]=desc&pagination[page]=1&pagination[pageSize]=10&filters[user][username][$startsWithi]=Daniel"
