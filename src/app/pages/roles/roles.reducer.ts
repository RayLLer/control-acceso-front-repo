import { RootState } from '@/app/store/store';
import { sources } from '@/utils/sources';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import { IPermissions, IRole, IRoutesInfo } from './roles.interface';
import { RolesServices } from './roles.service';

const AUTHENTICATED = 'authenticated';
const PUBLIC = 'public';

const rolesAdapter = createEntityAdapter<IRole>({
  selectId: (rol) => rol.id,
});
const rolesServices = new RolesServices();

function groupBy(xs, f) {
  return xs.reduce(
    (r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r),
    {}
  );
}

export const fetchRoles = createAsyncThunk(
  'role/fetchRoles',
  async (params: any | undefined, { rejectWithValue }) => {
    try {
      let response = await rolesServices.getRoles(sources.ROLES, params);
      return response.data.roles;
    } catch (error: any) {
      rejectWithValue(error.data.message);
    }
  }
);

export const fetchPermissions = createAsyncThunk(
  'role/fetchPermissions',
  async (params: any | undefined, { rejectWithValue }) => {
    try {
      let response = await rolesServices.getPermissions(sources.PERMISSIONS);
      return response.data;
    } catch (error: any) {
      rejectWithValue(error.data.message);
    }
  }
);

export const postRoles = createAsyncThunk(
  'user/postRoles',
  async (payload: IRole, { rejectWithValue }) => {
    try {
      let response = await rolesServices.post(payload);
      return response.data;
    } catch (error: any) {
      rejectWithValue(error.data.message);
    }
  }
);

export const patchRoles = createAsyncThunk(
  'user/patchroles',
  async (payload: IRole, { rejectWithValue }) => {
    try {
      let response = await rolesServices.put(
        payload.id,
        payload
      );
      return {...response.data, id: payload.id};
    } catch (error: any) {
      rejectWithValue(error.data.message);
    }
  }
);

export const deleteRole = createAsyncThunk(
  'role/deleteRole',
  async (id: number, { rejectWithValue }) => {
    try {
      let response = await rolesServices.delete(id);
      return id;
    } catch (error: any) {
      rejectWithValue(error.data.message);
    }
  }
);

const rolesSlice = createSlice({
  name: 'roles',
  initialState: rolesAdapter.getInitialState({
    error: '',
    loading: false,
    permissions: [] as IPermissions[],
  }),
  reducers: {},
  extraReducers: (builder) => {
    /** GET */
    builder.addCase(fetchRoles.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchRoles.fulfilled, (state, action) => {
      const filteredRoles = action.payload.filter(
        (rol) => rol.type !== AUTHENTICATED && rol.type !== PUBLIC
      );
      rolesAdapter.setAll(state, filteredRoles);
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(fetchRoles.rejected, (state, action) => {
      state.error = action.error.message || '';
      state.loading = false;
    });

    builder.addCase(fetchPermissions.pending, (state, action) => {
      // state.loading = true;
    });
    builder.addCase(fetchPermissions.fulfilled, (state, action) => {
      state.permissions = [...action.payload.data];
      // state.loading = false;
      state.error = undefined;
    });
    builder.addCase(fetchPermissions.rejected, (state, action) => {
      state.error = action.error.message || '';
      // state.loading = false;
    });

    /** POST */
    builder.addCase(postRoles.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(postRoles.fulfilled, (state, action) => {
      rolesAdapter.addOne(state, action.payload!.data);
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(postRoles.rejected, (state, action) => {
      state.error = action.error.message || 'Error';
      state.loading = false;
    });

    /** PATCH */
    builder.addCase(patchRoles.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(patchRoles.fulfilled, (state, action) => {
      rolesAdapter.updateOne(state, {
        id: action.payload!.id,
        changes: { ...action.payload },
      });
      state.loading = false;
      state.error = undefined;
    });
    builder.addCase(patchRoles.rejected, (state, action) => {
      state.error = action.error.message || '';
      state.loading = false;
    });

    /** DELETE */
    builder.addCase(deleteRole.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(deleteRole.fulfilled, (state, action) => {
      rolesAdapter.removeOne(state, action.payload);
      state.loading = false;
      state.error = undefined;
    });

    builder.addCase(deleteRole.rejected, (state, action) => {
      state.error = action.error.message || '';
      state.loading = false;
    });
  },
});

const { reducer, actions } = rolesSlice;

export const selectLoading = (state: RootState) => state.roles.loading;
export const selectError = (state: RootState) => state.roles.error;
export const selectPermissions = (state: RootState) => state.roles.permissions;

export const { selectAll: SelectAllRoles, selectById: selectRoleByID } =
  rolesAdapter.getSelectors((state: RootState) => state.roles);

export default reducer;
