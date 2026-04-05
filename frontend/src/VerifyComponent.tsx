import React, { useState } from 'react';
import { CheckCircle, XCircle, Search, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export default function VerifyComponent() {
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !signature.trim()) return;

    setLoading(true);
    setError('');
    setIsValid(null);
    
    try {
      const response = await axios.post(`${API_URL}/verify`, { 
        message, 
        signature 
      });
      setIsValid(response.data.valid);
    } catch (err) {
      setError('Erreur de validation. La signature est peut-être malformée ou l\'API est injoignable.');
      setIsValid(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <div className="form-group">
        <label htmlFor="messageToVerify">Contenu original du document</label>
        <textarea
          id="messageToVerify"
          className="input-field"
          style={{ minHeight: '80px' }}
          placeholder="Entrez le texte exact du document..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="signatureToCheck">Signature numérique (Hexadécimal)</label>
        <textarea
          id="signatureToCheck"
          className="input-field"
          style={{ minHeight: '60px' }}
          placeholder="Collez la signature à vérifier..."
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
        />
      </div>

      {error && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}

      <button 
        type="submit" 
        className="primary-btn" 
        disabled={loading || !message.trim() || !signature.trim()}
      >
        {loading ? <Loader2 className="animate-spin" /> : <Search />}
        {loading ? 'Vérification en cours...' : 'Vérifier l\'authenticité'}
      </button>

      {isValid !== null && (
        <div className="validation-result">
          {isValid ? (
            <div className="badge success">
              <CheckCircle size={24} />
              Document Authentique et Intègre
            </div>
          ) : (
            <div className="badge error">
              <XCircle size={24} />
              Signature Invalide ou Document Altéré
            </div>
          )}
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isValid 
              ? 'La signature correspond parfaitement au document. Le contenu n\'a pas été altéré et a bien été signé par la source autorisée.'
              : 'La vérification a échoué. Le document a pu être modifié ou la signature ne correspond pas à ce fichier.'}
          </p>
        </div>
      )}
    </form>
  );
}
