
import * as React from 'react'
import * as Cookies from 'es-cookie';
import { State } from '../../reducers';
import TemplateSection from '../templateSection/TemplateSection'
import CustomColorPicker from '../colorPicker/CustomColorPicker'
import QuickEditComponents from '../quickEditComponents/quickEditComponents'
import TextPicker from '../textPicker/TextPicker'
import OwlCarousel from 'react-owl-carousel2';
import "react-owl-carousel2/src/owl.carousel.css";
import "react-owl-carousel2/src/owl.theme.default.css";
import "bootstrap/dist/css/bootstrap.css";
import './sideDrawer.css';
import { connect } from 'react-redux';
import { changeColorAction, addTextAction, changeOjbect } from './actions';
import { store } from '../../store'
import { resetTemplate } from '../Header/actions';
import { fetchTemplatesStartAction, fetchAccountsCompletedAction, fetchAccountsStartAction } from '../templates/actions';
import * as ReactGA from 'react-ga';
import * as EXIF from 'exif-js';
import { Account } from '../../model';

let loginUrl: string = 'https://www.planoly.com/login?storiesedit=1';
if (window.location.hostname.indexOf('staging') !== -1) {
  loginUrl = 'https://staging.planoly.com/login?storiesedit=1';
}
else if (window.location.hostname.indexOf('preprod') !== -1) {
  loginUrl = 'https://preprod.planoly.com/login?storiesedit=1';
}
else if (window.location.hostname.indexOf('localhost') !== -1) {
  loginUrl = 'http://local.planoly.com/login?storiesedit=1';
}

interface IProps {
  templates: any;
  onClick: any;
  color: any;
  template: any;
  accounts: any;
  changeColorAction: (value: string) => void;
  addTextAction: (value: any) => void;
  changeOjbect: (value: any) => void;
  resetTemplate: () => void,
  fetchTemplates: () => void,
  fetchAccountsComplete: (accounts: Account[]) => void,
  fetchAccounts: () => void
}

interface IState {
  sectionSelect: string;
  display: string;
  items: any;
  shapeColor: string;
  showRemove: boolean;
}

class SideDrawer extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { sectionSelect: "addBackground", display: "template", items: [], shapeColor: '#000000', showRemove: false };
    this.handleSectionChange = this.handleSectionChange.bind(this)
    this.handleTemplateClick = this.handleTemplateClick.bind(this)
    this.handleFitToScale = this.handleFitToScale.bind(this)
    this.handleFullSizeImage = this.handleFullSizeImage.bind(this)
    this.handleRemoveImage = this.handleRemoveImage.bind(this)
    setInterval(() => {
      const token = Cookies.get('auth_token');
      if (!token && this.props.accounts) {
        this.props.fetchAccounts();
        
      }
    }, 1000);
  }

  public componentDidMount() {
    window.onbeforeunload = () => 'You are about to lose your work. Are you sure you want to continue?';
  }

  public onSectionClicked = data => {
    this.setState({ display: data })
  }

  public onTextButtonClicked = data => {

    if (data == "txtOneDis") {
      this.props.template.txtOneDis = true;
      this.props.changeOjbect(this.props.template);
    } else if (data == "txtTwoDis") {
      this.props.template.txtTwoDis = true;
      this.props.changeOjbect(this.props.template);
    } else if (data == "txtThreeDis") {
      this.props.template.txtThreeDis = true;
      this.props.changeOjbect(this.props.template);
    }
    let top;
    if (data == 'txtOneDis') top = 150;
    else if (data == 'txtTwoDis') top = 300;
    else top = 450;
    const textObject = {
      id: data,
      align: "center",
      name: data,
      backgroundColor: "",
      charSpacing: 0,
      fill: "#000000",
      left: 70,
      lineSpacing: 1.16,
      capitalize: false,
      text: "Click and Type", textSize: 40, top: top, width: 270, type: "Textbox",
      objectType: 'text',
      lockRotation: true,
      hasRotatingPoint: false,
      external: false,
      internal: true,
      selectable: true,
    }

    const objects = [...this.props.template.objects, textObject]

    store.dispatch({
      type: 'ADD_TEXT',
      payload: { objects, selectedObject: objects.length - 1 }
    })
  }

  public buttonClick = (): void => {
    this.setState({ display: "edit" })
  }

  public handleColorChange = data => {
    this.props.changeColorAction(data.hex)
  }

  public handleFontColorChange = data => {
    this.props.template.objects[this.props.template.selectedObject][`${'fill'}`] = data.hex;
    this.props.changeOjbect(this.props.template);
  }

  public handleShapeColorChange = data => {
    this.setState({ shapeColor: data.hex })
    if (this.props.template.objects[this.props.template.selectedObject].fill == "#ffffff00") {
      this.props.template.objects[this.props.template.selectedObject].stroke = data.hex
    } else {
      this.props.template.objects[this.props.template.selectedObject].fill = data.hex
      this.props.template.objects[this.props.template.selectedObject].stroke = data.hex
    }
    this.props.changeOjbect(this.props.template)
  }

  public handleSectionChange(e, data: string) {
    this.props.template.sectionSelect = data;
    this.props.changeOjbect(this.props.template);
  }

  public handleTemplateClick(data: any) {
    this.setState({ display: "edit" })
    this.props.onClick(data)
  }

  public onShapeClick = data => {
    var expr = data;
    let shapeObject = {};
    switch (expr) {
      case 'solidSquare':
        shapeObject = {
          left: 40,
          top: 105,
          width: 50,
          height: 50,
          fill: '#000000',
          stroke: '#000000',
          strokeWidth: 2,
          type: 'rect',
          roundedCorner: false,
          id: 'custom',
        };
        break;
      case 'solidTriangle':
        shapeObject = {
          left: 40,
          top: 70,
          width: 50,
          height: 50,
          fill: '#000000',
          stroke: '#000000',
          strokeWidth: 2,
          type: 'triangle',
          roundedCorner: false,
          id: 'custom',
        }
        break;
      case 'emptyTriangle':
        shapeObject = {
          left: 40,
          top: 70,
          width: 50,
          height: 50,
          fill: 'transparent',
          stroke: '#000000',
          strokeWidth: 2,
          type: 'triangle',
          roundedCorner: false,
          id: 'custom',
        }
        break;
      case 'solidRoundedSquare':
        shapeObject = {
          left: 40,
          top: 105,
          width: 50,
          height: 50,
          rx: 15,
          ry: 15,
          fill: '#000000',
          stroke: '#000000',
          strokeWidth: 2,
          type: 'rect',
          roundedCorner: true,
          id: 'custom',
        }
        break;
      case 'solidCircle':
        shapeObject = {
          left: 40,
          top: 60,
          radius: 50,
          fill: '#000000',
          stroke: '#000000',
          strokeWidth: 2,
          type: 'circle',
          roundedCorner: true,
          id: 'custom',
        }
        break;
      case 'solidRectangle':
        shapeObject = {
          left: 40,
          top: 80,
          width: 50,
          height: 100,
          fill: '#000000',
          stroke: '#000000',
          strokeWidth: 2,
          type: 'rect',
          roundedCorner: false,
          id: 'custom',
        }
        break;
      case 'emptyCircle':
        shapeObject = {
          left: 40,
          top: 65,
          radius: 50,
          fill: '#ffffff00',
          stroke: '#000000',
          strokeWidth: 2,
          type: 'circle',
          roundedCorner: true,
          id: 'custom',
        }
        break;
      case 'emptyRectangle':
        shapeObject = {
          left: 40,
          top: 105,
          width: 50,
          height: 100,
          fill: '#ffffff00',
          stroke: '#000000',
          strokeWidth: 2,
          type: 'rect',
          roundedCorner: false,
          id: 'custom',
        }
        break;
      case 'emptyRoundedRectangle':
        shapeObject = {
          left: 40,
          top: 105,
          width: 100,
          height: 50,
          rx: 15,
          ry: 15,
          fill: '#ffffff00',
          stroke: '#000000',
          strokeWidth: 2,
          type: 'rect',
          roundedCorner: true,
          id: 'custom',
        }
        break;
      case 'solidRoundedRectangle':
        shapeObject = {
          left: 40,
          top: 105,
          width: 100,
          height: 50,
          rx: 15,
          ry: 15,
          fill: '#000000',
          stroke: '#000000',
          strokeWidth: 2,
          type: 'rect',
          roundedCorner: true,
          id: 'custom',
        }
        break;
      case 'emptyRoundedSquare':
        shapeObject = {
          left: 40,
          top: 105,
          width: 50,
          height: 50,
          rx: 15,
          ry: 15,
          fill: '#ffffff00',
          stroke: '#000000',
          strokeWidth: 2,
          type: 'rect',
          roundedCorner: true,
          id: 'custom',
        }
        break;
      case 'emptySquare':
        shapeObject = {
          left: 40,
          top: 105,
          width: 50,
          height: 50,
          fill: '#ffffff00',
          stroke: '#000000',
          strokeWidth: 2,
          type: 'rect',
          roundedCorner: false,
          id: 'custom',
        }
        break;
      default:
        console.log('Sorry, no shapes avaliable');
    }
    shapeObject['objectType'] = 'shape'
    shapeObject['internal'] = true
    shapeObject['external'] = false
    shapeObject['lockRotation'] = true
    shapeObject['hasRotatingPoint'] = false
    const objects = [...this.props.template.objects, shapeObject]
    store.dispatch({
      type: 'ADD_SHAPE',
      payload: { objects, selectedObject: objects.length - 1 }
    })
  }

  downloadImage = () => {
    this.props.template.showSpinner = true;
    this.props.template.downloadTemplate = true;
    this.props.changeOjbect(this.props.template);
  }

  sendToPlanoly = () => {
    let authToken = Cookies.get('auth_token');
    if (authToken && this.props.accounts && this.props.accounts.length > 0) {
      this.props.template.showAccountPicker = true;
      this.props.changeOjbect(this.props.template);
    } 
    else {
      const postMessageHandler = (e) => {
        if (e.origin.indexOf('planoly.com') !== -1 && e.data.authToken) {
          window.removeEventListener('message', postMessageHandler);
          Cookies.set('auth_token', e.data.authToken, {
            expires: 60 * 60 * 24 * 30
          });
          this.props.fetchAccountsComplete(e.data.accounts);
          this.sendToPlanoly();
        }
      }

      window.addEventListener('message', postMessageHandler, false);

      let clientWidth = window.screen.width;
      let clientHeight = window.screen.height;

      let w: number = clientWidth > 1200 ? 1200 : clientWidth,
			    h: number = clientHeight > 800 ? 800 : clientHeight,
			    left: number = (clientWidth/2) - (w/2),
          top: number = (clientHeight/2) - (h/2);
          
        const win = window.open(loginUrl, 'Planoly - Log In', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);          
    }   
  }

  public resetTemplate = () => {
    if (confirm('You are about to lose your work. Are you sure you want to continue?')) {
      this.props.resetTemplate();
      this.props.fetchTemplates();
      this.setState({ display: "template" })
      ReactGA.event({
        category: 'StoriesEdit',
        action: 'Delete Template'
      });
    }
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

  handleDeleteText = () => {
    if (this.props.template.objects[this.props.template.selectedObject].objectType == 'text' && this.props.template.objects[this.props.template.selectedObject].internal == true) {
      let id = this.props.template.objects[this.props.template.selectedObject].id;
      this.props.template[`${id}`] = !this.props.template[`${id}`];
    }

    this.props.template.objects.splice(this.props.template.selectedObject, 1);
    this.props.template.selectedObject = -1;
    this.props.changeOjbect(this.props.template);
  }

  handleChange = (e) => {
    e.preventDefault();
    let selectedObject = this.props.template.selectedObject;
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onload = function (f: any) {
      EXIF.getData(file, function () {
        if (typeof this.exifdata.Orientation !== 'undefined') {
          let orientation = this.exifdata.Orientation;
          let img = new Image();
          img.src = f.target.result;
          img.onload = function () {
            let width = img.width,
              height = img.height,
              canvas = document.createElement('canvas'),
              ctx = canvas.getContext('2d');

            // set proper canvas dimensions before transform & export
            if (4 < orientation && orientation < 9) {
              canvas.width = height;
              canvas.height = width;
            } else {
              canvas.width = width;
              canvas.height = height;
            }

            // transform context before drawing image
            switch (orientation) {
              case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
              case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
              case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
              case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
              case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
              case 7: ctx.transform(0, -1, -1, 0, height, width); break;
              case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
              default: break;
            }

            // draw image
            ctx.drawImage(img, 0, 0);
            store.dispatch({
              type: 'ADD_IMAGE',
              payload: canvas.toDataURL(file.type, 2.5)
            });
          }
        }
        else {
          store.dispatch({
            type: 'ADD_IMAGE',
            payload: f.target.result
          });
        }
      });
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  }

  handleFitToScale() {
    store.dispatch({
      type: 'IMAGE_SCALE',
      payload: 'fitToScale'
    })
  }

  handleFullSizeImage() {
    store.dispatch({
      type: 'IMAGE_SCALE',
      payload: 'showFullSizeImage'
    })
  }

  handleRandomSize() {
    store.dispatch({
      type: 'IMAGE_SCALE',
      payload: '16_9'
    })
  }

  public handleRemoveImage() {
    store.dispatch({
      type: 'REMOVE_IMAGE'
    });
  }

  render() {
    let mycolor: any = "";
    mycolor = this.props.template.background
    if (mycolor == undefined) {
      mycolor = "red"
    } else {
      mycolor = this.props.template.background
    }
    const { display, sectionSelect, showRemove } = this.state;
    const options = {
      items: 7,
      nav: true,
      rewind: false,
      autoplay: false,
      dots: false,
      navText: [`<svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
      width='988.557px' height='1837.1px' viewBox='0 0 988.557 1837.1' enable-background='new 0 0 988.557 1837.1'
      xml:space='preserve'>
   <polygon points='140.711,918.547 988.548,70.71 917.839,0 0.004,917.834 0.725,918.555 0.012,919.267 917.841,1837.097 
     988.552,1766.386 '/>
   </svg>`, `<svg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'
      width='988.557px' height='1837.1px' viewBox='0 0 988.557 1837.1' enable-background='new 0 0 988.557 1837.1'
      xml:space='preserve'>
   <polygon points='988.55,917.84 70.717,0.006 0.007,70.716 847.843,918.552 0.01,1766.384 70.719,1837.095 988.548,919.267 
     987.835,918.554 '/>
   </svg>`]
    };
    let selectedObject = this.props.template.selectedObject;
    let ac = null;
    if (selectedObject > -1) {
      ac = this.props.template.objects[selectedObject]
    }

    const fonts = [
      'American Typewriter',
      'Austin',
      'Riffle',
      'Montagna',
      'Bison',
      'Grandfather',
      'Boathouse',
      'Liber',
      'Quartz',
      'Times New Roman'
    ];

    // const selectedFont = this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject].fontFamily : 'Bison';
    const selectedFont = this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject] != undefined ? this.props.template.objects[selectedObject].fontFamily : 'Bison' : 'Bison'

    return (
      <div className="col-sm-4 pr-0 pl-0">
        <div className="navbar">
          {
            display === 'edit' ? (
              <div className="d-block text-center w-100" style={{ lineHeight: 'normal' }}>
                <i className="far fa-arrow-alt-circle-left" onClick={this.resetTemplate} style={{ float: 'left', marginTop: 2, cursor: 'pointer' }}></i>
                <a className="nav-item" onClick={() => this.onSectionClicked("edit")}>DESIGN YOUR STORY</a>
              </div>
            ) : (
                <div className="d-block text-center w-100">
                  <a className="nav-item" onClick={() => this.onSectionClicked("template")}>CHOOSE A TEMPLATE</a>
                </div>
              )
          }
        </div>
        <div className={(Object.keys(this.props.template).length != 0) ? "template-divs" : "template-divs template-selection"}>
          {(Object.keys(this.props.template).length > 0) ?
            <div>
              <QuickEditComponents
                onclick={this.handleSectionChange}
                template={this.props.template}
              />
              {this.props.template.sectionSelect == "addBackground" ? <div>
                <div className="txt-div">
                  <div style={{ fontSize: '1.280vh', letterSpacing: 1.5 }}>BACKGROUND COLOR</div>
                  <div style={{ fontSize: '1.280vh', letterSpacing: 1.5, fontStyle: 'italic' }}><em style={{ fontFamily: 'Freight Big W01 Semibold Italic', color: '#000' }}>select a swatch, use color picker, or enter in a hex code</em></div>
                  <CustomColorPicker
                    color={mycolor}
                    onChange={this.handleColorChange}
                  />
                </div>
              </div> : null}
              {this.props.template.sectionSelect == "addText" ? <div className="txt-div">
                <div style={{ fontSize: '1.280vh', letterSpacing: 1.5 }}>TEXT</div>
                <div style={{ fontSize: '1.280vh', letterSpacing: 1.5, fontStyle: 'italic' }}><em style={{ fontFamily: 'Freight Big W01 Semibold Italic', color: '#000' }}>add text to tell your story</em></div>
                <div className="txt-picker-div">
                  <TextPicker
                    text="Text 1"
                    onclickme={() => this.onTextButtonClicked("txtOneDis")}
                    disableValue={this.props.template.txtOneDis}
                    classname={selectedObject > -1 ? this.props.template.objects[selectedObject].name == "txtOneDis" ? "selected" : "" : ""}
                  />
                  <TextPicker
                    text="Text 2"
                    onclickme={() => this.onTextButtonClicked("txtTwoDis")}
                    disableValue={this.props.template.txtTwoDis}
                    classname={selectedObject > -1 ? this.props.template.objects[selectedObject].name == "txtTwoDis" ? "selected" : "" : ""}
                  />
                  <TextPicker
                    text="Text 3"
                    onclickme={() => this.onTextButtonClicked("txtThreeDis")}
                    disableValue={this.props.template.txtThreeDis}
                    classname={selectedObject > -1 ? this.props.template.objects[selectedObject].name == "txtThreeDis" ? "selected" : "" : ""}
                  />
                </div>
                {this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject] != undefined && ac.objectType == 'text' ?
                  <button type="button" className="btn btn-blk" onClick={this.handleDeleteText}>Delete Text</button>
                  : null : null}
                <div className="textControls">
                  <div className="text-wrapper">
                    <div id="text-controls">
                      <div>
                        <label style={{ paddingRight: 10 }} id="text-font-space">FONT:</label>
                        <div className="selectstyled first">
                          <select style={{ backgroundColor: 'lightgray' }} id="font-family" onChange={(event) => this.handleFontStyles(event, 'fontFamily')} value={selectedFont}>
                            {
                              fonts.map(font => <option value={font} key={font}>{font}</option>)
                            }
                          </select>
                        </div>
                        <label style={{ paddingRight: 10 }} id="text-font-space">FONT SIZE:</label>
                        <div className="selectstyled">
                          <select style={{ backgroundColor: 'lightgray' }} id="txt-space" onChange={(event) => this.handleFontStyles(event, 'fontSize')} value={this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject].fontSize : 0}>
                            {
                              Array.from(Array(71).keys()).map(size => <option value={size + 10} key={size + 10}>{size + 10}</option>)
                            }
                          </select>
                        </div>
                      </div>

                      <div>
                        <label style={{ paddingRight: 10 }} id="text-font-space">SPACING:</label>
                        <div className="selectstyled">
                          <select style={{ backgroundColor: 'lightgray' }} id="txt-space" onChange={(event) => this.handleFontStyles(event, 'charSpacing')} value={this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject].charSpacing : 12}>
                            {
                              Array.from(Array(51).keys()).map(size => <option value={size * 12} key={size}>{size}</option>)
                            }
                          </select>
                        </div>
                        <label style={{ paddingRight: 10 }} id="text-font-space">LINE HEIGHT:</label>
                        <div className="selectstyled">
                          <select style={{ backgroundColor: 'lightgray' }} id="txt-space" onChange={(event) => this.handleFontStyles(event, 'lineHeight')} value={this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject].lineHeight : 1}>
                            <option value="1">1</option>
                            <option value="1.5">1.5</option>
                            <option value="2">2</option>
                            <option value="2.5">2.5</option>
                            <option value="3">3</option>
                            <option value="3.5">3.5</option>
                            <option value="4">4</option>
                            <option value="4.5">4.5</option>
                            <option value="5">5</option>
                          </select>
                        </div>

                      </div>

                      <div>
                        <span style={this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject] != undefined ? this.props.template.objects[selectedObject].fontWeight == 'bold' ? { color: '#000' } : { color: '#808080' } : { color: '#808080' } : { color: '#808080' }} id="btnBold">
                          <a onClick={(event) => this.handleFontStyles(event, 'fontWeight')}><b className="fas fa-bold"></b></a>
                        </span>
                        <span style={this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject] != undefined ? this.props.template.objects[selectedObject].fontStyle == 'italic' ? { color: '#000' } : { color: '#808080' } : { color: '#808080' } : { color: '#808080' }} id="btnItalic">
                          <a onClick={(event) => this.handleFontStyles(event, 'fontStyle')}><b className="fas fa-italic"></b></a>
                        </span>
                        <span style={this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject] != undefined ? this.props.template.objects[selectedObject].capitalize == true ? { color: '#000' } : { color: '#808080' } : { color: '#808080' } : { color: '#808080' }} id="btnTT">
                          <a onClick={(event) => this.handleFontStyles(event, 'capitalize')}>TT</a>
                        </span>
                        <span>
                          <span style={this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject] != undefined ? this.props.template.objects[selectedObject].textAlign == 'left' ? { color: '#000' } : { color: '#808080' } : { color: '#808080' } : { color: '#808080' }} id="left">
                            <b onClick={(event) => this.handleFontStyles(event, 'textAlign', 'left')} className="fas fa-align-left"></b>
                          </span>
                          <span style={this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject] != undefined ? this.props.template.objects[selectedObject].textAlign == 'center' ? { color: '#000' } : { color: '#808080' } : { color: '#808080' } : { color: '#808080' }} id="center">
                            <b onClick={(event) => this.handleFontStyles(event, 'textAlign', 'center')} className="fas fa-align-center"></b>
                          </span>
                          <span style={this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject] != undefined ? this.props.template.objects[selectedObject].textAlign == 'right' ? { color: '#000' } : { color: '#808080' } : { color: '#808080' } : { color: '#808080' }} id="right">
                            <b onClick={(event) => this.handleFontStyles(event, 'textAlign', 'right')} className="fas fa-align-right"></b>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <CustomColorPicker
                    color={this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject] != undefined && this.props.template.objects[this.props.template.selectedObject].objectType == "text" ? this.props.template.objects[this.props.template.selectedObject].fill : '#000' : '#000'}
                    // color={this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject].fill : '#000'}
                    onChange={this.handleFontColorChange}
                    disableAlpha={true}
                  />
                </div>
              </div> : null}
              {this.props.template.sectionSelect == "addShapes" ? <div className="shape-slider">
                <div className="txt-div">
                  <div style={{ fontSize: '1.280vh', letterSpacing: 1.5 }}>SHAPES</div>
                  <div style={{ fontSize: '1.280vh', letterSpacing: 1.5, fontStyle: 'italic', marginBottom: 15 }}><em style={{ fontFamily: 'Freight Big W01 Semibold Italic', color: '#000' }}>add one or more shapes, rotate, re-size arrange</em></div>
                  <OwlCarousel
                    options={options}
                  >
                    <img src={require('../../images/shapes/SolidSquare.png')} onClick={() => this.onShapeClick("solidSquare")} />
                    <img src={require('../../images/shapes/emptySquare.png')} onClick={() => this.onShapeClick("emptySquare")} />
                    <img src={require('../../images/shapes/SolidRoundedSquare.png')} onClick={() => this.onShapeClick("solidRoundedSquare")} />
                    <img src={require('../../images/shapes/emptyRoundedSquare.png')} onClick={() => this.onShapeClick("emptyRoundedSquare")} />
                    <img src={require('../../images/shapes/SolidCircle.png')} onClick={() => this.onShapeClick("solidCircle")} />
                    <img src={require('../../images/shapes/emptyCircle.png')} onClick={() => this.onShapeClick("emptyCircle")} />
                    <img src={require('../../images/shapes/SolidTriangle.png')} onClick={() => this.onShapeClick("solidTriangle")} />
                    <img src={require('../../images/shapes/emptyTriangle.png')} onClick={() => this.onShapeClick("emptyTriangle")} />
                    <img src={require('../../images/shapes/SolidRectangle.png')} onClick={() => this.onShapeClick("solidRectangle")} />
                    <img src={require('../../images/shapes/emptyRectangle.png')} onClick={() => this.onShapeClick("emptyRectangle")} />
                    <img src={require('../../images/shapes/SolidRoundedRectangle.png')} onClick={() => this.onShapeClick("solidRoundedRectangle")} />
                    <img src={require('../../images/shapes/emptyRoundedRectangle.png')} onClick={() => this.onShapeClick("emptyRoundedRectangle")} />
                    {/* <img src={require('../../images/shapes/SolidLine.png')} onClick={() => this.onShapeClick("solidLine")} />
									<img src={require('../../images/shapes/SolidOval.png')} onClick={() => this.onShapeClick("solidOval")} />
									<img src={require('../../images/shapes/emptyLine.png')} onClick={() => this.onShapeClick("emptyLine")} />
									<img src={require('../../images/shapes/emptyOval.png')} onClick={() => this.onShapeClick("emptyOval")} />*/}
                  </OwlCarousel>
                  {this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject] != undefined && ac.objectType == 'shape' && ac.internal == true ?
                    <button type="button" className="btn btn-blk" onClick={this.handleDeleteText}>Delete Shape</button>
                    : null : null}
                  <CustomColorPicker
                    color={this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject] != undefined && this.props.template.objects[this.props.template.selectedObject].objectType == "shape" ? this.props.template.objects[this.props.template.selectedObject].stroke : '#000' : '#000'}
                    onChange={this.handleShapeColorChange}
                  />
                </div>
              </div> : null}
              {
                  this.props.template.sectionSelect == "addImage" ? (
                    this.props.template.selectedObject === -1 ? (
                      <div className="txt-div">
                        <div className="select-image-container">click an image container to add an image</div>
                      </div>  
                    ) : (
                      <div className="txt-div">
                        <div className="mediaControls"><input type="file" accept="image/png,image/jpeg,image/jpg" style={{ backgroundColor: '#000' }} onChange={(e) => this.handleChange(e)} /><div>Choose Your Image</div></div>
                        { this.props.template.selectedObject > -1 ? this.props.template.objects[selectedObject] != undefined && this.props.template.objects[this.props.template.selectedObject].type == 'image' ? <button type="button" className="btn btn-blk" onClick={this.handleRemoveImage}>Remove Image</button> : null : null }
                        <div className="imgbtndiv">
                          <button type="button" className="btn btn-bg" onClick={this.handleFitToScale}>Fit To Scale</button>
                          <button type="button" className="btn btn-bg" onClick={this.handleFullSizeImage}>Full size</button>
                          <button type="button" className="btn btn-bg" onClick={this.handleRandomSize}>16:9	</button>
                        </div>
                      </div>
                    )
                  ) : null
              }
            </div>
            : <div className="template-center">
              <TemplateSection
                onClick={this.handleTemplateClick}
              />
            </div>}
        </div>
        <div className="tabpan-footer" style={(Object.keys(this.props.template).length != 0) ? {} : { display: 'none' }}>
          <div className="row">
            <div className="col">
              <a className="btn-trans" style={{ cursor: 'pointer' }} onClick={this.resetTemplate}>
                <span className="icon">
                  <img src={require('../../images/trash.svg')} className="img-class" height="20" />
                  <img src={require('../../images/trash-white.svg')} className="img-class-hover" height="20" />
                </span>
                DELETE
							</a>
            </div>
            <div className="col">
              <a className="btn-trans" style={{ cursor: 'pointer' }} onClick={this.downloadImage}>
                <span className="icon icon-download">
                  <img src={require('../../images/download.svg')} className="img-class" height="20" />
                  <img src={require('../../images/download-white.svg')} className="img-class-hover" height="20" />
                </span>
                DOWNLOAD
              </a>
            </div>
            {
              <div className="col">
                <a className="btn-trans" style={{ cursor: 'pointer' }} onClick={this.sendToPlanoly}>
                  <span className="icon">
                    <img src={require('../../images/planoly.png')} className="img-class" height="20" />
                    <img src={require('../../images/planoly-white.png')} className="img-class-hover" height="20" />
                  </span>
                  SEND TO PLANOLY
                </a>
              </div>
            }
            <img hidden src={require('../../images/favicon.png')} className="img-class" />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State) => ({
  templates: state.templates,
  template: state.template,
  color: state.color,
  accounts: state.accounts
});

const mapDispatchToProps = (dispatch) => ({
  changeColorAction: (color: string) => dispatch(changeColorAction(color)),
  addTextAction: (addText: string) => dispatch(addTextAction(addText)),
  changeOjbect: (data: string) => dispatch(changeOjbect(data)),
  resetTemplate: () => dispatch(resetTemplate()),
  fetchTemplates: () => dispatch(fetchTemplatesStartAction()),
  fetchAccountsComplete: (accounts: Account[]) => dispatch(fetchAccountsCompletedAction(accounts)),
  fetchAccounts: () => dispatch(fetchAccountsStartAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(SideDrawer);
