// WalletConnect.tsx — React island, stub wallet connect (no private keys)
import { useStore } from '@nanostores/react';
import { $wallet, connectWalletStub, disconnectWallet } from '../stores/wallet';

export default function WalletConnect() {
  const wallet = useStore($wallet);

  if (wallet.connected && wallet.addr) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '0.75rem',
            padding: '1.5rem 2rem',
            textAlign: 'center',
            maxWidth: '380px',
            width: '100%',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔗</div>
          {/* text-muted raised ≥7:1 all themes ✅ */}
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            Connected Wallet
          </p>
          {/* wallet addr: text-primary (not yellow — yellow fails on light/white) */}
          <p
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              fontWeight: 600,
              marginBottom: '0.25rem',
              wordBreak: 'break-all',
            }}
          >
            {wallet.addr}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
            Chain ID: {wallet.chainId}
          </p>
          <p
            style={{
              color: 'var(--accent)',
              fontSize: '0.8rem',
              padding: '0.5rem',
              background: 'var(--bg-secondary)',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
            }}
          >
            ✅ Verified Bongbaeng Visitor (stub — no real signature)
          </p>
        </div>
        <button className="btn-outline" onClick={disconnectWallet}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <button
        className="btn-primary"
        onClick={connectWalletStub}
        style={{ fontSize: '1rem', padding: '0.75rem 2rem' }}
      >
        🔌 Connect Wallet
      </button>
      {/* text-muted raised ≥7:1 ✅ */}
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.75rem' }}>
        Demo stub — no real wallet required · ไม่มี private key ในโค้ด
      </p>
    </div>
  );
}
