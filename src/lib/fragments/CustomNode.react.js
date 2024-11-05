import React, {memo} from 'react';

import PropTypes from 'prop-types';
import {Handle, Position} from 'reactflow';

function CustomNode(props) {
    console.log('custom_node_data', props);

    const {data} = props;

    const {
        data: {name, emoji},
    } = data;

    return (
        <div
            style={{
                padding: '8px 16px',
                borderRadius: 9999,
                border: '2px lightgray solid',
                background: '#f1f1f1',
            }}
        >
            <div style={{display: 'flex', width: 'fit-content', gap: '12px'}}>
                {emoji}
                <div style={{fontWeight: '600', fontSize: '17px'}}>{name}</div>
            </div>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </div>
    );
}

CustomNode.defaultProps = {};

CustomNode.propTypes = {
    data: PropTypes.shape({
        emoji: PropTypes.string,
        name: PropTypes.string,
    }),
};

export default memo(CustomNode);
