import React from 'react';

// Lightweight native scrollbar wrapper: use native overflow so touch and browser-native
// behaviors (select popups, momentum scrolling) work correctly across devices.
function CustomScrollbar({ children }) {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      {children}
    </div>
  );
}

export default CustomScrollbar;