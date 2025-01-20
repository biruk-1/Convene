import { SET_IMAGE, CLEAR_IMAGE } from '../actions/imageActions';

const initialState = {
  selectedImage: null,
};

const imageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_IMAGE:
      return {
        ...state,
        selectedImage: action.payload,
      };
    case CLEAR_IMAGE:
      return {
        ...state,
        selectedImage: null,
      };
    default:
      return state;
  }
};

export default imageReducer;