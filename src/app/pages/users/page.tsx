"use client";
import { FC, ReactElement } from "react";

import MagicTable from "@/app/components/table-v2/table-custom";
import { ColumnsType } from "@/app/interfaces/strapi";
import { useRouter } from "next/navigation";
import { IUser } from "./users.interface";
import { userService } from "./users.service";
import axios from "axios";

const User: FC = (): ReactElement => {
  const router = useRouter();

  const handleDelete = async (id: number) => {
    try {
      const response = await userService.deleteUser(id);
      console.log(response);
      if (response.data === "OK") {
        return true;
      } else {
        return "No se puede eliminar el usuario";
      }
    } catch (error) {
      return axios.isAxiosError(error)
        ? error.response?.data.message
        : "Ha ocurrido un error";
    }
  };

  const columns: ColumnsType<IUser>[] = [
    {
      title: "Usuario",
      dataIndex: ["username"],
      key: "username",
      filtrable: true,
      filterType: "string",
    },
    {
      title: "Correo",
      dataIndex: ["email"],
      key: "email",
      filtrable: true,
      filterType: "string",
    },
    {
      title: "Nombre Completo",
      dataIndex: ["name"],
      key: "name",
      filtrable: true,
      filterType: "string",
    },
    {
      title: "Rol",
      dataIndex: ["role", "name"],
      key: "role.name",
      filtrable: true,
      filterType: "string",
    },
    {
      title: "Bloqueado",
      dataIndex: ["blocked"],
      key: "blocked",
      render: (blocked: boolean) => (blocked ? "Bloqueado" : "No Bloqueado"),
    },
  ];

  return (
    <MagicTable<IUser, IUser>
      columns={columns}
      url={"users"}
      onAdd={() => router.push("users/form")}
      onEdit={(id) => router.push(`users/form/${id}`)}
      deleteEntry
      onDelete={handleDelete}
      crud
    />
  );
};

export default User;
