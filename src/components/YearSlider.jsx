import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import Slider from 'rc-slider';
const ToolTipSlider = Slider.createSliderWithTooltip(Slider);

@observer
class YearSlider extends Component {
  onChange = (value) => {
    this.props.store.setYear(value);
  }

  onAfterChange = () => {
    this.props.store.update();
  }

  render() {
    const currentYear = new Date().getFullYear();

    return (
      <div className="py-3">
        <ToolTipSlider
          min={1925}
          max={currentYear}
          onChange={this.onChange}
          onAfterChange={this.onAfterChange}
          value={this.props.store.year}
        />
      </div>
    );
  }
}

YearSlider.propTypes = {
  store: PropTypes.object.isRequired
}

export default YearSlider;
