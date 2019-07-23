import { actionTypes } from '../common/constants/actionTypes';
import { SelectedTemplateEntity } from '../model';
import { fabric } from 'fabric';
const PlusSVG = require('../images/delete_btn.png');
const PlusPng = require('../images/plus_new.png');

let templateJSON = {}
let backGroundColor = {};


export const templateReducer = (state: SelectedTemplateEntity[] = [], action) => {
  switch (action.type) {
    case actionTypes.FETCH_SELECTED_TEMPLATE_END:
      return handleFetchTemplateByIdCompleted(state, action.payload);
    case actionTypes.CHANGE_COLOR:
      return { ...state, background: action.payload };
    case actionTypes.ADD_TEXT:
      return { ...state, objects: action.payload.objects, selectedObject: action.payload.selectedObject };
    case actionTypes.MODIFY_TEMPLATE:
      return { ...state, objects: action.payload.canvasObject.objects, background: action.payload.canvasObject.background, selectedObject: action.payload.selectedObject, sectionSelect: action.payload.sectionSelect, uploadedImage: '', imageScale: '' }
    case actionTypes.ADD_SHAPE:
      return { ...state, objects: action.payload.objects, selectedObject: action.payload.selectedObject }
    case actionTypes.CHANGE_OBJECT:
      return { ...state, objects: action.payload.objects };
    case actionTypes.SELECTED_OBJECT:
      return { ...state, selectedObject: action.payload.selectedObject }
    case actionTypes.RESET_TEMPLATE:
      return [];
    case actionTypes.TEXT_CONTROLS_VISIBILITY:
      return { ...state, visible: action.payload.visible };
    case actionTypes.DOWNLOAD_TEMPLATE_PREPARE:
      return { ...state, downloadTemplateURL: action.imageURL, downloadTemplate: false, showSpinner: true };
    case actionTypes.ADD_IMAGE:
      return { ...state, uploadedImage: action.payload, imageScale: '' }
    case actionTypes.IMAGE_SCALE:
      return { ...state, imageScale: action.payload }
    case actionTypes.SEND_TO_PLANOLY_COMPLETED:
      return { ...state, showSpinner: false, sendToPlanoly: false, currentAccount: null }
    case actionTypes.REMOVE_SELECTION:
      if (Object.keys(state).length > 0) {
        return handleRemoveDashAndSelectedObject(state);
        // return { ...state, selectedObject: action.payload }
      } else {
        return state;
      }
    case actionTypes.REMOVE_DASH:
      return handleRemoveDash(state);
    case actionTypes.REMOVE_IMAGE:
      return handleRemoveImage(state);
    case actionTypes.MODIFY_TEXT:
      console.log("state", state)
      console.log("action.payload", action.payload)
      return handleModifyText(state, action.payload);
  }
  return state;
};

const handleFetchTemplateByIdCompleted = (state: SelectedTemplateEntity[], payload: any) => {
  templateJSON['objects'] = [];
  payload.template.text.forEach(element => {
    element['type'] = "Textbox";
    element['left'] = (378 * element['left']) / 100;
    element['right'] = (378 * element['right']) / 100;
    element['top'] = (672 * element['top']) / 100;
    element['bottom'] = (672 * element['bottom']) / 100;
    element['fontSize'] = element['textSize'];
    element['textAlign'] = element['align'];
    element['fill'] = element['color'];
    element['fontFamily'] = element['typeface'];
    element['id'] = element['id'];
    element['backgroundColor'] = element['backgroundColor'] == null ? '' : element['backgroundColor']
    element['fontWeight'] = element['fontWeight'];
    element['fontStyle'] = element['fontStyle'] == null ? '' : element['fontStyle']
    element['charSpacing'] = (element['textSize'] * element['charSpacing'])
    element['lineHeight'] = element['lineSpacing']
    element['selectable'] = true
    element['lockMovementY'] = true
    element['lockMovementX'] = true
    element['lockScalingY'] = true
    element['lockScalingX'] = true

    element['lockRotation'] = true
    element['hasRotatingPoint'] = false
    element['objectType'] = 'text'
    element['external'] = true
    element['internal'] = false

  });

  payload.template.media.forEach((element, index) => {
    element.groupData.objects[0].strokeDashArray = [10, 10],
      element.groupData.objects[0].strokeWidth = 1,
      element.groupData.objects[0].stroke = '#000000',
      element.groupData.objects[1].height = 0;
    element.groupData.objects[1].width = 0;
    element.groupData.objects[1].src = PlusPng;
    element.groupData.objects[1].crossOrigin = 'anonymous';
    payload.template.media[index] = element.groupData;
    payload.template.media[index].zIndex = element.zIndex;
    payload.template.media[index]['id'] = element.id

    payload.template.media[index]['lockMovementY'] = true
    payload.template.media[index]['lockMovementX'] = true
    payload.template.media[index]['lockScalingY'] = true
    payload.template.media[index]['lockScalingX'] = true
    payload.template.media[index]['lockRotation'] = true

    payload.template.media[index]['selectable'] = true
    payload.template.media[index]['objectType'] = 'media'
    payload.template.media[index]['external'] = true
    payload.template.media[index]['internal'] = false
  });

  payload.template.shape.forEach(element => {
    element['left'] = (378 * element['left']) / 100;
    element['right'] = (378 * element['right']) / 100;
    element['top'] = (672 * element['top']) / 100;
    element['bottom'] = (672 * element['bottom']) / 100;
    element['lockMovementY'] = true
    element['lockMovementX'] = true
    element['lockScalingY'] = true
    element['lockScalingX'] = true
    element['selectable'] = false
    if (element.roundedCorner) {
      element['rx'] = 15;
      element['ry'] = 15;
    }
    element['lockRotation'] = true
    element['hasRotatingPoint'] = false

    element['objectType'] = 'shape'
    element['external'] = true
    element['internal'] = false
  });

  payload.template.image.forEach(element => {
    element['left'] = (((378 * element['left']) / 100));
    element['top'] = (((672 * element['top']) / 100));
    element['right'] = (((378 * element['right']) / 100));
    element['bottom'] = (((672 * element['bottom']) / 100));
    element['type'] = "image";
    element['src'] = element['imageData']
    element['crossOrigin'] = "anonymous"
    element['scaleY'] = element['height'] / element['originalHeight']
    element['scaleX'] = element['width'] / element['originalWidth']
    element['height'] = element['originalHeight']
    element['width'] = element['originalWidth']

    element['lockMovementY'] = true
    element['lockMovementX'] = true
    element['lockScalingY'] = true
    element['lockScalingX'] = true
    element['lockRotation'] = true
    element['selectable'] = false

    element['objectType'] = 'image'
    element['hasRotatingPoint'] = false
    element['external'] = true
    element['internal'] = false
  });

  let Data = [...payload.template.media, ...payload.template.shape, ...payload.template.text, ...payload.template.image]
  Data.sort((a, b) => { return a.zIndex - b.zIndex });

  templateJSON['objects'] = Data;
  templateJSON['mediaObjects'] = [...payload.template.media]
  backGroundColor = payload.template.background.color;
  templateJSON['background'] = backGroundColor;
  templateJSON['txtOneDis'] = false;
  templateJSON['txtTwoDis'] = false;
  templateJSON['txtThreeDis'] = false;
  templateJSON['sectionSelect'] = 'addBackground';
  templateJSON['downloadTemplate'] = false;
  templateJSON['downloadTemplateURL'] = null;
  templateJSON['sendToPlanoly'] = false;
  templateJSON['firstLoad'] = false;
  templateJSON['selectedObject'] = -1;
  templateJSON['showSpinner'] = false;
  templateJSON['showAccountPicker'] = false;
  templateJSON['imageScale'] = "";
  return templateJSON;
};

const handleRemoveDash = (state) => {
  let data = { ...state };
  data.objects.forEach((element, index) => {
    if (element.id === 'containerBox') {
      data.objects.splice(index, 1);
    }
  });
  return data;
}
const handleRemoveDashAndSelectedObject = (state) => {
  let data = { ...state };
  data.objects.forEach((element, index) => {
    if (element.id === 'containerBox') {
      data.objects.splice(index, 1);
    }
  });
  data.selectedObject = -1
  return data;
}

const handleRemoveImage = (state) => {
  let data = { ...state };
  let id, mediaObj, indexID;
  data.objects.forEach((element, index) => {
    if (index == data.selectedObject && element.type == 'image') {
      id = element.id
      indexID = index
      data.objects.splice(index, 1);
    }
  });

  data.objects.forEach((element, index) => {
    if (element.id === 'containerBox') {
      data.objects.splice(index, 1);
    }
  });

  data.mediaObjects.forEach(element => {
    if (element.id == id) {
      mediaObj = element
    }
  });
  data.objects.splice(indexID, 0, mediaObj);
  data.selectedObject = data.selectedObject
  return data;
}

const handleModifyText = (state, payload) => {
  let data = { ...state };
  data.objects.forEach((element, index) => {
    if (index == payload.index) {
      element.text = payload.text
    }
  });
  return data;
}
