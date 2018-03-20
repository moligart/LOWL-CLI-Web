import React from 'react';
import PropTypes from 'prop-types';
import './OutputImage.css';

export default class OutputImage extends React.PureComponent {
    render() {
        return (
            <div className="OutputImage-body">
                <img src={this.props.row.body} alt="opti" />
            </div>
        );
    }
}

OutputImage.propTypes = {
    row: PropTypes.shape({
        body: PropTypes.string,
        host: PropTypes.string,
        disabled: PropTypes.bool,
    }).isRequired,
};
