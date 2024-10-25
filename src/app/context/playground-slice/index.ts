import { createSlice } from "@reduxjs/toolkit";
import { playgroundInitialState } from "./module/initial-state";
import { setNodeId } from "./reducer/setNodeId.reducer";
import { deleteNodeId } from "./reducer/deleteNodeId.reducer";

export const playgroundSlice = createSlice({
  name: "playground",
  initialState: playgroundInitialState,
  reducers: {
    setEditNodeID: setNodeId,
    deleteEditNodeID: deleteNodeId,
  },
});

// Action creators are generated for each case reducer function
export const { setEditNodeID, deleteEditNodeID } = playgroundSlice.actions;

export default playgroundSlice.reducer;
