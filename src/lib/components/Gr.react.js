import React from 'react';
import PropTypes from 'prop-types';
import {Gr as RealComponent} from '../LazyLoader';
import {ReactFlowProvider} from 'reactflow';

/**
 * ExampleComponent is an example component.
 * It takes a property, `label`, and
 * displays it.
 * It renders an input with the property `value`
 * which is editable by the user.
 */
const Gr = (props) => {
    return (
        <React.Suspense fallback={null}>
            <ReactFlowProvider>
                <RealComponent {...props} />
            </ReactFlowProvider>
        </React.Suspense>
    );
};

Gr.defaultProps = {};

Gr.propTypes = {
    /**
     * The ID used to identify this component in Dash callbacks.
     */
    id: PropTypes.string,

    /**
     * A label that will be printed when this component is rendered.
     */
    label: PropTypes.string.isRequired,

    /**
     * The value displayed in the input.
     */
    value: PropTypes.string,

    /**
     * Dash-assigned callback that should be called to report property changes
     * to Dash, to make them available for callbacks.
     */
    setProps: PropTypes.func,
};

export default Gr;

export const defaultProps = Gr.defaultProps;
export const propTypes = Gr.propTypes;
