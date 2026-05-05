import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { feedbackAPI, Feedback } from "@/api/feedback.api";

interface FeedbackState {
  feedbacks: Feedback[];
  loading: boolean;
  error: string | null;
}

const initialState: FeedbackState = {
  feedbacks: [],
  loading: false,
  error: null,
};

export const fetchFeedbacks = createAsyncThunk<
  Feedback[],
  void,
  { rejectValue: string }
>("feedback/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await feedbackAPI.getAll();
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch feedbacks",
    );
  }
});

export const createFeedback = createAsyncThunk<
  Feedback,
  { name: string; rating: number; descriptionText: string },
  { rejectValue: string }
>("feedback/create", async (data, { rejectWithValue }) => {
  try {
    const res = await feedbackAPI.create(data);
    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to create feedback",
    );
  }
});

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedbacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action: PayloadAction<Feedback[]>) => {
        state.loading = false;
        state.feedbacks = action.payload;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch feedbacks";
      })
      .addCase(createFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFeedback.fulfilled, (state, action: PayloadAction<Feedback>) => {
        state.loading = false;
        state.feedbacks.unshift(action.payload);
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create feedback";
      });
  },
});

export default feedbackSlice.reducer;