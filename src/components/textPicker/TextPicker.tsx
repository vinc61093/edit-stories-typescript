
import * as React from 'react'

import './textpicker.css'

export const TextPicker = ({ onclickme, text, disableValue, classname }: any) => {
	classname!=undefined?classname = 'btn-trans ' + classname:classname='btn-trans';
	return (
		<div onClick={onclickme}>
			<div className="div-style">
				<button className={classname} disabled={disableValue} >{text}</button>
			</div>
		</div>
	)
}

export default (TextPicker)