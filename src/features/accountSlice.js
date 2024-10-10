import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ethers } from 'ethers'

const initialState = {
  address: null,
  networkId: null,
  provider: null,
  connected: false,
  balance: 0,
  usdtBalance: 0,
  loading: false,
}

const connectWallet = (provider) => {
  return new Promise(async (resolve, reject) => {
    try {
      await provider.send('eth_requestAccounts', [])
    } catch (error) {
      console.error('Error requesting accounts:', error)
      return reject(error)
    }

    try {
      const signer = provider.getSigner()
      resolve(signer.getAddress())
    } catch (error) {
      console.error('Error getting signer address:', error)
      reject(error)
    }
  })
}

export const connectAccount = createAsyncThunk(
  'accounts/connect',
  async (walletType, { dispatch, getState }) => {
    const { baseKey, chainId, networkName, usdtContractAddress, baseRpcUrl } = getState().config

    const providerForWalletType = async (walletType) => {
      switch (walletType) {
        case 'metamask':
          return window.ethereum
        case 'walletconnect':
          const { default: WalletConnectProvider } = await import('@walletconnect/web3-provider')
          const walletConnectProvider = new WalletConnectProvider({
            baseKey,
            chainId,
          })
          await walletConnectProvider.enable()
          return walletConnectProvider
        case 'coinbase':
          const { WalletLink } = await import('walletlink')
          const walletLink = new WalletLink({
            appName: 'Kombat',
            darkMode: true,
          })
          return walletLink.makeWeb3Provider(
            baseRpcUrl,
            chainId
          )
        default:
          throw new Error('Unsupported wallet type')
      }
    }

    const provider = new ethers.providers.Web3Provider(await providerForWalletType(walletType))

    try {
      const currentAddress = await connectWallet(provider)
      const networkId = (await provider.getNetwork()).chainId
      const signer = provider.getSigner()
      const balance = await signer.getBalance()

      const contract = new ethers.Contract(usdtContractAddress, [
        'function balanceOf(address owner) view returns (uint balance)',
      ]).connect(signer)

      const usdtBalance = await contract.balanceOf(currentAddress)

      dispatch(connected({ address: currentAddress, networkId, provider, balance, usdtBalance }))
    } catch (error) {
      console.error('Error connecting to wallet:', error)
      dispatch(connectionFailed())
    }

    // Handle account and network changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        dispatch(updated({ address: accounts[0] }))
      })
      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }
  }
)

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    updated: (state, { payload }) => {
      Object.assign(state, payload)
    },
    connected: (state, { payload }) => {
      state.address = payload.address
      state.networkId = payload.networkId
      state.provider = payload.provider
      state.balance = payload.balance
      state.usdtBalance = payload.usdtBalance
      state.connected = true
    },
    connectionFailed: (state) => {
      state.connected = false
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder.addCase(connectAccount.pending, (state) => {
      state.loading = true
    })
    builder.addCase(connectAccount.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(connectAccount.rejected, (state) => {
      state.loading = false
    })
  },
})

export const { connected, updated, connectionFailed } = accountSlice.actions

export default accountSlice.reducer
