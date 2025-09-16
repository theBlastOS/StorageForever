'use client'

import { useState } from 'react'
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'

const PAYMENT_ADDRESS = '0x549e8F736D8DB98b5479160333fcaEb812EAF1fa'
const PAYMENT_AMOUNT = '0.001' // 0.001 ETH

export function usePayment() {
  const { isConnected } = useAccount()
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [paymentPending, setPaymentPending] = useState(false)

  const { data: hash, sendTransaction, isPending: isSending } = useSendTransaction()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // 当交易确认时，设置支付完成状态
  if (isConfirmed && !paymentCompleted && hash) {
    setPaymentCompleted(true)
    setPaymentPending(false)
  }

  const makePayment = async () => {
    if (!isConnected) {
      throw new Error('钱包未连接')
    }

    setPaymentPending(true)
    try {
      sendTransaction({
        to: PAYMENT_ADDRESS,
        value: parseEther(PAYMENT_AMOUNT),
      })
    } catch (error) {
      setPaymentPending(false)
      throw error
    }
  }

  const resetPayment = () => {
    setPaymentCompleted(false)
    setPaymentPending(false)
  }

  return {
    paymentCompleted,
    paymentPending: paymentPending || isSending || isConfirming,
    transactionHash: hash,
    makePayment,
    resetPayment,
    paymentAmount: PAYMENT_AMOUNT,
    paymentAddress: PAYMENT_ADDRESS
  }
}