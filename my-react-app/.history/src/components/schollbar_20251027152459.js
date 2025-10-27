import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

// Đổi kiểu thumb
const CustomThumb = (props) => (
  <div {...props} className="bg-slate-500 rounded-full" />
);

// CustomScrollbar
function CustomScrollbar({ children }) {
  return (
    <Scrollbars
      renderThumbVertical={CustomThumb}
      style={{ width: '100%', height: '100%' }}
      // Ensure inner view allows overflow so native popups (select menus) are not clipped
      renderView={(props) => <div {...props} style={{ ...props.style, overflow: 'visible' }} />}
    >

      {children}
      
    </Scrollbars>
  );
}

export default CustomScrollbar;