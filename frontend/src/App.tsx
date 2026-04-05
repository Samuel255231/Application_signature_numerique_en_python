import { useState } from 'react';
import './index.css';
import { PenTool, CheckCircle, ShieldCheck } from 'lucide-react';
import SignComponent from './SignComponent';
import VerifyComponent from './VerifyComponent';

function App() {
  const [activeTab, setActiveTab] = useState<'sign' | 'verify'>('sign');

  return (
    <div className="app-container">
      <div className="glass-panel">
        <div className="header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <ShieldCheck size={48} color="#818CF8" />
          </div>
          <h1>SecuDoc Auth</h1>
          <p>Signez numériquement et vérifiez l'authenticité de vos documents</p>
        </div>

        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'sign' ? 'active' : ''}`}
            onClick={() => setActiveTab('sign')}
          >
            <PenTool size={18} />
            Signer un document
          </button>
          <button 
            className={`tab-btn ${activeTab === 'verify' ? 'active' : ''}`}
            onClick={() => setActiveTab('verify')}
          >
            <CheckCircle size={18} />
            Vérifier un document
          </button>
        </div>

        <div className="content">
          {activeTab === 'sign' ? <SignComponent /> : <VerifyComponent />}
        </div>
      </div>
    </div>
  );
}

export default App;
