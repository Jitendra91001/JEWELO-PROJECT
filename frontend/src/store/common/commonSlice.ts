import { createSlice } from "@reduxjs/toolkit";
import { getDropdowntData } from "./commonThunk";

const initialState = {
    loading:false,
    categories:[],
    users:[],
    products:[]
};
const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDropdowntData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDropdowntData.fulfilled, (state, action) => {
        state.loading = false;
        state.products =action.payload.product

      })
      .addCase(getDropdowntData.rejected, (state) => {
        state.loading = true;
      });
  },
});

export default commonSlice.reducer;
