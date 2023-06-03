import { SET_SELECTED_WORK } from "../actions/work";

const initialState = {
  selectedWork: {},
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_WORK:
      return {
        ...state,
        selectedWork: action.work,
      };
    default:
      return state;
  }
}

export default rootReducer;
