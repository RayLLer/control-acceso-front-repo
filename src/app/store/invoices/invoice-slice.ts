import { IInvoiceResponse } from '@/app/interfaces/invoices';
import { invoiceServices } from '@/app/services/invoices';
import { IMeta } from '@/utils/base.interface';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface InvoiceState {
  invoices: IInvoiceResponse[];
  meta: IMeta;
  error: string | null;
  loading: boolean;
}

const initialState: InvoiceState = {
  invoices: [],
  meta: {} as IMeta,
  error: null,
  loading: false,
};

// Define the async thunk
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (params: any) => {
    // Your async API call to fetch invoices goes here
    const response = await invoiceServices.get(params);
    return response.data;
  }
);

// Create the invoices slice
const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.data;
        state.meta = action.payload.meta;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the async thunk and the invoices reducer
export const { actions: invoicesActions, reducer: invoicesReducer } =
  invoicesSlice;
