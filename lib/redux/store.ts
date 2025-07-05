import { configureStore } from "@reduxjs/toolkit"
import userSlice from "./slices/userSlice"
import chatSlice from "./slices/chatSlice"

export const store = configureStore({
  reducer: {
    user: userSlice,
    chat: chatSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
