'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useBalance } from 'wagmi'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })

  return (
    <div style={{
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      margin: '20px 0',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>钱包连接</h3>

      <div style={{ marginBottom: '15px' }}>
        <ConnectButton />
      </div>

      {isConnected && (
        <div>
          <p><strong>地址:</strong> {address}</p>
          <p><strong>余额:</strong> {balance ? `${balance.formatted} ${balance.symbol}` : '加载中...'}</p>

          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#d1edff',
            borderRadius: '5px',
            fontSize: '0.9rem',
            color: '#0c5460'
          }}>
            📝 连接成功！现在可以在下方上传文件了（需先支付少量费用）
          </div>
        </div>
      )}
    </div>
  )
}