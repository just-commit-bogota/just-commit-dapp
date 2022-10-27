import '../styles/globals.css'
import "@rainbow-me/rainbowkit/styles.css"
import { getDefaultWallets, RainbowKitProvider, lightTheme as lightThemeRainbowkit } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { ThemeProvider } from 'styled-components'
import { ThorinGlobalStyles, lightTheme as lightThemeENS } from '@ensdomains/thorin'

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

const App = ({ Component, pageProps }) => {
  return (
    <ThemeProvider theme={lightThemeENS}>
      <ThorinGlobalStyles />
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          theme={lightThemeRainbowkit({
            accentColor: '#1DD297',
          })}
        >
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  )
}

export default App