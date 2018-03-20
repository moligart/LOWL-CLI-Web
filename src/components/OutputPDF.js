import React from 'react';
import PropTypes from 'prop-types';
import { Document, Page } from 'react-pdf/build/entry.webpack';
import './OutputPDF.css';

export default class OutputPDF extends React.PureComponent {
    render() {
        const pageNumber = 1;
        return (
            <div className="OutputPDF-body">
                <Document file={this.props.row.body}>
                    <Page pageNumber={pageNumber} />
                </Document>
            </div>
        );
    }
}

OutputPDF.propTypes = {
    row: PropTypes.shape({
        body: PropTypes.string,
        host: PropTypes.string,
        disabled: PropTypes.bool,
    }).isRequired,
};
