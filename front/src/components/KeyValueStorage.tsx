'use client';

import { useState } from 'react';

interface KVOperationStatus {
  status: 'idle' | 'processing' | 'success' | 'error';
  message?: string;
  txHash?: string;
  value?: string;
}

export default function KeyValueStorage() {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [streamId, setStreamId] = useState('');
  const [uploadStatus, setUploadStatus] = useState<KVOperationStatus>({ status: 'idle' });
  const [downloadKey, setDownloadKey] = useState('');
  const [downloadStreamId, setDownloadStreamId] = useState('');
  const [downloadStatus, setDownloadStatus] = useState<KVOperationStatus>({ status: 'idle' });

  const handleUpload = async () => {
    if (!key || !value) {
      alert('请填写Key和Value');
      return;
    }

    setUploadStatus({ status: 'processing', message: '正在存储到0G Key-Value Storage...' });

    try {
      const response = await fetch('/api/kv-upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key,
          value,
          streamId: streamId || undefined
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus({
          status: 'success',
          message: '数据存储成功！',
          txHash: result.txHash
        });
      } else {
        setUploadStatus({
          status: 'error',
          message: result.error || '存储失败'
        });
      }
    } catch (error) {
      setUploadStatus({
        status: 'error',
        message: '存储过程中发生错误'
      });
    }
  };

  const handleDownload = async () => {
    if (!downloadKey) {
      alert('请填写要查询的Key');
      return;
    }

    setDownloadStatus({ status: 'processing', message: '正在从0G Key-Value Storage获取数据...' });

    try {
      const params = new URLSearchParams({
        key: downloadKey,
        ...(downloadStreamId && { streamId: downloadStreamId })
      });

      const response = await fetch(`/api/kv-download?${params}`);
      const result = await response.json();

      if (response.ok) {
        setDownloadStatus({
          status: 'success',
          message: '数据获取成功！',
          value: result.value
        });
      } else {
        setDownloadStatus({
          status: 'error',
          message: result.error || '获取失败'
        });
      }
    } catch (error) {
      setDownloadStatus({
        status: 'error',
        message: '获取过程中发生错误'
      });
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
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
    marginRight: '1rem'
  };

  const sectionStyle: React.CSSProperties = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
    backgroundColor: '#f9f9f9'
  };

  const successStyle: React.CSSProperties = {
    color: 'green',
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    borderRadius: '4px'
  };

  const errorStyle: React.CSSProperties = {
    color: 'red',
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h2>0G Key-Value Storage</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Key-Value Storage支持数据更新，适用于配置数据、用户设置等场景。
        基于0G Batcher实现，数据将永久存储在0G分布式网络中。
      </p>

      {/* 数据存储部分 */}
      <div style={sectionStyle}>
        <h3>存储数据</h3>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Key (键):
          </label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="输入数据的键名"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Value (值):
          </label>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="输入要存储的数据值"
            rows={4}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Stream ID (可选):
          </label>
          <input
            type="text"
            value={streamId}
            onChange={(e) => setStreamId(e.target.value)}
            placeholder="留空使用默认Stream ID"
            style={inputStyle}
          />
          <small style={{ color: '#666' }}>
            Stream ID用于数据分组，留空将使用默认值
          </small>
        </div>

        <button
          onClick={handleUpload}
          disabled={uploadStatus.status === 'processing'}
          style={{
            ...buttonStyle,
            backgroundColor: uploadStatus.status === 'processing' ? '#6c757d' : '#007bff'
          }}
        >
          {uploadStatus.status === 'processing' ? '存储中...' : '存储到0G KV Storage'}
        </button>

        {uploadStatus.message && (
          <div style={uploadStatus.status === 'success' ? successStyle : uploadStatus.status === 'error' ? errorStyle : {}}>
            <p><strong>{uploadStatus.message}</strong></p>
            {uploadStatus.txHash && (
              <div>
                <p>交易哈希: <code style={{ backgroundColor: 'white', padding: '2px 4px', borderRadius: '2px' }}>{uploadStatus.txHash}</code></p>
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                  ✅ 数据已成功存储到0G分布式网络
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 数据获取部分 */}
      <div style={sectionStyle}>
        <h3>获取数据</h3>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Key (键):
          </label>
          <input
            type="text"
            value={downloadKey}
            onChange={(e) => setDownloadKey(e.target.value)}
            placeholder="输入要查询的键名"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Stream ID (可选):
          </label>
          <input
            type="text"
            value={downloadStreamId}
            onChange={(e) => setDownloadStreamId(e.target.value)}
            placeholder="留空使用默认Stream ID"
            style={inputStyle}
          />
          <small style={{ color: '#666' }}>
            应与存储时使用的Stream ID保持一致
          </small>
        </div>

        <button
          onClick={handleDownload}
          disabled={downloadStatus.status === 'processing'}
          style={{
            ...buttonStyle,
            backgroundColor: downloadStatus.status === 'processing' ? '#6c757d' : '#28a745'
          }}
        >
          {downloadStatus.status === 'processing' ? '获取中...' : '从0G KV Storage获取'}
        </button>

        {downloadStatus.message && (
          <div style={downloadStatus.status === 'success' ? successStyle : downloadStatus.status === 'error' ? errorStyle : {}}>
            <p><strong>{downloadStatus.message}</strong></p>
            {downloadStatus.value && (
              <div>
                <p><strong>获取到的值:</strong></p>
                <pre style={{
                  backgroundColor: 'white',
                  padding: '1rem',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  {downloadStatus.value}
                </pre>
              </div>
            )}
            {downloadStatus.status === 'error' && (
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                💡 提示: KV读取功能目前正在完善中，请稍后再试
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}