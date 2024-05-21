import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { axiosInstance } from '@/utils/axios';
import { driversServices } from '@/app/services/drivers';
import { IDriverResponse } from '@/app/interfaces/driver';
import { IMeta } from '@/utils/base.interface';

// Define the initial state
interface DriverState {
  drivers: IDriverResponse[];
  loading: boolean;
  error: string | null;
  meta: IMeta;
}

const initialState: DriverState = {
  drivers: [],
  meta: {} as IMeta,
  loading: false,
  error: null,
};

// Define the async thunk
export const fetchDrivers = createAsyncThunk('driver/fetchDrivers', async (params: any) => {
  const response = await driversServices.findWithBalanceAndRating(params);
  return response.data;
});

export const fetchDriversWithoutBalance = createAsyncThunk(
  'driver/fetchDriversWithoutBalance',
  async (params: any) => {
    const response = await driversServices.get(params);
    return response.data;
  }
);

export const updateDriver = createAsyncThunk('driver/updateDriver', async ({id, body}: {id: number, body: any}) => { 
  try {
    const response = await driversServices.put(id, body);
    return response.data;
    
  } catch (error) {
    return error.response.data;
  }
});

// Create the slice
const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    clearDrivers: (state) => {
      state.drivers = [];
      state.meta = {} as IMeta;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDrivers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDrivers.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchDrivers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Ha ocurrido un error';
      })
      .addCase(fetchDriversWithoutBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDriversWithoutBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchDriversWithoutBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Ha ocurrido un error';
      })
      .addCase(updateDriver.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDriver.fulfilled, (state, action) => {
        state.loading = false;
        state.drivers = state.drivers.map((item) =>
          item.id === action.payload.data.id
            ? {
                ...item,
                attributes: {
                  ...item.attributes,
                  ...action.payload.data.attributes,
                },
              }
            : item
        );
        state.error = null;
      });
  },
});

// Export the async thunk and the slice reducer
export const { reducer: driverReducer } = driverSlice;
export const { clearDrivers } = driverSlice.actions;

// Selectors
export const selectDrivers = (state: RootState) => state.driver.drivers;
export const selectLoading = (state: RootState) => state.driver.loading;
export const selectError = (state: RootState) => state.driver.error;