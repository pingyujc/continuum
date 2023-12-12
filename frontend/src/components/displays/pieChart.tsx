import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { getTokenBalancesMap } from '../debugging/TokenDisplay';
import { useAccount } from '../../context/AccountContext';
import { TokenData } from '../../types/types';
import { useState, useEffect } from 'react';
const data = [
  { id: 0, value: 10, label: 'series A' },
  { id: 1, value: 15, label: 'series B' },
  { id: 2, value: 20, label: 'series C' },
];

export default function PieActiveArc() {
  const {provider} = useAccount();
  const [tokenData, setTokenData] = useState<TokenData[]>([]); // Explicit type definition

  useEffect(() => {
    if (provider) {
      getTokenBalancesMap(provider).then(data => {
        setTokenData(data);
      });
    }
  }, [provider]);
  
  return (
    <PieChart
      series={[
        {
          data:tokenData ,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
      ]}
      height={400}
    />
  );
}