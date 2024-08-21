import { RootState } from "@/app/store/store";
import { sources } from "@/utils/sources";
import secureStorage from "react-secure-storage";

import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { IUser } from "./users.interface";
import { UsersService } from "./users.service";
import { RolesServices } from "../roles/roles.service";
import showNotification from "@/utils/message";
import { paths } from "@/app/routes/paths";
import { PermissionsEnum } from "@/utils/permissions";

const usersAdapter = createEntityAdapter<IUser>({
  sortComparer: (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
});
const usersService = new UsersService();
const rolesServices = new RolesServices();

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (params: any | undefined, { rejectWithValue }) => {
    try {
      let response = await usersService.getUsers(sources.USERS, params);
      return response.data;
    } catch (error: any) {
      throw error.response.data.error;
    }
  }
);

export const getLoggedUser = createAsyncThunk(
  "user/LoggedUserInfo",
  async (params: any | undefined, { rejectWithValue }) => {
    try {
      const response = await usersService.getLoggedUser(sources.USERS + "/me");
      let permissionsResponse = await rolesServices.getPermissionsByRoleID(
        sources.ROLE_PERMISSION + "/getCustomPermissionsByRoleId",
        response.data.role.id
      );
      if (response.data.role.name === "Alumno") {
        secureStorage.clear();
        window.location.href = "/login"; // Redirige a la página de login
        throw new Error("No tiene permisos para acceder");
      }

      if (params) {
        switch (permissionsResponse.data[0].custom_permissions[0].name) {
          case PermissionsEnum.GestionarTest:
            window.location.href = paths.tests.root;
            break;
          case PermissionsEnum.GestionarCategorias:
            window.location.href = paths.theme_subtheme_block.root;
            break;
          case PermissionsEnum.GestionarPreguntas:
            window.location.href = paths.questions.root;
            break;
          case PermissionsEnum.VerTestsRealizados:
            window.location.href = paths.realized_tests.root;
            break;
          case PermissionsEnum.VerReporteDeQuejasYErrores:
            window.location.href = paths.error_reports.root;
            break;
          case PermissionsEnum.GestionarUsuarios:
            window.location.href = "/pages/users";
            break;
          case PermissionsEnum.GestionarRolesPermisos:
            window.location.href = "/pages/roles";
            break;
          default:
            window.location.href = paths.tests.root;
            break;
        }
      }

      response.data.role.permissions =
        permissionsResponse.data[0]?.custom_permissions ?? [];
      return response.data;
    } catch (error: any) {
      throw error.response.data.error;
    }
  }
);

// export const postUsers = createAsyncThunk(
//   "user/postUsers",
//   async (payload: IUser, { rejectWithValue }) => {
//     try {
//       const response = await usersService.postUser(payload);
//       return response.data;
//     } catch (error: any) {
//       throw error.response.data.error;
//     }
//   }
// );

export const postUsers = createAsyncThunk(
  "user/postUsers",
  async (payload: IUser, { rejectWithValue }) => {
    try {
      const response = await usersService.postUser(payload);

      if (!response || !response.data) {
        throw new Error(
          "No se pudo crear el usuario, verifique si ya está en uso el correo o el usuario seleccionado"
        );
      }

      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        throw new Error(
          "No se pudo crear el usuario, verifique si ya está en uso el correo o el usuario seleccionado"
        );
      }

      throw error;
    }
  }
);

export const patchUsers = createAsyncThunk(
  "user/patchUsers",
  async (payload: IUser, { rejectWithValue }) => {
    try {
      let response = await usersService.putUser(payload.id, payload);
      return { ...response.data, id: payload.id };
    } catch (error: any) {
      throw error.response.data.error;
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id: number, { rejectWithValue }) => {
    try {
      let response = await usersService.delete(id);
      return { ...response.data, id };
    } catch (error: any) {
      throw error.response.data.error;
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: usersAdapter.getInitialState({
    error: undefined as string | undefined,
    loading: false,
    loadingLoggedUser: false,
    loggedUser: {} as IUser,
  }),
  reducers: {
    addUser: usersAdapter.addOne,
    removeUser: usersAdapter.removeOne,
  },
  extraReducers: (builder) => {
    /** GET */
    builder.addCase(getUsers.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      usersAdapter.setAll(state, action.payload as IUser[]);
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(getUsers.rejected, (state, action) => {
      state.error = action.error.message || "";
      state.loading = false;
    });

    /** GET */
    builder.addCase(getLoggedUser.pending, (state, action) => {
      state.loadingLoggedUser = true;
    });
    builder.addCase(getLoggedUser.fulfilled, (state, action) => {
      state.loggedUser = action.payload;
      state.loadingLoggedUser = false;
      state.error = undefined;
    });
    builder.addCase(getLoggedUser.rejected, (state, action) => {
      state.error = action.error.message || "";
      state.loadingLoggedUser = false;
      state.loggedUser = {} as IUser;
    });

    /** POST */
    builder.addCase(postUsers.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(postUsers.fulfilled, (state, action) => {
      usersAdapter.addOne(state, action.payload);
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(postUsers.rejected, (state, action) => {
      state.error = action.error.message || "Error";
      let message = state.error;
      if (state.error.includes("must be unique")) {
        message = "El usuario ya está en uso";
      }
      if (state.error.includes("already taken")) {
        message = "El correo ya está en uso";
      }
      showNotification("error", "Error", [message]);
      state.loading = false;
    });

    /** PATCH */
    builder.addCase(patchUsers.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(patchUsers.fulfilled, (state, action) => {
      usersAdapter.updateOne(state, {
        id: action.payload!.id,
        changes: { ...action.payload },
      });
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(patchUsers.rejected, (state, action) => {
      state.error = action.error.message || "";
      showNotification("error", "Error", [state.error]);
      state.loading = false;
    });

    /** DELETE */
    builder.addCase(deleteUser.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      usersAdapter.removeOne(state, action.payload!.id);
      state.loading = false;
      state.error = undefined;
    });

    builder.addCase(deleteUser.rejected, (state, action) => {
      state.error = action.error.message || "";
      showNotification("error", "Error", [state.error]);
      state.loading = false;
    });
  },
});

const { reducer, actions } = usersSlice;

export const selectLoading = (state: RootState) => state.users.loading;
export const selectLoggedUser = (state: RootState) => state.users.loggedUser;
export const selectError = (state: RootState) => state.users.error;

export const { selectAll: SelectAllUsers, selectById: selectUserByID } =
  usersAdapter.getSelectors((state: RootState) => state.users);

export const { removeUser, addUser } = usersSlice.actions;

export default reducer;
