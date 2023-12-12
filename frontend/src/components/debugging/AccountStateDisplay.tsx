import React from 'react';
import { useAccount } from '../../context/AccountContext';

const AccountStateDisplay: React.FC = () => {
  const { connected, account, provider, signer } = useAccount();

  return (
    <div>
      <h3>Account State</h3>
      <p><strong>Connected:</strong> {connected ? 'Yes' : 'No'}</p>
      <p><strong>Account:</strong> {account || 'None'}</p>
      <p><strong>Provider:</strong> {provider ? 'Set' : 'Not set'}</p>
      <p><strong>Signer:</strong> {signer ? 'Set' : 'Not set'}</p>
    </div>
  );
};

export default AccountStateDisplay;