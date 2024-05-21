import { INotificationResponse } from '@/app/interfaces/notifications';
import { notificationServices } from '@/app/services/notifications';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface NotificationsState {
  cache: INotificationResponse[];
  // Otros campos de estado relacionados con las notificaciones
  // ...
}

const initialState: NotificationsState = {
  cache: [],
  // Inicializa otros campos de estado relacionados con las notificaciones
  // ...
};

// Define el async thunk para obtener las notificaciones
export const fetchNotifications = createAsyncThunk(
  'notifications/fetch',
  async (params: any, { getState, rejectWithValue }) => {
    try {
      const response = await notificationServices.get(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Crea el slice de notificaciones
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.cache = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      const notifications = action.payload.data ?? [];
      // Verifica si cada notificación ya existe en el caché antes de agregarla
      notifications.forEach((notification: INotificationResponse) => {
        if (!state.cache.some((n) => n.id === notification.id)) {
          state.cache.push(notification);
        }
      });
    });
  },
});
export const { actions: notificationActions, reducer: notificationReducer } =
  notificationsSlice;

  export const { clearNotifications } = notificationActions;

