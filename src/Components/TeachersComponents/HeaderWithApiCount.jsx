// src/components/HeaderWithApiCount.jsx
import React, { useContext } from 'react';
import { ApiCallCountContext } from '../../Context/ApiCallCountContext';

const HeaderWithApiCount = () => {
  const { count } = useContext(ApiCallCountContext);

  return (
    <header
      style={{
        padding: '1rem',
        backgroundColor: '#007bff',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      
      <div>API Calls Today: {count}</div>
    </header>
  );
};

export default HeaderWithApiCount;
