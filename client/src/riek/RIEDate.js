import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import RIEStatefulBase from './RIEStatefulBase';

const debug = require('debug')('RIEDate');

export default class RIEDate extends RIEStatefulBase {
    componentDidUpdate = (prevProps, prevState) => {
        debug(`componentDidUpdate(${prevProps}, ${prevState})`)
        var inputElem = ReactDOM.findDOMNode(this.refs.input);
        debug(inputElem)
        if (this.state.editing && !prevState.editing) {
            debug('entering edit mode')
            inputElem.focus();
        } else if (this.state.editing && prevProps.text != this.props.text) {
            debug('not editing && text not equal previous props -- finishing editing')
            this.finishEditing();
        }
    };
    renderEditingComponent = () => {
        return <input
                type="date"
                disabled={this.state.loading}
                className={this.makeClassString()}
                defaultValue={this.props.value}
                onInput={this.textChanged}
                onBlur={this.elementBlur}
                ref="input"
                onKeyDown={this.keyDown}
                {...this.props.editProps} />;
    };

    renderNormalComponent = () => {
        if (this.props.value == null){
            return <span
                tabIndex="0"
                className={this.makeClassString()}
                onFocus={this.startEditing}
                onClick={this.startEditing}
                {...this.props.defaultProps}>select date</span>;      
        }
        else{
            return <span
                tabIndex="0"
                className={this.makeClassString()}
                onFocus={this.startEditing}
                onClick={this.startEditing}
                {...this.props.defaultProps}>{this.state.newValue || this.props.value}</span>;      
        }
    };
}
