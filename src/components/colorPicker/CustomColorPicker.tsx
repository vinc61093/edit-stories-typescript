
import * as React from 'react'
import { ChromePicker, CirclePicker, CustomPicker } from 'react-color'

import './customcolorpicker.css'

interface IProps {
	color: any;
	onChange: any;
}

const sketchPickerStyles = {
	default: {
		picker: {
			width: '32.017vh'
		},
	},
}

export const CustomColorPicker = ({ color, onChange }: any) => {
	return (
		<div>
			<div className="div-style">
					{/* <div className="text-style">BACKGROUND COLOR</div>
					<div  className="text-style-swatch">select a swatch, use color picker, or enter in a hex code</div> */}
				<CirclePicker
					width={302}
					colors={["#f8f0e4","#efdad0","#ded0df","#d8b5a5","#e4afae","#ba867d","#b5c6bd","#739483","#c3d4e4","#434e6a","#d3a255","#b9a695","#726259","#707070","#000000","#ffffff"]}
					circleSize={28}
					circleSpacing={5}
					onChange={onChange}
				/>
				<ChromePicker
					color={color}
					onChange={onChange}
					styles={sketchPickerStyles}
					disableAlpha={true}
				/>
			</div>
		</div>
	)
}

export default CustomPicker(CustomColorPicker)