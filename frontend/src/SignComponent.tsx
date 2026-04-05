import React, { useState } from 'react';
import { PenTool, Copy, Check, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export default function SignComponent() {
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/sign`, { message });
      setSignature(response.data.signature);
    } catch (err) {
      setError('Erreur lors de la signature. Vérifiez que l\'API est lancée.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <form onSubmit={handleSign}>
      <div className="form-group">
        <label htmlFor="messageToSign">Contenu du document à signer</label>
        <textarea
          id="messageToSign"
          className="input-field"
          placeholder="Entrez le texte de votre document ici..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {error && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}

      <button 
        type="submit" 
        className="primary-btn" 
        disabled={loading || !message.trim()}
      >
        {loading ? <Loader2 className="animate-spin" /> : <PenTool />}
        {loading ? 'Génération...' : 'Générer la signature numérique'}
      </button>

      {signature && (
        <div className="result-box">
          <div className="result-header">
            <span className="result-label">Signature Hexadécimale</span>
            <button type="button" onClick={copyToClipboard} className="copy-btn" title="Copier">
              {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>
          <div className="result-content">
            {signature}
          </div>
        </div>
      )}
    </form>
  );
}
