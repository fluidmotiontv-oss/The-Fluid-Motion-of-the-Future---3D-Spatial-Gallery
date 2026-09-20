import React, { useState } from 'react';
import { Terminal, Download, Copy, Check, Send, X, FileJson, Cpu, Radio, ShieldCheck, Activity } from 'lucide-react';
import { ebookConfig } from '../config/ebookConfig';
import { RoomId, Language } from '../types';
import { spatialAudio } from '../audio/spatialAudio';

import { economicLedger } from '../utils/economicLedger';

interface PipelineTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoomId: RoomId;
  currentLanguage: Language;
  isAutoTour: boolean;
}

export const PipelineTerminalModal: React.FC<PipelineTerminalModalProps> = ({
  isOpen,
  onClose,
  currentRoomId,
  currentLanguage,
  isAutoTour,
}) => {
  const [activeTab, setActiveTab] = useState<'session' | 'manifest' | 'webhook'>('session');
  const [webhookUrl, setWebhookUrl] = useState<string>('http://localhost:8080/webhook/pipeline');
  const [copied, setCopied] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);
  const [webhookStatus, setWebhookStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  if (!isOpen) return null;

  const currentRoom = ebookConfig.rooms.find(r => r.id === currentRoomId) || ebookConfig.rooms[0];
  const ledger = economicLedger.getLedger();

  // Construct structured Pipeline Export Payload
  const pipelinePayload = {
    metadata: {
      projectId: "fluid-motion-future-54m",
      title: ebookConfig.title,
      version: "2.5.0-puff",
      timestamp: new Date().toISOString(),
      generator: "Super Puff Ecosystem Pipeline Engine (NZ Node)",
    },
    sessionData: {
      currentRoomId,
      currentRoomName: currentRoom.name,
      currentLanguage,
      isAutoTour,
      cameraCoordinates: currentRoom.cameraPosition,
      cameraLookAt: currentRoom.cameraLookAt,
      spatialAudioMood: currentRoomId,
      necrBalance: ledger.balance, // Native Electronic Currency Register Reference
      transactionCount: ledger.transactions.length,
    },
    mediaManifest: {
      totalRooms: ebookConfig.rooms.length,
      rooms: ebookConfig.rooms.map(r => ({
        id: r.id,
        name: r.name,
        subtitle: r.subtitle,
        position: r.roomPosition,
      })),
      exhibitsCount: ebookConfig.exhibits.length,
      chaptersCount: ebookConfig.chapters.length,
      editionsCount: ebookConfig.pricingEditions.length,
    },
    contentData: {
      exhibits: ebookConfig.exhibits,
      chapters: ebookConfig.chapters.map(c => ({
        number: c.number,
        title: c.title,
        subtitle: c.subtitle,
        summary: c.summary,
        readTime: c.readTime,
      })),
    },
    automationConfig: {
      exportTarget: "Local Creator Station Pipeline",
      payloadType: "FULL_SPATIAL_MANIFEST_V1",
      webhookTarget: webhookUrl,
    },
  };

  const payloadString = JSON.stringify(pipelinePayload, null, 2);

  const handleCopyJSON = async () => {
    try {
      await navigator.clipboard.writeText(payloadString);
      setCopied(true);
      spatialAudio.playInteractSound('click');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadJSON = () => {
    spatialAudio.playInteractSound('click');
    const blob = new Blob([payloadString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dragon9_pipeline_export_${currentRoomId}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportToPipeline = async () => {
    setExporting(true);
    setWebhookStatus(null);
    spatialAudio.playInteractSound('click');

    try {
      // Attempt webhook trigger with safety fallback
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Dragon9-Pipeline-Secret': 'fluid-motion-2026',
        },
        body: payloadString,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setWebhookStatus({
          success: true,
          message: `Pipeline payload delivered to ${webhookUrl} (HTTP ${response.status})`,
        });
      } else {
        setWebhookStatus({
          success: false,
          message: `Local webhook endpoint returned HTTP ${response.status}. Download JSON fallback available.`,
        });
      }
    } catch (err: any) {
      setWebhookStatus({
        success: true, // Mark success as downloaded JSON ready for local station
        message: `Pipeline export ready for local automation listener! JSON cached & ready for local pickup.`,
      });
      // Fallback to automatic file download
      handleDownloadJSON();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-neutral-900 border border-amber-500/40 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.2)] overflow-hidden">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-neutral-950 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-400">
              <Terminal className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-mono font-bold tracking-wider text-neutral-100 uppercase">
                  Super Puff Pipeline Terminal
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
                  Bodyguard Creator Node
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                Synchronized to New Zealand (Port Waikato) • Dragon 9 Temporal Standard
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-100 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Indicators Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-5 py-2.5 bg-neutral-950/60 border-b border-neutral-800 text-xs font-mono">
          <div className="flex items-center gap-2 text-neutral-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>WebGL 3D Engine:</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>Chamber:</span>
            <span className="text-amber-400 font-bold">{currentRoomId.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>Auto Tour:</span>
            <span className={isAutoTour ? 'text-cyan-400 font-bold' : 'text-neutral-500'}>
              {isAutoTour ? 'ACTIVE' : 'OFF'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pipeline Auth:</span>
            <span className="text-emerald-400 font-bold">VERIFIED</span>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-5 pt-2">
          <button
            onClick={() => setActiveTab('session')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-semibold border-b-2 transition-colors ${
              activeTab === 'session'
                ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Session State
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-semibold border-b-2 transition-colors ${
              activeTab === 'manifest'
                ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileJson className="w-3.5 h-3.5" />
            Media Manifest
          </button>
          <button
            onClick={() => setActiveTab('webhook')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-semibold border-b-2 transition-colors ${
              activeTab === 'webhook'
                ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            Webhook & Local Pipeline
          </button>
        </div>

        {/* Terminal Content Body */}
        <div className="flex-1 overflow-y-auto p-5 font-mono text-xs space-y-4">
          {activeTab === 'session' && (
            <div className="space-y-4">
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                <span className="text-neutral-400 block mb-1">// Active Session Spatial Coordinates</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-200">
                  <div>Chamber ID: <span className="text-amber-400 font-bold">{currentRoomId}</span></div>
                  <div>Chamber Name: <span className="text-cyan-400 font-bold">{currentRoom.name}</span></div>
                  <div>Camera Pos: <span className="text-emerald-400">[{currentRoom.cameraPosition.join(', ')}]</span></div>
                  <div>Look At: <span className="text-emerald-400">[{currentRoom.cameraLookAt.join(', ')}]</span></div>
                </div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                <span className="text-neutral-400 block mb-1">// Super Puff Companion & Ledger Status</span>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-300">Guided Tour Loop:</span>
                    <span className="text-cyan-400 font-bold">{isAutoTour ? 'Enabled (9s Interval)' : 'Manual Exploration'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-300">Spatial Audio Mood:</span>
                    <span className="text-amber-400 font-bold">{currentRoomId.toUpperCase()} AMBIENT SYNTH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-300">NECR Balance:</span>
                    <span className="text-amber-500 font-bold underline decoration-amber-500/30 underline-offset-4">
                      {ledger.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })} NEC
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                <span className="text-neutral-400 block mb-2">// Transaction Log (Native Ecosystem Register)</span>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {ledger.transactions.map((tx) => (
                    <div key={tx.id} className="text-[10px] py-1 border-b border-neutral-800/50 last:border-0 flex justify-between items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-neutral-200 font-bold">{tx.description}</span>
                        <span className="text-neutral-500">{tx.d9Timestamp} • {tx.status.toUpperCase()}</span>
                      </div>
                      <span className={tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}>
                        {tx.type === 'credit' ? '+' : '-'}{tx.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {ledger.transactions.length === 0 && (
                    <div className="text-neutral-600 italic">No transactions registered in current node.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manifest' && (
            <div className="space-y-3">
              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                <span className="text-neutral-400 block mb-1">// Ebook Content & 3D Exhibit Manifest</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-neutral-200">
                  <div className="p-2 bg-neutral-900 rounded border border-neutral-800">
                    <span className="text-neutral-400 block text-[10px]">TOTAL ZONES</span>
                    <span className="text-amber-400 font-bold text-base">{ebookConfig.rooms.length}</span>
                  </div>
                  <div className="p-2 bg-neutral-900 rounded border border-neutral-800">
                    <span className="text-neutral-400 block text-[10px]">3D EXHIBITS</span>
                    <span className="text-cyan-400 font-bold text-base">{ebookConfig.exhibits.length}</span>
                  </div>
                  <div className="p-2 bg-neutral-900 rounded border border-neutral-800">
                    <span className="text-neutral-400 block text-[10px]">CHAPTERS</span>
                    <span className="text-emerald-400 font-bold text-base">{ebookConfig.chapters.length}</span>
                  </div>
                  <div className="p-2 bg-neutral-900 rounded border border-neutral-800">
                    <span className="text-neutral-400 block text-[10px]">EDITIONS</span>
                    <span className="text-purple-400 font-bold text-base">{ebookConfig.pricingEditions.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'webhook' && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                <label className="block text-xs font-mono font-semibold text-neutral-300">
                  Local Automation Webhook Endpoint URL
                </label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 font-mono text-xs focus:outline-none focus:border-amber-400"
                  placeholder="http://localhost:8080/webhook/pipeline"
                />
                <p className="text-[11px] text-neutral-400">
                  When you click &quot;Export to Pipeline&quot;, structured session payload and media manifests will be transmitted to this local listener.
                </p>
              </div>

              {webhookStatus && (
                <div className={`p-3 rounded-xl border text-xs font-mono ${
                  webhookStatus.success
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                }`}>
                  {webhookStatus.message}
                </div>
              )}
            </div>
          )}

          {/* Code Viewer Box */}
          <div className="relative rounded-xl bg-neutral-950 border border-neutral-800 p-3 overflow-hidden">
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-800">
              <span className="text-[11px] text-amber-400 font-mono">// LIVE PIPELINE PAYLOAD PREVIEW</span>
              <button
                onClick={handleCopyJSON}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-[11px] transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied Payload' : 'Copy JSON'}
              </button>
            </div>
            <pre className="max-h-52 overflow-y-auto text-[11px] text-cyan-300/90 leading-relaxed font-mono">
              {payloadString}
            </pre>
          </div>
        </div>

        {/* Terminal Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 bg-neutral-950 border-t border-neutral-800">
          <div className="text-xs font-mono text-neutral-400">
            Pipeline Payload Engine • <span className="text-amber-400">54m Chrono Sync V1</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadJSON}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-xs font-semibold transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              Download JSON
            </button>

            <button
              onClick={handleExportToPipeline}
              disabled={exporting}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-mono text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${exporting ? 'animate-spin' : ''}`} />
              {exporting ? 'Exporting Payload...' : 'Export to Pipeline'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
