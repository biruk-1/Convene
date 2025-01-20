export const SET_IMAGE = 'SET_IMAGE';
export const CLEAR_IMAGE = 'CLEAR_IMAGE';

// Action to set the selected image
export const setImage = (image) => ({
  type: SET_IMAGE,
  payload: image,
});

// Action to clear the selected image
export const clearImage = () => ({
  type: CLEAR_IMAGE,
});