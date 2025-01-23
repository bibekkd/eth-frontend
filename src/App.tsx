import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAccount, useConnect, useDisconnect, WagmiProvider } from 'wagmi';
import { config } from './config';
import './App.css'


const queryClient = new QueryClient();

function App() {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectWallet />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function ConnectWallet() {
  const { address } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (address) {
    return <div>
      You are connected {address}
      <div>
        <button onClick={() => { disconnect() }}>
          Disconnect
        </button>
      </div>
    </div>
  }

  return <div>
    {connectors.map((connector) => <button key={connector.uid} onClick={() => connect({connector : connector})}>
      Connect via {connector.name}
    </button>)}
  </div>
}

export default App
