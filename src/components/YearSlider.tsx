import React from 'react';
import { observer } from 'mobx-react-lite';
import Slider from 'rc-slider';
import DataStore from '../stores/DataStore';

interface YearSliderProps {
  store: DataStore;
}

const YearSlider: React.FC<YearSliderProps> = observer(({ store }) => {
  const currentYear = new Date().getFullYear();

  const handleChange = (value: number | number[]) => {
    if (typeof value === 'number') {
      store.setYear(value);
    }
  };

  const handleAfterChange = () => {
    store.update();
  };

  return (
    <div className="py-3">
      <Slider
        min={1925}
        max={currentYear}
        value={store.year}
        onChange={handleChange}
        onChangeComplete={handleAfterChange}
        handleRender={(node, props) => {
          return (
            <div {...node.props} style={{ ...node.props.style, position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '-28px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#4C9DD5',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none'
                }}
              >
                {props.value}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
});

export default YearSlider;
