import { createStore } from "redux";

const initialState = {
  shotData: [],
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_SHOT_DATA":
      return {
        ...state,
        shotData: action.payload,
      };
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;
