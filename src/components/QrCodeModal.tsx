import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, QrCode as QrIcon, Smartphone } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  qrContent: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  title,
  qrContent,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && qrContent) {
      QRCode.toDataURL(qrContent, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#f8fafc',
        },
      })
        .then((url) => setDataUrl(url))
        .catch((err) => console.error('QR code generation error:', err));
    }
  }, [isOpen, qrContent]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(qrContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
              <QrIcon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-100 truncate">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Canvas */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-slate-800/80">
          {dataUrl ? (
            <img
              src={dataUrl}
              alt="Node VLESS QR Code"
              className="w-64 h-64 rounded-lg shadow-md border border-slate-700/50"
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center text-slate-500 font-mono text-xs">
              Generating QR Code...
            </div>
          )}

          <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-400">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scan with V2RayNG, Shadowrocket, or Sing-box</span>
          </div>
        </div>

        {/* Raw URI preview with 1-click copy */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Raw Node Link</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 break-all max-h-24 overflow-y-auto">
            {qrContent}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
