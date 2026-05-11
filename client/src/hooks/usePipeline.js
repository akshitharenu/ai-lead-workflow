import { useState, useCallback, useRef } from 'react';
import { createLead, getLead } from '../api/leads';

const STAGES_LIST = [
  { id: 'VALIDATE', label: 'Data Validation' },
  { id: 'ENRICH', label: 'Lead Enrichment' },
  { id: 'SCORE', label: 'AI Lead Scoring', ai: true },
  { id: 'ROUTE', label: 'Smart Routing' },
  { id: 'RESPOND', label: 'AI Email Generation', ai: true },
  { id: 'SAVE', label: 'CRM Persistence' }
];

const usePipeline = () => {
  const [status, setStatus] = useState('idle'); // idle | running | done | error
  const [stages, setStages] = useState(
    STAGES_LIST.map(s => ({ ...s, status: 'idle', durationMs: null }))
  );
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const pollInterval = useRef(null);

  const addLog = (message, level = 'info', module = 'System') => {
    setLogs(prev => [...prev, {
      id: Date.now() + Math.random(),
      timestamp: new Date().toLocaleTimeString(),
      message,
      level,
      module
    }]);
  };

  const updateStage = useCallback((stageId, data) => {
    setStages(prev => prev.map(s => 
      s.id === stageId ? { ...s, ...data } : s
    ));
  }, []);

  const reset = () => {
    setStatus('idle');
    setStages(STAGES_LIST.map(s => ({ ...s, status: 'idle', durationMs: null })));
    setLogs([]);
    setResult(null);
    if (pollInterval.current) clearInterval(pollInterval.current);
  };

  const run = async (formData) => {
    reset();
    setStatus('running');
    addLog('Initializing lead capture pipeline...', 'info');

    try {
      // Start the pipeline
      const finalResult = await createLead(formData);
      
      // Sync stages from the final result
      Object.entries(finalResult.stages).forEach(([id, data]) => {
        updateStage(id, { status: data.status, durationMs: data.durationMs });
        addLog(`Stage ${id} completed in ${data.durationMs}ms`, 'ok', id);
      });

      setResult(finalResult);
      setStatus('done');
      addLog('Pipeline completed successfully.', 'ok');

    } catch (error) {
      setStatus('error');
      addLog(error.message, 'error', 'Orchestrator');
      
      if (error.details && Array.isArray(error.details)) {
        error.details.forEach(err => addLog(err, 'warn', 'Validator'));
      }
    }
  };

  return { run, stages, logs, result, status, reset };
};

export default usePipeline;
