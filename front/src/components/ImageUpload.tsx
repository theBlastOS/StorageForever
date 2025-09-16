'use client';

import { useState } from 'react';

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error';
  message?: string;
  hash?: string;
  txHash?: string;
  uploadType?: 'normal' | 'kv';
}

export default function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: 'idle' });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setUploadStatus({ status: 'idle' });
    } else {
      alert('请选择图片文件');
    }
  };

  const handleNormalUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus({ status: 'uploading', message: '正在上传到0G Storage (普通模式)...', uploadType: 'normal' });

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
          message: '普通上传成功！',
          hash: String(result.rootHash || result.hash || ''),
          txHash: String(result.txHash || ''),
          uploadType: 'normal'
        });
      } else {
        setUploadStatus({
          status: 'error',
          message: result.error || '普通上传失败',
          uploadType: 'normal'
        });
      }
    } catch {
      setUploadStatus({
        status: 'error',
        message: '普通上传过程中发生错误',
        uploadType: 'normal'
      });
    }
  };

  const handleKVUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus({ status: 'uploading', message: '正在上传到0G KV Storage...', uploadType: 'kv' });

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
            message: 'KV存储上传成功！',
            hash: String(result.key || result.rootHash || ''),
            txHash: String(result.txHash || ''),
            uploadType: 'kv'
          });
        } else {
          setUploadStatus({
            status: 'error',
            message: result.error || 'KV上传失败',
            uploadType: 'kv'
          });
        }
      } catch {
        setUploadStatus({
          status: 'error',
          message: 'KV上传过程中发生错误',
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
              <p>已选择文件: {selectedFile.name}</p>
              <p>文件大小: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <p>点击选择图片文件</p>
          )}
        </label>
      </div>

      {selectedFile && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <button
              onClick={handleNormalUpload}
              disabled={uploadStatus.status === 'uploading'}
              style={{
                ...buttonStyle,
                backgroundColor: uploadStatus.status === 'uploading' ? '#6c757d' : '#007bff',
                marginRight: '1rem'
              }}
            >
              {uploadStatus.status === 'uploading' && uploadStatus.uploadType === 'normal'
                ? '普通上传中...'
                : '普通上传 (文件存储)'}
            </button>
            <button
              onClick={handleKVUpload}
              disabled={uploadStatus.status === 'uploading'}
              style={{
                ...buttonStyle,
                backgroundColor: uploadStatus.status === 'uploading' ? '#6c757d' : '#28a745'
              }}
            >
              {uploadStatus.status === 'uploading' && uploadStatus.uploadType === 'kv'
                ? 'KV上传中...'
                : 'KV上传 (键值存储)'}
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
              💡 <strong>选择上传方式：</strong>
            </p>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              • <strong>普通上传</strong>：文件直接存储，获得rootHash，适合大文件和永久存储
            </p>
            <p style={{ margin: 0 }}>
              • <strong>KV上传</strong>：文件转Base64存储，获得自定义key，适合小文件和快速访问
            </p>
          </div>
        </div>
      )}

      {uploadStatus.message && (
        <div style={uploadStatus.status === 'success' ? successStyle : uploadStatus.status === 'error' ? errorStyle : {}}>
          <p>{uploadStatus.message}</p>
          {uploadStatus.hash && (
            <p>
              {uploadStatus.uploadType === 'normal' ? '文件根哈希' : 'KV存储键名'}:
              <code style={{ backgroundColor: 'white', padding: '2px 4px', borderRadius: '2px', marginLeft: '0.5rem' }}>
                {uploadStatus.hash}
              </code>
            </p>
          )}
          {uploadStatus.txHash && (
            <p>
              交易哈希:
              <code style={{ backgroundColor: 'white', padding: '2px 4px', borderRadius: '2px', marginLeft: '0.5rem' }}>
                {uploadStatus.txHash}
              </code>
            </p>
          )}
          {uploadStatus.status === 'success' && (
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
              ✅ {uploadStatus.uploadType === 'normal'
                ? '文件已成功存储到0G分布式文件系统'
                : '数据已成功存储到0G Key-Value存储系统'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}