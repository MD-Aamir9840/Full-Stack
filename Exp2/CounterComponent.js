import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  incrementCounter1,
  decrementCounter1,
  setCounter1,
  resetAll,
  setCounter2,
  setCounter3,
  setCounter4,
  selectAllCounters,
} from './counterSlice';

const CounterComponent = () => {
  const { counter1, counter2, counter3, counter4 } = useSelector(selectAllCounters);
  const dispatch = useDispatch();

  // === FULL SCREEN CONTAINER (100% viewport height, no scroll) ===
  const containerStyle = {
    height: '100vh',
    width: '100vw',
    padding: '10px 20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f2f5',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  // === HEADER (compact) ===
  const headerStyle = {
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: '22px',
    fontWeight: 'bold',
    padding: '8px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flexShrink: 0,
  };

  // === MAIN GRID (2 columns) ===
  const mainGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    flex: 1,
    minHeight: 0,
  };

  // === LEFT COLUMN ===
  const leftColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflow: 'hidden',
  };

  // === RIGHT COLUMN ===
  const rightColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflow: 'hidden',
  };

  // === BOX STYLES (compact) ===
  const boxStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '12px 15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0',
    flexShrink: 0,
  };

  const boxTitleStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '8px',
    paddingBottom: '5px',
    borderBottom: '2px solid #3498db',
  };

  // === COUNTER VALUE BOX (compact) ===
  const counterBoxStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 12px',
    marginBottom: '5px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    borderLeft: '4px solid #3498db',
  };

  const counterLabelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#2c3e50',
  };

  const counterValueStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#3498db',
    padding: '2px 12px',
    backgroundColor: '#e8f4fd',
    borderRadius: '4px',
    minWidth: '50px',
    textAlign: 'center',
  };

  // === BUTTON STYLES (compact) ===
  const buttonGroupStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
    marginTop: '5px',
  };

  const buttonStyle = {
    padding: '5px 12px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flex: '1 1 auto',
    minWidth: '80px',
  };

  const primaryButton = {
    ...buttonStyle,
    backgroundColor: '#3498db',
    color: 'white',
  };

  const successButton = {
    ...buttonStyle,
    backgroundColor: '#2ecc71',
    color: 'white',
  };

  const dangerButton = {
    ...buttonStyle,
    backgroundColor: '#e74c3c',
    color: 'white',
  };

  const warningButton = {
    ...buttonStyle,
    backgroundColor: '#f39c12',
    color: 'white',
  };

  const secondaryButton = {
    ...buttonStyle,
    backgroundColor: '#95a5a6',
    color: 'white',
  };

  // === INPUT STYLES (compact) ===
  const inputGroupStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '5px',
    padding: '8px 12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
  };

  const inputStyle = {
    padding: '5px 10px',
    borderRadius: '4px',
    border: '2px solid #bdc3c7',
    fontSize: '14px',
    width: '80px',
    outline: 'none',
  };

  const inputHintStyle = {
    fontSize: '11px',
    color: '#7f8c8d',
  };

  // === RELATIONSHIP BOX (compact grid) ===
  const relationshipBoxStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
    marginTop: '5px',
  };

  const relationshipItemStyle = {
    padding: '6px',
    backgroundColor: '#e8f4fd',
    borderRadius: '4px',
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: '500',
    color: '#2c3e50',
  };

  // === INDIVIDUAL CONTROL BOX (compact) ===
  const individualControlStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    marginBottom: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
  };

  const individualLabelStyle = {
    fontWeight: 'bold',
    fontSize: '12px',
    minWidth: '80px',
  };

  const individualButtonStyle = {
    padding: '3px 10px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const individualValueStyle = {
    fontSize: '13px',
    fontWeight: 'bold',
    marginLeft: 'auto',
  };

  // === STATUS BOX (compact) ===
  const statusBoxStyle = {
    padding: '8px 12px',
    backgroundColor: '#fff3cd',
    borderRadius: '6px',
    borderLeft: '4px solid #ffc107',
    fontSize: '11px',
  };

  const statusTextStyle = {
    color: '#856404',
    margin: '2px 0',
  };

  // === FLEXIBLE BOX FOR FILLING SPACE ===
  const flexBoxStyle = {
    ...boxStyle,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  };

  const flexBoxContentStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  return (
    <div style={containerStyle}>
      {/* HEADER */}
      <div style={headerStyle}>
        🔄 Multiple Counters with Auto-Sync
      </div>

      {/* MAIN GRID */}
      <div style={mainGridStyle}>
        {/* LEFT COLUMN */}
        <div style={leftColumnStyle}>
          {/* Box 1: Relationships */}
          <div style={boxStyle}>
            <div style={boxTitleStyle}>📊 Relationships</div>
            <div style={relationshipBoxStyle}>
              <div style={relationshipItemStyle}>C2 = C1 × 2</div>
              <div style={relationshipItemStyle}>C3 = C1 + C2</div>
              <div style={relationshipItemStyle}>C4 = (C1 × C2) / 2</div>
            </div>
          </div>

          {/* Box 2: Current Values */}
          <div style={flexBoxStyle}>
            <div style={boxTitleStyle}>📈 Current Values</div>
            <div style={flexBoxContentStyle}>
              <div style={{ ...counterBoxStyle, borderLeftColor: '#3498db' }}>
                <span style={counterLabelStyle}>🔵 Counter 1 (Master)</span>
                <span style={{ ...counterValueStyle, color: '#3498db' }}>{counter1}</span>
              </div>
              <div style={{ ...counterBoxStyle, borderLeftColor: '#2ecc71' }}>
                <span style={counterLabelStyle}>🟢 Counter 2 (2×)</span>
                <span style={{ ...counterValueStyle, color: '#2ecc71' }}>{counter2}</span>
              </div>
              <div style={{ ...counterBoxStyle, borderLeftColor: '#f39c12' }}>
                <span style={counterLabelStyle}>🟡 Counter 3 (Sum)</span>
                <span style={{ ...counterValueStyle, color: '#f39c12' }}>{counter3}</span>
              </div>
              <div style={{ ...counterBoxStyle, borderLeftColor: '#e74c3c' }}>
                <span style={counterLabelStyle}>🔴 Counter 4 (Product/2)</span>
                <span style={{ ...counterValueStyle, color: '#e74c3c' }}>{counter4}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={rightColumnStyle}>
          {/* Box 3: Counter 1 Controls */}
          <div style={boxStyle}>
            <div style={boxTitleStyle}>🎮 Counter 1 Controls (Auto-Sync)</div>
            <div style={buttonGroupStyle}>
              <button style={primaryButton} onClick={() => dispatch(incrementCounter1())}>
                ➕ Inc
              </button>
              <button style={dangerButton} onClick={() => dispatch(decrementCounter1())}>
                ➖ Dec
              </button>
              <button style={successButton} onClick={() => dispatch(setCounter1(5))}>
                Set 5
              </button>
              <button style={warningButton} onClick={() => dispatch(setCounter1(10))}>
                Set 10
              </button>
              <button style={secondaryButton} onClick={() => dispatch(resetAll())}>
                🔄 Reset
              </button>
            </div>
            <div style={inputGroupStyle}>
              <label style={{ fontWeight: '600', fontSize: '12px', color: '#2c3e50' }}>
                Custom:
              </label>
              <input 
                type="number" 
                style={inputStyle}
                placeholder="Value"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      dispatch(setCounter1(value));
                      e.target.value = '';
                    }
                  }
                }}
              />
              <span style={inputHintStyle}>Press Enter</span>
            </div>
          </div>

          {/* Box 4: Individual Controls */}
          <div style={flexBoxStyle}>
            <div style={boxTitleStyle}>🎯 Individual Controls</div>
            <div style={flexBoxContentStyle}>
              {/* Counter 2 */}
              <div style={{ ...individualControlStyle, backgroundColor: '#f0fdf4', border: '1px solid #d1fae5' }}>
                <span style={{ ...individualLabelStyle, color: '#065f46' }}>🟢 C2</span>
                <button style={{ ...individualButtonStyle, backgroundColor: '#10b981', color: 'white' }} 
                  onClick={() => dispatch(setCounter2(counter2 + 1))}>+1</button>
                <button style={{ ...individualButtonStyle, backgroundColor: '#10b981', color: 'white' }} 
                  onClick={() => dispatch(setCounter2(counter2 - 1))}>-1</button>
                <button style={{ ...individualButtonStyle, backgroundColor: '#10b981', color: 'white' }} 
                  onClick={() => dispatch(setCounter2(100))}>100</button>
                <span style={{ ...individualValueStyle, color: '#065f46' }}>{counter2}</span>
              </div>

              {/* Counter 3 */}
              <div style={{ ...individualControlStyle, backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
                <span style={{ ...individualLabelStyle, color: '#78350f' }}>🟡 C3</span>
                <button style={{ ...individualButtonStyle, backgroundColor: '#f59e0b', color: 'white' }} 
                  onClick={() => dispatch(setCounter3(counter3 + 1))}>+1</button>
                <button style={{ ...individualButtonStyle, backgroundColor: '#f59e0b', color: 'white' }} 
                  onClick={() => dispatch(setCounter3(counter3 - 1))}>-1</button>
                <button style={{ ...individualButtonStyle, backgroundColor: '#f59e0b', color: 'white' }} 
                  onClick={() => dispatch(setCounter3(200))}>200</button>
                <span style={{ ...individualValueStyle, color: '#78350f' }}>{counter3}</span>
              </div>

              {/* Counter 4 */}
              <div style={{ ...individualControlStyle, backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                <span style={{ ...individualLabelStyle, color: '#991b1b' }}>🔴 C4</span>
                <button style={{ ...individualButtonStyle, backgroundColor: '#ef4444', color: 'white' }} 
                  onClick={() => dispatch(setCounter4(counter4 + 1))}>+1</button>
                <button style={{ ...individualButtonStyle, backgroundColor: '#ef4444', color: 'white' }} 
                  onClick={() => dispatch(setCounter4(counter4 - 1))}>-1</button>
                <button style={{ ...individualButtonStyle, backgroundColor: '#ef4444', color: 'white' }} 
                  onClick={() => dispatch(setCounter4(50))}>50</button>
                <span style={{ ...individualValueStyle, color: '#991b1b' }}>{counter4}</span>
              </div>
            </div>
          </div>

          {/* Box 5: Status */}
          <div style={boxStyle}>
            <div style={statusBoxStyle}>
              <div style={statusTextStyle}>
                <span style={{ color: '#3498db' }}>●</span> 
                <strong> C1</strong> auto-syncs all
              </div>
              <div style={statusTextStyle}>
                <span style={{ color: '#10b981' }}>●</span> 
                <strong> C2, C3, C4</strong> independent
              </div>
              <div style={{ ...statusTextStyle, fontWeight: 'bold', color: '#ff6b6b' }}>
                ⚡ Try C1 Increment!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterComponent;