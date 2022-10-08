import '../styles/globals.css'
import "@rainbow-me/rainbowkit/styles.css"
import { getDefaultWallets, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import PlausibleProvider from 'next-plausible'

const { chains, provider } = configureChains(
  [/*chain.mainnet,*/ chain.goerli],
  [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

// always false until I register .xyz domain
const isProdEnv = process.env.NEXT_PUBLIC_VERCEL_ENV == 'production'

const App = ({ Component, pageProps }) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={lightTheme({
          accentColor: '#1DD297',
        })}
      >
        <PlausibleProvider
            domain={isProdEnv ? 'prod-xyz-here' : 'phone-awareness-dapp.danielbelfort.repl.co'}
            trackLocalhost={!isProdEnv}
            trackOutboundLinks
        >
          <Component {...pageProps} />
        </PlausibleProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App