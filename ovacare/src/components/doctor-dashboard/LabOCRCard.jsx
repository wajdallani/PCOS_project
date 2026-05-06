import React, { useState, useRef } from 'react';
import { Upload, ScanLine, Zap, FlaskConical, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadLabTestForOCR } from '../../services/api';

export default function LabOCRCard({ onAutoFill }) {
  const [scanned, setScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setScanned(false);
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setScanned(false);
      setError(null);
    }
  };

  const handleScanLab = async () => {
    if (!file) return;
    setIsScanning(true);
    setError(null);
    try {
      const result = await uploadLabTestForOCR(file);
      setExtractedData(result.extracted);
      setScanned(true);
    } catch (err) {
      console.error("OCR Error:", err);
      setError("Failed to scan document. Please try a clearer image.");
    } finally {
      setIsScanning(false);
    }
  };

  const chips = extractedData ? Object.entries(extractedData)
    .filter(([_, val]) => val !== null)
    .map(([key, val]) => ({
      label: key.replace(/_/g, ' ').toUpperCase(),
      value: val
    })) : [];

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-soft p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-lavender/10 rounded-xl text-primary-lavender">
          <FlaskConical size={18} />
        </div>
        <h3 className="text-xl font-heading font-bold text-gray-900">Lab Test Scan <span className="text-primary-lavender">(OCR)</span></h3>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-xs font-bold flex items-center gap-2">
          <AlertCircle size={14} /> {error}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
      />

      {/* Upload zone */}
      <div
        onClick={handleUploadClick}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all mb-5 ${dragging
            ? 'border-primary-lavender bg-primary-lavender/5'
            : file 
              ? 'border-primary-lavender/30 bg-primary-lavender/5'
              : 'border-gray-200 hover:border-primary-lavender/50 hover:bg-gray-50'
          }`}
      >
        {file ? (
          <div className="flex flex-col items-center animate-fade-in">
            <div className="w-12 h-12 rounded-2xl bg-primary-lavender/20 flex items-center justify-center text-primary-lavender mb-3">
              <FileText size={22} />
            </div>
            <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{file.name}</p>
            <div className="flex items-center gap-1.5 mt-1 text-green-500">
              <CheckCircle2 size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Ready to scan</span>
            </div>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-primary-lavender/10 flex items-center justify-center text-primary-lavender mb-3">
              <Upload size={22} />
            </div>
            <p className="text-sm font-bold text-gray-700">Upload lab report</p>
            <p className="text-[11px] text-gray-400 mt-1">PDF, PNG or JPG</p>
          </>
        )}
      </div>

      {/* Extracted chips */}
      {scanned && chips.length > 0 && (
        <div className="mb-5 animate-fade-in">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Extracted Values</p>
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span key={chip.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-lavender/10 text-deep-lavender rounded-full text-[10px] font-bold border border-primary-lavender/20">
                <span className="text-gray-500">{chip.label}:</span> {chip.value}
              </span>
            ))}
          </div>
        </div>
      )}

      {scanned && chips.length === 0 && (
        <div className="mb-5 p-3 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 text-[11px] font-bold">
          No clinical values detected. Please ensure the document is clear and contains LH, FSH, or Insulin data.
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleScanLab}
          disabled={!file || isScanning}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] bg-gradient-to-r from-primary-lavender to-deep-lavender text-white text-xs font-bold uppercase tracking-widest hover:shadow-glow hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isScanning ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ScanLine size={15} />
          )}
          {isScanning ? 'Scanning...' : 'Scan Lab Test'}
        </button>
        <button
          onClick={() => onAutoFill(extractedData)}
          disabled={!scanned || chips.length === 0}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-xs font-bold uppercase tracking-widest transition-all border ${scanned && chips.length > 0
              ? 'bg-white border-primary-lavender/30 text-deep-lavender hover:bg-primary-lavender/5 shadow-sm'
              : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          <Zap size={15} /> Auto-fill Fields
        </button>
      </div>
    </div>
  );
}

