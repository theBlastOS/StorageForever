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
        Storage Forever
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
          📤 Image Upload to 0G Storage
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
          📥 Download Images from 0G Storage
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
          🗃️ Key-Value Data Storage
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
          💡 <strong>Usage Instructions:</strong>
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li><strong>Normal File Upload:</strong> Store images directly to 0G distributed file system, obtain rootHash for download</li>
          <li><strong>KV Image Upload:</strong> Convert images to Base64 format and store in Key-Value system, suitable for small files and quick access</li>
          <li><strong>Pure Key-Value Storage:</strong> Support arbitrary key-value pair data, suitable for configuration, settings and other structured data</li>
          <li>All data is permanently stored in the 0G distributed network, ensuring data security and high availability</li>
        </ul>
      </div>
    </main>
  );
}
