import { IPlaygroundInitialState } from "../module/initial-state";

export const setNodeId = (
  state: IPlaygroundInitialState,
  action: {
    payload: string;
  }
) => {
  state.editNodeID = action.payload;
};
