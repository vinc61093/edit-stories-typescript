import * as React from 'react';
import './loadingSpinner.css';

interface Props {
    flagSpinner: boolean;
}
 
const InnerLoadingSpinerComponent: React.StatelessComponent<Props> = (props) => {
    if (props.flagSpinner) {
        return (
            <div className="modal-container">
                <div className="backdrop"></div>
                <div className="loader la-line-spin-fade-rotating la-dark">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        )
    } else { return null }
}

export const LoadingSpinnerComponent = InnerLoadingSpinerComponent;
