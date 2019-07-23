import { fabric } from 'fabric';
import * as React from 'react'
import ActiveTemplateSelector from '../activeTemplateSelector/ActiveTemplateSelector';
import { connect } from 'react-redux';
import { State } from '../../reducers';
import { addTextAction } from '../sideDrawer/actions';
import { store } from '../../store'
import { changeOjbect } from '../sideDrawer/actions';
import * as ReactGA from 'react-ga';

let ImgPowered = require('../../images/planoly-powertag.png');

import "bootstrap/dist/css/bootstrap.css";
import './canvassection.css';

var removeFromArray = fabric.util.removeFromArray;
// https://stackoverflow.com/questions/42287830/sending-multiple-objects-forward-changes-their-order-z-index
fabric.StaticCanvas.prototype.bringForward = function (object, intersecting) {
  if (!object) {
    return this;
  }
  var activeGroup = this._activeGroup,
    i, obj, idx, newIdx, objs, latestIndex;

  if (object === activeGroup) {
    objs = activeGroup._objects;
    latestIndex = this._objects.length;
    for (i = objs.length; i--;) {
      obj = objs[i];
      idx = this._objects.indexOf(obj);
      if (idx !== this._objects.length - 1 && idx < latestIndex - 1) {
        newIdx = idx + 1;
        latestIndex = newIdx;
        removeFromArray(this._objects, obj);
        this._objects.splice(newIdx, 0, obj);
      } else {
        latestIndex = idx;
      }
    }
  }
  else {
    idx = this._objects.indexOf(object);
    if (idx !== this._objects.length - 1) {
      // if object is not on top of stack (last item in an array)
      newIdx = this._findNewUpperIndex(object, idx, intersecting);
      removeFromArray(this._objects, object);
      this._objects.splice(newIdx, 0, object);
    }
  }
  this.renderAll && this.renderAll();
  return this;
};

const fabricCanvas = new fabric.Canvas('c');
let isDispacherCalled = false;
let previousSelectedObject = -1;
let sectionSelect;
let scalingOption = "";
let uploadImage = false;
let scalingImage = false;

let internalMovable = ['text', 'shape', 'image', 'media']
let externalMovable = ['text']
let internalSelectable = ['text', 'shape', 'image', 'media']
let externalSelectable = ['text', 'media']
let internalRotatable = []
let externalRotatable = []

interface IProps {
  template: any;
  color: any;
  text: any;
  addTextAction: (value: any) => void;
  changeOjbect: (value: any) => void;
}

interface IState {
  colorPickerFlag: boolean;
}

class CanvasSection extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleMovable = this.handleMovable.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.state = { colorPickerFlag: false };
  }

  adjustTextbox() {
    // fix text selection and cursor on safari STOR-397
    const ua = navigator.userAgent.toLowerCase();    
    if (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) {
      fabric.Textbox.prototype._getGraphemeBox = function (grapheme, lineIndex, charIndex, prevGrapheme, skipLeft) {
        var style = this.getCompleteStyleDeclaration(lineIndex, charIndex),
          prevStyle = prevGrapheme ? this.getCompleteStyleDeclaration(lineIndex, charIndex - 1) : {},
          info = this._measureChar(grapheme, style, prevGrapheme, prevStyle),
          kernedWidth = info.kernedWidth,
          width = info.width, charSpacing;
        if (this.charSpacing !== 0) {
          charSpacing = this._getWidthOfCharSpacing();
          width += charSpacing;
          kernedWidth += charSpacing;
        }

        let offset = 0;
        const activeObject = fabricCanvas.getActiveObject();
        if (activeObject && activeObject.objectType === 'text') {
          if (['American Typewriter', 'Times New Roman', 'Liber'].indexOf(activeObject.fontFamily) === -1) {
            offset = 1;
          }          
        }
        var box = {
          width: width + offset,
          left: 0,
          height: style.fontSize,
          kernedWidth: kernedWidth,
          deltaY: style.deltaY,
        };
        if (charIndex > 0 && !skipLeft) {
          var previousBox = this.__charBounds[lineIndex][charIndex - 1];
          box.left = previousBox.left + previousBox.width + info.kernedWidth - info.width;
        }
        return box;
      }
    }
  }

  public componentDidMount() {
    fabricCanvas.initialize('c', {
      preserveObjectStacking: true,
      height: 672,
      width: 378,
      selection: false
    });

    this.adjustTextbox();

    fabric.Textbox.prototype.toObject = (function (toObject) {
      return function () {
        return fabric.util.object.extend(toObject.call(this), {
          textAnchor: this.textAnchor
        });
      };
    })(fabric.Textbox.prototype.toObject);

    fabric.util.addListener(fabricCanvas.upperCanvasEl, "click", (e) => {
      var mouse = fabricCanvas.getPointer(e);
      if (e.target) {
        var targets = fabricCanvas.getObjects().filter(obj => {
          return obj.containsPoint(mouse);
        });
        if (fabricCanvas.getActiveObject() == null) {
          for (var i = targets.length - 1; i >= 0; i--) {
            if (targets[i].selectable == true) {
              targets[i] && fabricCanvas.setActiveObject(targets[i]);
              break;
            }
          }
        }
      }

      try {
        if (fabricCanvas.getActiveObject() === null && this.props.template && this.props.template.objects) {
          this.props.changeOjbect(this.props.template);
        }
      }
      catch (e) {
        
      }
    });

    fabric.util.addListener(fabricCanvas.upperCanvasEl, "dblclick", function (e) {
      var mouse = fabricCanvas.getPointer(e);

      if (e.target) {
        var targets = fabricCanvas.getObjects().filter(function (obj) {
          return obj.containsPoint(mouse);
        });

        for (var i = targets.length - 1; i >= 0; i--) {
          if (targets[i].objectType == 'shape') {
            targets[i] && fabricCanvas.setActiveObject(targets[i]);
            break;
          }
        }
      }
    });

    fabricCanvas.on('object:modified', function (e) {
      console.log('object:modified')
      let objects = fabricCanvas.getObjects();

      objects.forEach(function (element, index) {
        const id = element.id
        const objectType = element.objectType
        const external = element.external
        const internal = element.internal
        objects[index] = element.toObject();
        objects[index].objectType = objectType;
        objects[index].external = external;
        objects[index].internal = internal;
        objects[index].id = id;


        if (objects[index].external) {
          if (externalSelectable.indexOf(objects[index].objectType) > -1) {
            objects[index].selectable = true;
          } else {
            objects[index].selectable = false;
          }

          if (externalRotatable.indexOf(objects[index].objectType) == -1) {
            objects[index].lockRotation = true;
            objects[index].hasRotatingPoint = false;
          } else {
            objects[index].lockRotation = false;
          }

          if (externalMovable.indexOf(objects[index].objectType) == -1) {
            objects[index].lockMovementY = true;
            objects[index].lockMovementX = true;
            objects[index].lockScalingY = true;
            objects[index].lockScalingX = true;

          } else {
            objects[index].lockMovementY = false;
            objects[index].lockMovementX = false;
            objects[index].lockScalingY = false;
            objects[index].lockScalingX = false;
          }
        }

        if (objects[index].internal) {
          if (internalSelectable.indexOf(objects[index].objectType) > -1) {
            objects[index].selectable = true;
          } else {
            objects[index].selectable = false;
          }

          if (internalRotatable.indexOf(objects[index].objectType) == -1) {
            objects[index].lockRotation = true;
            objects[index].hasRotatingPoint = false;
          } else {
            objects[index].lockRotation = false;
          }

          if (internalMovable.indexOf(objects[index].objectType) == -1) {
            objects[index].lockMovementY = true;
            objects[index].lockMovementX = true;
            objects[index].lockScalingY = true;
            objects[index].lockScalingX = true;
          } else {
            objects[index].lockMovementY = false;
            objects[index].lockMovementX = false;
            objects[index].lockScalingY = false;
            objects[index].lockScalingX = false;
          }
        }

        if (fabricCanvas.getActiveObject().objectType == 'text' && fabricCanvas.getActiveObject().internal == true) {
          objects[index].name = fabricCanvas.getObjects()[index].name;
          objects[index].capitalize = objects[index].capitalize;
        }

        if (fabricCanvas.getActiveObject().objectType == 'text') {
          sectionSelect = 'addText';
        }
        else if (fabricCanvas.getActiveObject().objectType == 'media' || typeof fabricCanvas.getActiveObject().objectType == 'undefined') {
          sectionSelect = 'addImage';
        } else {
          sectionSelect = 'addShapes';
        }
      })
      store.dispatch({
        type: 'MODIFY_TEMPLATE',
        payload: {
          canvasObject: {
            "version": "2.6.0",
            "objects": objects,
            "background": fabricCanvas.backgroundColor
          },
          sectionSelect: sectionSelect,
          selectedObject: fabricCanvas.getObjects().indexOf(fabricCanvas.getActiveObject())
        }
      })
    });

    fabricCanvas.on('object:selected', (e) => {
      console.log('object:selected');
      this.adjustTextbox();
      let newRect, object, addDash = false;
      if (fabricCanvas.getObjects().indexOf(fabricCanvas.getActiveObject()) != previousSelectedObject) {
        isDispacherCalled = false
        previousSelectedObject = fabricCanvas.getObjects().indexOf(fabricCanvas.getActiveObject()) == -1 ? previousSelectedObject : fabricCanvas.getObjects().indexOf(fabricCanvas.getActiveObject())
        object = fabricCanvas.getActiveObject();
        if (object.objectType == 'media' && object.type != 'group') {
          // addDash = true;
        }
      }

      if (!isDispacherCalled) {
        isDispacherCalled = true;
        let objects = fabricCanvas.getObjects();
        objects.forEach(function (element, index) {

          let id = element.id
          const objectType = element.objectType
          const external = element.external
          const internal = element.internal
          objects[index] = element.toObject();
          objects[index].objectType = objectType;
          objects[index].external = external;
          objects[index].internal = internal;
          objects[index].id = id;

          if (objects[index].external) {
            if (externalSelectable.indexOf(objects[index].objectType) > -1) {
              objects[index].selectable = true;
            } else {
              objects[index].selectable = false;
            }

            if (externalRotatable.indexOf(objects[index].objectType) == -1) {
              objects[index].lockRotation = true;
              objects[index].hasRotatingPoint = false;
            } else {
              objects[index].lockRotation = false;
            }

            if (externalMovable.indexOf(objects[index].objectType) == -1) {
              objects[index].lockMovementY = true;
              objects[index].lockMovementX = true;
              objects[index].lockScalingY = true;
              objects[index].lockScalingX = true;

            } else {
              objects[index].lockMovementY = false;
              objects[index].lockMovementX = false;
              objects[index].lockScalingY = false;
              objects[index].lockScalingX = false;
            }
          }

          if (objects[index].internal) {
            if (internalSelectable.indexOf(objects[index].objectType) > -1) {
              objects[index].selectable = true;
            } else {
              objects[index].selectable = false;
            }

            if (internalRotatable.indexOf(objects[index].objectType) == -1) {
              objects[index].lockRotation = true;
              objects[index].hasRotatingPoint = false;
            } else {
              objects[index].lockRotation = false;
            }

            if (internalMovable.indexOf(objects[index].objectType) == -1) {
              objects[index].lockMovementY = true;
              objects[index].lockMovementX = true;
              objects[index].lockScalingY = true;
              objects[index].lockScalingX = true;
            } else {
              objects[index].lockMovementY = false;
              objects[index].lockMovementX = false;
              objects[index].lockScalingY = false;
              objects[index].lockScalingX = false;
            }
          }

          if (fabricCanvas.getActiveObject().objectType == 'text' && fabricCanvas.getActiveObject().internal == true) {
            objects[index].name = fabricCanvas.getObjects()[index].name;
            objects[index].capitalize = objects[index].capitalize;
          }
          if (fabricCanvas.getActiveObject().objectType == 'text') {
            sectionSelect = 'addText';
          } else if (fabricCanvas.getActiveObject().objectType == 'media' || typeof fabricCanvas.getActiveObject().objectType == 'undefined') {
            sectionSelect = 'addImage';
          } else {
            sectionSelect = 'addShapes';
          }
        })
        if (addDash) {
          newRect = new fabric.Rect({
            id: 'containerBox',
            width: object.clipPath.width + 1,
            height: object.clipPath.height + 1,
            top: object.clipPath.top,
            left: object.clipPath.left,
            fill: 'transparent',
            strokeDashArray: [10, 10],
            strokeWidth: 1,
            stroke: '#000000',
            objectType: 'shape',
            hasRotatingPoint: false,
            internal: false,
            external: true,
            selectable: false
            // hasRotatingPoint: false,
          });
          objects.push(newRect);
        }
        store.dispatch({
          type: 'MODIFY_TEMPLATE',
          payload: {
            canvasObject: {
              "version": "2.6.0",
              "objects": objects,
              "background": fabricCanvas.backgroundColor
            },
            sectionSelect: sectionSelect,
            selectedObject: fabricCanvas.getObjects().indexOf(fabricCanvas.getActiveObject())
          }
        })
      }
    })

    fabricCanvas.on("selection:updated", (e) => {
      console.log('selection:updated')
      this.adjustTextbox();
      let newRect, object, addDash = false;
      if (fabricCanvas.getObjects().indexOf(fabricCanvas.getActiveObject()) != previousSelectedObject) {
        isDispacherCalled = false
        previousSelectedObject = fabricCanvas.getObjects().indexOf(fabricCanvas.getActiveObject())
        object = fabricCanvas.getActiveObject();
        if (object.objectType == 'media' && object.type != 'group') {
          //addDash = true;
        } else {
          //addDash = false;
        }
      }

      if (!isDispacherCalled) {
        isDispacherCalled = true
        let objects = fabricCanvas.getObjects();
        objects.forEach(function (element, index) {
          const id = element.id
          const objectType = element.objectType
          const external = element.external
          const internal = element.internal
          objects[index] = element.toObject();
          objects[index].objectType = objectType;
          objects[index].external = external;
          objects[index].internal = internal;
          objects[index].id = id;

          if (objects[index].external) {
            if (externalSelectable.indexOf(objects[index].objectType) > -1) {
              objects[index].selectable = true;
            } else {
              objects[index].selectable = false;
            }

            if (externalRotatable.indexOf(objects[index].objectType) == -1) {
              objects[index].lockRotation = true;
              objects[index].hasRotatingPoint = false;
            } else {
              objects[index].lockRotation = false;
            }

            if (externalMovable.indexOf(objects[index].objectType) == -1) {
              objects[index].lockMovementY = true;
              objects[index].lockMovementX = true;
              objects[index].lockScalingY = true;
              objects[index].lockScalingX = true;

            } else {
              objects[index].lockMovementY = false;
              objects[index].lockMovementX = false;
              objects[index].lockScalingY = false;
              objects[index].lockScalingX = false;
            }
          }

          if (objects[index].internal) {
            if (internalSelectable.indexOf(objects[index].objectType) > -1) {
              objects[index].selectable = true;
            } else {
              objects[index].selectable = false;
            }

            if (internalRotatable.indexOf(objects[index].objectType) == -1) {
              objects[index].lockRotation = true;
              objects[index].hasRotatingPoint = false;
            } else {
              objects[index].lockRotation = false;
            }

            if (internalMovable.indexOf(objects[index].objectType) == -1) {
              objects[index].lockMovementY = true;
              objects[index].lockMovementX = true;
              objects[index].lockScalingY = true;
              objects[index].lockScalingX = true;
            } else {
              objects[index].lockMovementY = false;
              objects[index].lockMovementX = false;
              objects[index].lockScalingY = false;
              objects[index].lockScalingX = false;
            }
          }

          if (fabricCanvas.getActiveObject().objectType == 'text' && fabricCanvas.getActiveObject().internal == true) {
            objects[index].name = fabricCanvas.getObjects()[index].name;
            objects[index].capitalize = objects[index].capitalize;
          }

          if (fabricCanvas.getActiveObject().objectType == 'text') {
            sectionSelect = 'addText';
          } else if (fabricCanvas.getActiveObject().objectType == 'media' || typeof fabricCanvas.getActiveObject().objectType == 'undefined') {
            sectionSelect = 'addImage';
          }
          else {
            sectionSelect = 'addShapes';
          }
        })
        if (addDash) {
          newRect = new fabric.Rect({
            id: 'containerBox',
            width: object.clipPath.width + 1,
            height: object.clipPath.height + 1,
            top: object.clipPath.top,
            left: object.clipPath.left,
            fill: 'transparent',
            strokeDashArray: [10, 10],
            strokeWidth: 1,
            stroke: '#000000',
            objectType: 'shape',
            hasRotatingPoint: false,
            internal: false,
            external: true,
            selectable: false
            // hasRotatingPoint: false,
          });
          objects.push(newRect);
        } else {
          (objects).forEach((element, index) => {
            if (element.id === 'containerBox') {
              objects.splice(index, 1);
            }
          });
        }
        store.dispatch({
          type: 'MODIFY_TEMPLATE',
          payload: {
            canvasObject: {
              "version": "2.6.0",
              "objects": objects,
              "background": fabricCanvas.backgroundColor
            },
            sectionSelect: sectionSelect,
            selectedObject: fabricCanvas.getObjects().indexOf(fabricCanvas.getActiveObject())
          }
        })
      }
    })

    fabricCanvas.on('object:scaling', function (e) {
      console.log('object:scaling')
      const objects = fabricCanvas.getActiveObject();
      if (objects.type != "Textbox") {
        if (objects.type != "circle" && objects.type != "ellipse" && objects.type != 'image') {
          const w = objects.width * objects.scaleX,
            h = objects.height * objects.scaleY,
            s = objects.strokeWidth;
          objects.set({
            'height': h,
            'width': w,
            'scaleX': 1,
            'scaleY': 1,
            'objectCaching': false
          });
        } else if (objects.type == "circle") {
          const h = objects.height * objects.scaleY,
            w = objects.width * objects.scaleX,
            r = (w + h) / 4;
          objects.set({
            'radius': r,
            'scaleX': 1,
            'scaleY': 1,
            'objectCaching': false
          });
        } else if (objects.type == "ellipse") {
          objects.set({
            "rx": objects.rx * objects.scaleX,
            "ry": objects.ry * objects.scaleY,
            "width": objects.rx * 2,
            "height": objects.ry * 2,
            "scaleX": 1,
            "scaleY": 1,
            'objectCaching': false
          });
        }
      }
    });

    fabricCanvas.on("object:added", function (e) {
      console.log("object:added")
      const objects = fabricCanvas.getObjects();
      const activeObject = fabricCanvas.getObjects().indexOf(fabricCanvas.getActiveObject());
      const PlusSVGIndex = fabricCanvas.getObjects().indexOf(fabricCanvas.getActiveObject()) + 1;
      const newObject = e.target;
      if (activeObject > -1) {
        objects.forEach(function (element, index) {
          const id = element.id
          const objectType = element.objectType
          const external = element.external
          const internal = element.internal
          objects[index] = element.toObject();
          objects[index].objectType = objectType;
          objects[index].external = external;
          objects[index].internal = internal;
          objects[index].id = id;

          if (index == activeObject) {
            objects[index] = newObject.toObject();
            objects[index].id = id;
            objects[index].objectType = objectType;
            objects[index].external = false;
            objects[index].internal = true;
          }

          if (objects[index].external) {
            if (externalSelectable.indexOf(objects[index].objectType) > -1) {
              objects[index].selectable = true;
            } else {
              objects[index].selectable = false;
            }

            if (externalRotatable.indexOf(objects[index].objectType) == -1) {
              objects[index].lockRotation = true;
              objects[index].hasRotatingPoint = false;
            } else {
              objects[index].lockRotation = false;
            }

            if (externalMovable.indexOf(objects[index].objectType) == -1) {
              objects[index].lockMovementY = true;
              objects[index].lockMovementX = true;
              objects[index].lockScalingY = true;
              objects[index].lockScalingX = true;

            } else {
              objects[index].lockMovementY = false;
              objects[index].lockMovementX = false;
              objects[index].lockScalingY = false;
              objects[index].lockScalingX = false;
            }
          }

          if (objects[index].internal) {
            if (internalSelectable.indexOf(objects[index].objectType) > -1) {
              objects[index].selectable = true;
            } else {
              objects[index].selectable = false;
            }

            if (internalRotatable.indexOf(objects[index].objectType) == -1) {
              objects[index].lockRotation = true;
              objects[index].hasRotatingPoint = false;
            } else {
              objects[index].lockRotation = false;
            }

            if (internalMovable.indexOf(objects[index].objectType) == -1) {
              objects[index].lockMovementY = true;
              objects[index].lockMovementX = true;
              objects[index].lockScalingY = true;
              objects[index].lockScalingX = true;
            } else {
              objects[index].lockMovementY = false;
              objects[index].lockMovementX = false;
              objects[index].lockScalingY = false;
              objects[index].lockScalingX = false;
            }
          }

          if (fabricCanvas.getActiveObject().objectType == 'text' && fabricCanvas.getActiveObject().internal == true) {
            objects[index].name = fabricCanvas.getObjects()[index].name;
            objects[index].capitalize = objects[index].capitalize;
          }

          if (fabricCanvas.getActiveObject().objectType == 'text') {
            sectionSelect = 'addText';
          } else if (fabricCanvas.getActiveObject().objectType == 'media' || typeof fabricCanvas.getActiveObject().objectType == 'undefined') {
            sectionSelect = 'addImage';
          } else {
            sectionSelect = 'addShapes';
          }

        })
        objects.pop();
        setTimeout(() => {
          store.dispatch({
            type: 'MODIFY_TEMPLATE',
            payload: {
              canvasObject: {
                "version": "2.6.0",
                "objects": objects,
                "background": fabricCanvas.backgroundColor
              },
              sectionSelect: sectionSelect,
              selectedObject: fabricCanvas.getObjects().indexOf(fabricCanvas.getActiveObject())
            }
          })
        }, 10)
      }
    })

    fabricCanvas.on("mouse:down", function (e) {
      if (fabricCanvas.getActiveObject() == null) {
        previousSelectedObject = -2
        store.dispatch({
          type: 'REMOVE_SELECTION',
          payload: -1
        })
      } else {
        // if (fabricCanvas.getActiveObject().objectType != 'media') {
        //   store.dispatch({
        //     type: 'REMOVE_DASH'
        //   })
        // }

        // console.log("mousedown", fabricCanvas.getActiveObject())
        // store.dispatch({
        //   type: 'REMOVE_SELECTION',
        //   payload: fabricCanvas.getObjects().indexOf(fabricCanvas.getActiveObject())
        // })
      }
      // console.log("fabricCanvas.getObjects()", fabricCanvas.getObjects().)
      // if (fabricCanvas.getActiveObject() != null) {
      //   if (fabricCanvas.getActiveObject().objectType != 'media' && fabricCanvas.getActiveObject().type == 'image') {
      //     store.dispatch({
      //       type: 'REMOVE_DASH'
      //     })
      //   }
      // }
    })

    fabricCanvas.on("mouse:out", function (e) {
      if (fabricCanvas.getActiveObject()) {
        if (fabricCanvas.getActiveObject().type == 'Textbox') {
          if (e.target == null) {
            store.dispatch({
              type: 'MODIFY_TEXT',
              payload: {
                canvasObject: {
                  "text": fabricCanvas.getActiveObject().text,
                  "index": fabricCanvas.getObjects().indexOf(fabricCanvas.getActiveObject())
                }
              }
            })
          }
        }
      }
    })
  }

  handleSelection(object) {
    if (object.external) {
      if (externalSelectable.indexOf(object.objectType) > -1) {
        object.selectable = true;
      } else {
        object.selectable = false;
      }
      return object;
    }

    if (object.internal) {
      if (internalSelectable.indexOf(object.objectType) > -1) {
        object.selectable = true;
      } else {
        object.selectable = false;
      }
      return object;
    }
  }

  handleMovable(object) {
    if (object.internal) {
      if (internalMovable.indexOf(object.objectType) > -1) {
        object.lockMovementY = true;
        object.lockMovementX = true;
        object.lockScalingY = true;
        object.lockScalingX = true;
      } else {
        object.lockMovementY = false;
        object.lockMovementX = false;
        object.lockScalingY = false;
        object.lockScalingX = false;
      }
      return object;
    }

    if (object.external) {
      if (externalMovable.indexOf(object.objectType) > -1) {
        object.lockMovementY = true;
        object.lockMovementX = true;
        object.lockScalingY = true;
        object.lockScalingX = true;
      } else {
        object.lockMovementY = false;
        object.lockMovementX = false;
        object.lockScalingY = false;
        object.lockScalingX = false;
      }
      return object;
    }
  }

  handleClick() {
    console.log('fabricCanvas2222', fabricCanvas.getObjects())
  }

  handleFontStyles(event, type, extra = null) {
    if (event.target.nodeName === "SELECT")
      this.props.template.objects[this.props.template.selectedObject][`${type}`] = event.target.value;
    else if (type === "fontWeight") {
      if (this.props.template.objects[this.props.template.selectedObject][`${type}`] === "normal") {
        this.props.template.objects[this.props.template.selectedObject][`${type}`] = "bold";
      } else {
        this.props.template.objects[this.props.template.selectedObject][`${type}`] = "normal";
      }
    } else if (type === "fontStyle") {
      if (this.props.template.objects[this.props.template.selectedObject][`${type}`] === "") {
        this.props.template.objects[this.props.template.selectedObject][`${type}`] = "italic";
      } else {
        this.props.template.objects[this.props.template.selectedObject][`${type}`] = "";
      }
    } else if (type === "capitalize") {
      if (!this.props.template.objects[this.props.template.selectedObject][`${type}`]) {
        this.props.template.objects[this.props.template.selectedObject].text = this.props.template.objects[this.props.template.selectedObject].text.toUpperCase();
        this.props.template.objects[this.props.template.selectedObject].capitalize = true;
      } else {
        this.props.template.objects[this.props.template.selectedObject].text = this.props.template.objects[this.props.template.selectedObject].text.toLowerCase();
        this.props.template.objects[this.props.template.selectedObject].capitalize = false;
      }
    } else if (type === "textAlign") {
      switch (extra) {
        case 'left':
          this.props.template.objects[this.props.template.selectedObject][`${type}`] = "left";
          break;
        case 'center':
          this.props.template.objects[this.props.template.selectedObject][`${type}`] = "center";
          break;
        case 'right':
          this.props.template.objects[this.props.template.selectedObject][`${type}`] = "right";
          break;
      }
    }
    this.props.changeOjbect(this.props.template);
  }

  public handleColorChange = data => {
    this.props.template.objects[this.props.template.selectedObject][`${'fill'}`] = data.hex;
    this.props.changeOjbect(this.props.template);
  }

  handleChange = () => {
    if (uploadImage) {
      let active_obj = fabricCanvas.getActiveObject();
      let heightToUse = 0;
      let widthToUse = 0;
      let topToUse = 0;
      let leftToUse = 0;

      if (active_obj.type == "group") {
        heightToUse = active_obj.height - 3;
        widthToUse = active_obj.width - 3;
        topToUse = active_obj.top;
        leftToUse = active_obj.left;
      } else {
        heightToUse = active_obj.clipPath.height;
        widthToUse = active_obj.clipPath.width;
        topToUse = active_obj.clipPath.top;
        leftToUse = active_obj.clipPath.left;
      }

      const clipPath = new fabric.Rect({
        width: widthToUse,
        height: heightToUse,
        top: topToUse,
        left: leftToUse,
        id: 'notCustom',
        absolutePositioned: true,
        fill: '#ffffff',
        strokeWidth: 2,
        stroke: '#000000'
      });

      fabric.Image.fromURL(this.props.template.uploadedImage, (img) => {
        img.set({
          id: 'noCustomImg',
          top: topToUse,
          left: leftToUse,
          objectType: 'image',
          hasRotatingPoint: false,
          internal: true,
          external: false
        });

        img.clipPath = clipPath;
        img.scaleToWidth(widthToUse);
        fabricCanvas.add(img);

        this.props.template.uploadedImage = null;
      });

      uploadImage = false;
      fabricCanvas.renderAll();
    }
  }

  handleSclaeChange = () => {
    if (scalingImage) {
      if (scalingOption !== this.props.template.imageScale) {
        // console.log("fabricCanvas.getActiveObject()", fabricCanvas.getActiveObject())
        scalingOption = this.props.template.imageScale;
        let active_obj = fabricCanvas.getActiveObject();
        let heightToUse = active_obj.clipPath.height;
        let widthToUse = active_obj.clipPath.width;
        let topToUse = active_obj.clipPath.top;
        let leftToUse = active_obj.clipPath.left;

        var clipPath = new fabric.Rect({
          width: widthToUse,
          height: heightToUse,
          top: topToUse,
          left: leftToUse,
          id: 'notCustom',
          absolutePositioned: true
        });
        fabric.Image.fromURL(fabricCanvas.getActiveObject().src, function (img) {
          img.set({
            id: 'noCustomImg',
            top: topToUse,
            left: leftToUse,
            objectType: 'image',
            hasRotatingPoint: false,
            internal: true,
            external: false
          })
          img.clipPath = clipPath;
          if (scalingOption == 'fitToScale') {
            img.scaleToWidth(widthToUse);

            img.set({
              top: topToUse + (heightToUse / 2) - ((img.height * img.scaleY) / 2)
            })
          } else if (scalingOption == 'showFullSizeImage') {
            img.scaleX = 1;
            img.scaleY = 1;
          } else if (scalingOption == '16_9') {
            img.set({
              scaleX: 0.5,
              scaleY: 0.28
            });
            img.set({
              top: topToUse + (heightToUse / 2) - ((img.height * img.scaleY) / 2)
            })
          }
          fabricCanvas.add(img);
        })
        fabricCanvas.renderAll();
        scalingImage = false;
      }
    }
  }

  sendToPlanoly = () => {
    (fabricCanvas.getObjects()).forEach(element => {
      if (element.id == "containerBox") {
        fabricCanvas.remove(element)
      }
    });
    store.dispatch({
      type: 'SEND_TO_PLANOLY',
      payload: {
        currentAccount: this.props.template.currentAccount,
        templateThumb: fabricCanvas.toDataURL({
          format: 'jpeg',
          quality: 1,
          multiplier: 2.5
        })
      }
    });

    ReactGA.event({
      category: 'StoriesEdit',
      action: 'Send to Planoly'
    });
  }

  downloadTemplate = () => {
    (fabricCanvas.getObjects()).forEach(element => {
      if (element.id == "containerBox") {
        fabricCanvas.remove(element)
      }
    });
    store.dispatch({
      type: 'DOWNLOAD_TEMPLATE',
      payload: {
        templateThumb: fabricCanvas.toDataURL({
          format: 'jpeg',
          quality: 1,
          multiplier: 2.5
        })
      }
    });

    ReactGA.event({
      category: 'StoriesEdit',
      action: 'Download'
    });
  }

  handleColorPickerVisibility = () => {
    if (this.state.colorPickerFlag) {
      this.setState({ colorPickerFlag: false })
    } else {
      this.setState({ colorPickerFlag: true })
    }
  }

  public render() {
    if (this.props.template.length == 0) {
      isDispacherCalled = false;
      previousSelectedObject = -1;
      sectionSelect;
      scalingOption = "";
    }
    previousSelectedObject = this.props.template.selectedObject;
    fabricCanvas.loadFromJSON(this.props.template);
    fabricCanvas.renderAll();
    setTimeout(() => {
      const selectedObject = this.props.template.selectedObject;
      if (selectedObject > -1) {
        let item = fabricCanvas.item(selectedObject);
        fabricCanvas.setActiveObject(item);
        fabricCanvas.renderAll();
      }

      if (this.props.template.downloadTemplate) {
        this.downloadTemplate();
      }

      if (this.props.template.sendToPlanoly && this.props.template.currentAccount) {
        this.sendToPlanoly();
      }

      if (this.props.template.uploadedImage) {
        uploadImage = true;
        this.handleChange()
      }

      if (this.props.template.imageScale) {
        scalingImage = true;
        this.handleSclaeChange()
      } else {
        scalingOption = '';
      }


      if (this.props.template.downloadTemplateURL != null) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.props.template.downloadTemplateURL, true);
        xhr.responseType = "blob";
        xhr.onload = function () {
          var urlCreator = window.URL;
          var imageUrl = urlCreator.createObjectURL(this.response);
          var tag = document.createElement('a');
          tag.href = imageUrl;
          tag.download = 'stories-edit';
          document.body.appendChild(tag);
          tag.click();
          document.body.removeChild(tag);
        }
        xhr.send();
        this.props.template.downloadTemplateURL = null;
        this.props.template.showSpinner = false;
        setTimeout(() => {
          this.props.changeOjbect(this.props.template);
        }, 2000);
        // this.props.changeOjbect(this.props.template);
      }

      if (this.props.template.selectedObject == undefined) {
        previousSelectedObject = -1;
      }
    }, 80);
    return (
      <div className="col-sm-8 pl-0 pr-0">
        <div className="canvas-content">
          <div className="canvas-input">
            {this.props.template.length == 0 ? <div className="canvas-ovely-main">
              <div className="canvas-overlay">CHOOSE A TEMPLATE <br /> TO DESIGN</div>
              <div className="canvas-overlay-second">YOUR<br />STORY</div>
            </div> : null}
            <div className="canvas-input-border top-border-canvas" />
            {/* <input type="file" style={{ backgroundColor: '#000' }} onChange={(e) => this.handleChange(e)} /> */}
            <canvas id="c" className="canvas-self" />
            <div className="canvas-input-border bottom-border-canvas" />
            <p className="powered-tag">
              <img src={ImgPowered} />
              <span className="bison-tag"></span>
              <span className="austin-tag"></span>
              <span className="riffle-tag"></span>
              <span className="montagna-tag"></span>
              <span className="boathouse-tag"></span>
              <span className="quartz-tag"></span>
              <span className="american-typewriter-tag"></span>
              <span className="times-new-roman-tag"></span>
              <span className="grandfather-tag"></span>
              <span className="petralina-tag"></span>
              <span className="carrol-tag "></span>
              <span className="enron-tag"></span>
              <span className="rotrude-tag"></span>
              <span className="kiona-tag"></span>
              <span className="copenhagen-tag"></span>
              <span className="hustle-tag"></span>
              <span className="whestley-tag"></span> </p>
          </div>

          {/* <button onClick={this.handleClick}>check</button> */}
        </div>
        <ActiveTemplateSelector onClick={() => { }} />
      </div>
    )
  }
}

const mapStateToProps = (state: State) => ({
  template: state.template,
  color: state.color,
  text: state.text,
});

const mapDispatchToProps = (dispatch) => ({
  addTextAction: (addText: string) => dispatch(addTextAction(addText)),
  changeOjbect: (data: string) => dispatch(changeOjbect(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(CanvasSection);