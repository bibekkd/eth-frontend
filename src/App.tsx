import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAccount, useConnect, useDisconnect, WagmiProvider } from 'wagmi';
import { config } from './config';
import './App.css'
import { useReadContract } from 'wagmi'
import { AllowUSDT } from './AllowUSDT';

// 1.25.49
const queryClient = new QueryClient();

function App() {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectWallet />
        <TotalSupply />
        <AllowUSDT />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function Account() {
  const { address } = useAccount();
  return <div>
    {address ? "You are connected "+address : "You are disconnected"}
  </div>
}

function TotalSupply() {
  const { address } = useAccount();

  const { data, isLoading, error } = useReadContract({
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    abi: [
      {
        "constant":true,
        "inputs":[
          {
            "name":"who",
            "type":"address"
          }
        ],
        "name":"balanceOf",
        "outputs":[
          {
            "name":"",
            "type":"uint256"
          }
        ],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
      }
    ],
    functionName:"balanceOf",
    args: [address!]
  })

  if(isLoading) {
    return <div>loading...</div>
  }

  return (
    <div>
        Total supply  - {JSON.stringify(data?.toString())}
    </div>
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


