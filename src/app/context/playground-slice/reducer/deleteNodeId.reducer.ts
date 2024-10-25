import { IPlaygroundInitialState } from "../module/initial-state";

export const deleteNodeId = (state: IPlaygroundInitialState) => {
  state.editNodeID = "";
};
