'use client';

import ImageUpload from '@/components/ImageUpload';
import ImageDownload from '@/components/ImageDownload';
import KeyValueStorage from '@/components/KeyValueStorage';

export default function Home() {
  const sectionStyle: React.CSSProperties = {
    marginBottom: '3rem',
    padding: '1.5rem',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#fafafa'
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '3rem',
        fontSize: '2.5rem',
        color: '#333'
      }}>
        0G Storage 数据管理
      </h1>

      <div style={sectionStyle}>
        <h2 style={{
          marginTop: 0,
          marginBottom: '1.5rem',
          fontSize: '1.5rem',
          color: '#007bff',
          borderBottom: '2px solid #007bff',
          paddingBottom: '0.5rem'
        }}>
          📤 图片上传到0G Storage
        </h2>
        <ImageUpload />
      </div>

      <div style={sectionStyle}>
        <h2 style={{
          marginTop: 0,
          marginBottom: '1.5rem',
          fontSize: '1.5rem',
          color: '#28a745',
          borderBottom: '2px solid #28a745',
          paddingBottom: '0.5rem'
        }}>
          📥 从0G Storage拉取图片
        </h2>
        <ImageDownload />
      </div>

      <div style={sectionStyle}>
        <h2 style={{
          marginTop: 0,
          marginBottom: '1.5rem',
          fontSize: '1.5rem',
          color: '#dc3545',
          borderBottom: '2px solid #dc3545',
          paddingBottom: '0.5rem'
        }}>
          🗃️ Key-Value 数据存储
        </h2>
        <KeyValueStorage />
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        backgroundColor: '#e9ecef',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#6c757d'
      }}>
        <p style={{ margin: '0 0 0.5rem 0' }}>
          💡 <strong>使用说明：</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li><strong>普通文件上传：</strong>将图片直接存储到0G分布式文件系统，获得rootHash用于下载</li>
          <li><strong>KV图片上传：</strong>将图片转换为Base64格式存储到Key-Value系统，适合小文件和快速访问</li>
          <li><strong>纯Key-Value存储：</strong>支持任意键值对数据，适用于配置、设置等结构化数据</li>
          <li>所有数据都永久存储在0G分布式网络中，确保数据的安全性和高可用性</li>
        </ul>
      </div>
    </main>
  );
}
