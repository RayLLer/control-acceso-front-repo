import { getLoggedUser } from "@/app/pages/users/users.reducer";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import React, { useCallback, useEffect } from "react";
import { PermissionsEnum } from "../permissions";

const useValidatePermissions = () => {
  const dispatch = useAppDispatch();
  const { loggedUser } = useAppSelector((state) => state.users);

  useEffect(() => {
    !loggedUser.id && dispatch(getLoggedUser(undefined));
  }, []);

  const validate = useCallback(
    (permission: PermissionsEnum) => {
      const role = loggedUser.role.name;
      const index = loggedUser.role.permissions.findIndex(
        (permissionItem: any) => permissionItem.name === permission
      );
      return index !== -1 || role === "Administrador";
    },
    [loggedUser]
  );

  return { validate };
};

export default useValidatePermissions;
