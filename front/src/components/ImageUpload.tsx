'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { usePayment } from '@/lib/usePayment';

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error';
  message?: string;
  hash?: string;
  txHash?: string;
  uploadType?: 'normal' | 'kv';
}

export default function ImageUpload() {
  const { isConnected } = useAccount();
  const {
    paymentCompleted,
    paymentPending,
    transactionHash,
    makePayment,
    paymentAmount,
    paymentAddress
  } = usePayment();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: 'idle' });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setUploadStatus({ status: 'idle' });
    } else {
      alert('Please select an image file');
    }
  };

  const handleNormalUpload = async () => {
    if (!selectedFile) return;
    if (!paymentCompleted) {
      alert('请先完成支付才能上传文件');
      return;
    }

    setUploadStatus({ status: 'uploading', message: 'Uploading to 0G Storage (Normal Mode)...', uploadType: 'normal' });

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log('Upload result:', result);

      if (response.ok) {
        setUploadStatus({
          status: 'success',
          message: 'Normal upload successful!',
          hash: String(result.rootHash || result.hash || ''),
          txHash: String(result.txHash || ''),
          uploadType: 'normal'
        });
      } else {
        setUploadStatus({
          status: 'error',
          message: result.error || 'Normal upload failed',
          uploadType: 'normal'
        });
      }
    } catch {
      setUploadStatus({
        status: 'error',
        message: 'Error occurred during normal upload',
        uploadType: 'normal'
      });
    }
  };

  const handleKVUpload = async () => {
    if (!selectedFile) return;
    if (!paymentCompleted) {
      alert('请先完成支付才能上传文件');
      return;
    }

    setUploadStatus({ status: 'uploading', message: 'Uploading to 0G KV Storage...', uploadType: 'kv' });

    // 将文件转换为Base64或者使用文件名作为key
    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileContent = e.target?.result as string;
      const fileName = selectedFile.name;

      try {
        const response = await fetch('/api/kv-upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            key: `file:${fileName}:${Date.now()}`,
            value: fileContent.split(',')[1], // 移除data:image/...;base64,前缀
            streamId: '0x00000000000000000000000000000000000000000000000000000000000001'
          }),
        });

        const result = await response.json();
        console.log('KV Upload result:', result);

        if (response.ok) {
          setUploadStatus({
            status: 'success',
            message: 'KV storage upload successful!',
            hash: String(result.key || result.rootHash || ''),
            txHash: String(result.txHash || ''),
            uploadType: 'kv'
          });
        } else {
          setUploadStatus({
            status: 'error',
            message: result.error || 'KV upload failed',
            uploadType: 'kv'
          });
        }
      } catch {
        setUploadStatus({
          status: 'error',
          message: 'Error occurred during KV upload',
          uploadType: 'kv'
        });
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  const containerStyle: React.CSSProperties = {
    border: '2px dashed #ccc',
    borderRadius: '8px',
    padding: '2rem',
    textAlign: 'center',
    marginBottom: '1rem'
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginTop: '1rem'
  };

  const successStyle: React.CSSProperties = {
    color: 'green',
    marginTop: '1rem'
  };

  const errorStyle: React.CSSProperties = {
    color: 'red',
    marginTop: '1rem'
  };

  return (
    <div>
      <div style={containerStyle}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          id="file-input"
          style={{ display: 'none' }}
        />
        <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
          {selectedFile ? (
            <div>
              <p>Selected file: {selectedFile.name}</p>
              <p>File size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <p>Click to select image file</p>
          )}
        </label>
      </div>

      {selectedFile && (
        <div>
          {/* Payment Section */}
          {!paymentCompleted && (
            <div style={{
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>⚠️ 上传前需要支付</h4>
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>
                上传文件前需要支付 <strong>{paymentAmount} ETH</strong> 到:
              </p>
              <p style={{
                fontSize: '0.8rem',
                wordBreak: 'break-all',
                backgroundColor: '#fff',
                padding: '0.5rem',
                borderRadius: '4px',
                margin: '0 0 1rem 0'
              }}>
                {paymentAddress}
              </p>
              {isConnected ? (
                <button
                  onClick={makePayment}
                  disabled={paymentPending}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: paymentPending ? '#6c757d' : '#ffc107',
                    color: paymentPending ? '#fff' : '#212529',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: paymentPending ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}
                >
                  {paymentPending ? '支付中...' : `支付 ${paymentAmount} ETH`}
                </button>
              ) : (
                <p style={{ color: '#856404', fontSize: '0.9rem', margin: 0 }}>
                  请先连接钱包
                </p>
              )}
            </div>
          )}

          {paymentCompleted && (
            <div style={{
              backgroundColor: '#d1edff',
              border: '1px solid #bee5eb',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <p style={{ margin: '0 0 0.5rem 0', color: '#0c5460' }}>
                ✅ 支付完成！现在可以上传文件了
              </p>
              {transactionHash && (
                <p style={{ fontSize: '0.8rem', margin: 0 }}>
                  交易哈希: <a
                    href={`https://chainscan-galileo.0g.ai/tx/${transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#0c5460' }}
                  >
                    {transactionHash}
                  </a>
                </p>
              )}
            </div>
          )}

          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <button
              onClick={handleNormalUpload}
              disabled={uploadStatus.status === 'uploading' || !paymentCompleted}
              style={{
                ...buttonStyle,
                backgroundColor: (uploadStatus.status === 'uploading' || !paymentCompleted) ? '#6c757d' : '#007bff',
                marginRight: '1rem',
                cursor: (uploadStatus.status === 'uploading' || !paymentCompleted) ? 'not-allowed' : 'pointer'
              }}
            >
              {uploadStatus.status === 'uploading' && uploadStatus.uploadType === 'normal'
                ? 'Normal uploading...'
                : 'Normal Upload (File Storage)'}
            </button>
            <button
              onClick={handleKVUpload}
              disabled={uploadStatus.status === 'uploading' || !paymentCompleted}
              style={{
                ...buttonStyle,
                backgroundColor: (uploadStatus.status === 'uploading' || !paymentCompleted) ? '#6c757d' : '#28a745',
                cursor: (uploadStatus.status === 'uploading' || !paymentCompleted) ? 'not-allowed' : 'pointer'
              }}
            >
              {uploadStatus.status === 'uploading' && uploadStatus.uploadType === 'kv'
                ? 'KV uploading...'
                : 'KV Upload (Key-Value Storage)'}
            </button>
          </div>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '0.75rem',
            borderRadius: '4px',
            fontSize: '0.85rem',
            color: '#666',
            border: '1px solid #e9ecef'
          }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              💡 <strong>Choose upload method:</strong>
            </p>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              • <strong>Normal Upload</strong>: Files stored directly, get rootHash, suitable for large files and permanent storage
            </p>
            <p style={{ margin: 0 }}>
              • <strong>KV Upload</strong>: Files converted to Base64 storage, get custom key, suitable for small files and quick access
            </p>
          </div>
        </div>
      )}

      {uploadStatus.message && (
        <div style={uploadStatus.status === 'success' ? successStyle : uploadStatus.status === 'error' ? errorStyle : {}}>
          <p>{uploadStatus.message}</p>
          {uploadStatus.hash && (
            <p>
              {uploadStatus.uploadType === 'normal' ? 'File Root Hash' : 'KV Storage Key'}:
              <code style={{ backgroundColor: 'white', padding: '2px 4px', borderRadius: '2px', marginLeft: '0.5rem' }}>
                {uploadStatus.hash}
              </code>
            </p>
          )}
          {uploadStatus.txHash && (
            <p>
              Transaction Hash:
              <code style={{ backgroundColor: 'white', padding: '2px 4px', borderRadius: '2px', marginLeft: '0.5rem' }}>
                {uploadStatus.txHash}
              </code>
            </p>
          )}
          {uploadStatus.status === 'success' && (
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
              ✅ {uploadStatus.uploadType === 'normal'
                ? 'File successfully stored to 0G distributed file system'
                : 'Data successfully stored to 0G Key-Value storage system'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}