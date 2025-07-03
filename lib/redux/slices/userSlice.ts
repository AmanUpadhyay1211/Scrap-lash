import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

interface UserData {
  userId: string
  credits: number
  totalCredits: number
  successfulScrapes: number
  recentScrapes: number
  plan: string
  lastActivity: string
}

interface Analytics {
  totalScrapes: number
  scrapeGrowth: number
  successRate: number
  successfulScrapes: number
  monthlyScrapesCount: number
  avgResponseTime: number
  dataAccuracy: number
  uniqueCompanies: number
  recentActivity: Array<{
    type: string
    target: string
    status: string
    timestamp: string
  }>
}

interface UserState {
  userData: UserData | null
  analytics: Analytics | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  userData: null,
  analytics: null,
  loading: false,
  error: null,
}

// Async thunks
export const fetchUserData = createAsyncThunk("user/fetchUserData", async (userId: string) => {
  const response = await fetch(`/api/user/${userId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch user data")
  }
  return response.json()
})

export const fetchAnalytics = createAsyncThunk("user/fetchAnalytics", async (userId: string) => {
  const response = await fetch(`/api/analytics/${userId}`)
  if (!response.ok) {
    throw new Error("Failed to fetch analytics")
  }
  return response.json()
})

export const updateUserCredits = createAsyncThunk(
  "user/updateUserCredits",
  async ({ userId, creditsUsed }: { userId: string; creditsUsed: number }) => {
    const response = await fetch(`/api/user/${userId}/credits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ creditsUsed }),
    })
    if (!response.ok) {
      throw new Error("Failed to update credits")
    }
    return response.json()
  },
)

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.userData = null
      state.analytics = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user data
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false
        state.userData = action.payload
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch user data"
      })
      // Fetch analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false
        state.analytics = action.payload
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch analytics"
      })
      // Update credits
      .addCase(updateUserCredits.fulfilled, (state, action) => {
        if (state.userData) {
          state.userData.credits = action.payload.credits
          state.userData.successfulScrapes = action.payload.successfulScrapes
        }
      })
  },
})

export const { clearUserData } = userSlice.actions
export default userSlice.reducer
