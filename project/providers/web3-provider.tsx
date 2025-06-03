"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

type WalletState = {
  address: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  balance: string | null;
};

type Web3ContextType = {
  wallet: WalletState;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const defaultContext: Web3ContextType = {
  wallet: {
    address: null,
    provider: null,
    signer: null,
    isConnected: false,
    isConnecting: false,
    chainId: null,
    balance: null,
  },
  connect: async () => { },
  disconnect: () => { },
};

const Web3Context = createContext<Web3ContextType>(defaultContext);

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState<WalletState>(defaultContext.wallet);
  const { toast } = useToast();

  const connect = async () => {
    // Step 1: Check for Ethereum provider
    if (!window.ethereum) {
      console.log('No window.ethereum detected');
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another compatible wallet",
        variant: "destructive"
      });
      setWallet(prev => ({ ...prev, isConnecting: false, isConnected: false }));
      return;
    }

    setWallet(prev => ({ ...prev, isConnecting: true }));
    console.log('Connecting to wallet...');

    try {
      // Step 2: Create provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log('Provider created:', provider);

      // Step 3: Request accounts
      const accounts = await provider.send("eth_requestAccounts", []);
      console.log('Accounts:', accounts);
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet');
      }

      // Step 4: Get signer and address
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      console.log('Signer:', signer);
      console.log('Address:', address);

      // Step 5: Get network and balance
      const network = await provider.getNetwork();
      const balance = ethers.formatEther(await provider.getBalance(address));
      console.log('Network:', network);
      console.log('Balance:', balance);

      // Step 6: Set wallet state
      setWallet({
        address,
        provider,
        signer,
        isConnected: true,
        isConnecting: false,
        chainId: Number(network.chainId),
        balance,
      });
      console.log('Wallet connected:', {
        address,
        provider,
        signer,
        isConnected: true,
        isConnecting: false,
        chainId: Number(network.chainId),
        balance,
      });

      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.substring(0, 6)}...${address.substring(38)}`,
      });
    } catch (error) {
      console.error("Connection error:", error);
      setWallet(prev => ({ ...prev, isConnecting: false, isConnected: false }));
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    setWallet(defaultContext.wallet);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();

          if (accounts.length > 0) {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            const network = await provider.getNetwork();
            const balance = ethers.formatEther(await provider.getBalance(address));

            setWallet({
              address,
              provider,
              signer,
              isConnected: true,
              isConnecting: false,
              chainId: Number(network.chainId),
              balance,
            });
          }
        } catch (error) {
          console.error("Auto-connect error:", error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (wallet.isConnected) {
        connect();
      }
    };

    // Listen for chain changes
    const handleChainChanged = () => {
      if (wallet.isConnected) {
        connect();
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  return (
    <Web3Context.Provider value={{ wallet, connect, disconnect }}>
      {children}
    </Web3Context.Provider>
  );
};