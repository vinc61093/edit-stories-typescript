import { actionTypes } from '../../../common/constants/actionTypes';


export const changeColorAction = (color: any) => ({
  type: actionTypes.CHANGE_COLOR,
  payload: color,
});

export const addTextAction = (text: any) => ({
  type: actionTypes.ADD_TEXT,
  payload: text,
})

export const changeOjbect = (data: any) => ({
  type: actionTypes.CHANGE_OBJECT,
  payload: data
})

// export const modifyTemplate = (data: any) => ({
//   type: actionTypes.MODIFY_TEMPLATE,
//   payload: data
// })

// export const selectedObject = (data: any) => ({
//   type: 
// })