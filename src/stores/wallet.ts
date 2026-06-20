// stores/wallet.ts — wallet connection state (stub, no private keys)
import { atom } from 'nanostores';

export interface WalletState {
  addr?: string;
  chainId?: number;
  connected: boolean;
}

export const $wallet = atom<WalletState>({ connected: false });

export function connectWalletStub(): void {
  // Stub: simulate a connected wallet with a demo address
  $wallet.set({
    connected: true,
    addr: '0xB0n9...b43n9',
    chainId: 1,
  });
}

export function disconnectWallet(): void {
  $wallet.set({ connected: false });
}
