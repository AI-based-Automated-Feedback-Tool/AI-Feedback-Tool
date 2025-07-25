// src/components/HeaderWithApiCount.jsx
import React, { useContext } from 'react';
import { ApiCallCountContext } from '../../../Context/ApiCallCountContext';

const HeaderWithApiCount = () => {
  const { count, MAX_CALLS_PER_DAY } = useContext(ApiCallCountContext);

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
      <div>API Calls Today: {count}/{MAX_CALLS_PER_DAY}</div>
    </header>
  );
};

export default HeaderWithApiCount;
