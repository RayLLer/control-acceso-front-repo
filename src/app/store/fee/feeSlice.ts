import { IFee, IFeeResponse } from '@/app/interfaces/fee';
import { IInvoiceResponse } from '@/app/interfaces/invoices';
import { feeServices } from '@/app/services/fee';
import { invoiceServices } from '@/app/services/invoices';
import { IMeta } from '@/utils/base.interface';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface InvoiceState {
  fees: IFeeResponse[];
  meta: IMeta;
  error: string | null;
  loading: boolean;
}

const initialState: InvoiceState = {
  fees: [],
  meta: {} as IMeta,
  error: null,
  loading: false,
};

// Define the async thunk
export const fetchFees = createAsyncThunk(
  'invoices/fetchFees',
  async (params: any) => {
    // Your async API call to fetch invoices goes here
    const response = await feeServices.get(params);
    return response.data;
  }
);

export const postFees = createAsyncThunk(
  'invoices/postFees',
  async (body: IFee) => {
    // Your async API call to fetch invoices goes here
    const response = await feeServices.post(body);
    return response.data;
  }
);

export const putFees = createAsyncThunk(
  'invoices/putFees',
  async (payload: {id: number, body: IFee}) => {
    // Your async API call to fetch invoices goes here
    const response = await feeServices.put(payload.id, payload.body);
    return response.data;
  }
);

export const deleteFees = createAsyncThunk(
  'invoices/deleteFees',
  async (id: number) => {
    // Your async API call to fetch invoices goes here
    const response = await feeServices.delete(id);
    return response.data;
  }
);

// Create the invoices slice
const feeSlice = createSlice({
  name: 'fees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFees.fulfilled, (state, action) => {
        state.loading = false;
        state.fees = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(postFees.pending, (state) => {
        state.loading = true;
      })
      .addCase(postFees.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(postFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(putFees.pending, (state) => {
        state.loading = true;
      })
      .addCase(putFees.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(putFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteFees.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFees.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteFees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the async thunk and the invoices reducer
export const { actions: feeActions, reducer: feeReducer } =
  feeSlice;
