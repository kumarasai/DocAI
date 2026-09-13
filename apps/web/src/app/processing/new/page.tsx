"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, CheckCircle2, FileText, Check, FileCode, Edit3, Download, Plus, ChevronDown, CheckCircle, Loader2 } from "lucide-react";

export default function NewProcessing() {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  
  const [file, setFile] = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [generatedDocs, setGeneratedDocs] = useState<{[key: string]: { preview_text: string, download_url: string, is_edited?: boolean }}>({});
  const [editingPreview, setEditingPreview] = useState(false);
  const [downloadingDoc, setDownloadingDoc] = useState(false);
  
  const [templates, setTemplates] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/templates/")
      .then(res => res.json())
      .then(data => setTemplates(data))
      .catch(err => console.error("Failed to load templates", err));
  }, []);

  useEffect(() => {
    let interval: any;
    if (extracting) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return 95;
          // Random increment to look like real progress
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 1000);
    } else if (!extracting && extractedData.length > 0) {
      setProgress(100);
    }
    return () => clearInterval(interval);
  }, [extracting, extractedData.length]);

  const handleFieldChange = (idx: number, newValue: string) => {
    const newData = [...extractedData];
    newData[idx].value = newValue;
    setExtractedData(newData);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    if (selectedDocs.length === 0) {
      alert("Please select at least one template first!");
      return;
    }
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setExtracting(true);
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("template_ids", JSON.stringify(selectedDocs));

    try {
      const res = await fetch("http://127.0.0.1:8000/documents/extract", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setExtractedData(data.extracted_data || []);
      } else {
        const err = await res.json();
        alert("Extraction failed: " + (err.detail || "Server error"));
      }
    } catch (e) {
      console.error(e);
      alert("Error connecting to server for extraction.");
    } finally {
      setExtracting(false);
    }
  };

  const toggleDoc = (docId: string) => {
    setSelectedDocs(prev => 
      prev.includes(docId) ? prev.filter(d => d !== docId) : [...prev, docId]
    );
    if (!selectedDocs.includes(docId) && !activeTab) {
        setActiveTab(docId);
        setEditingPreview(false);
    } else if (selectedDocs.includes(docId) && activeTab === docId) {
        const remaining = selectedDocs.filter(d => d !== docId);
        setActiveTab(remaining.length > 0 ? remaining[0] : '');
        setEditingPreview(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedDocs.length || !extractedData.length) return;
    setGenerating(true);
    
    // format extracted data mapping
    const mapping: {[key: string]: string} = {};
    extractedData.forEach(d => mapping[d.label] = d.value);
    
    try {
      const newGeneratedDocs = { ...generatedDocs };
      for (const docId of selectedDocs) {
        const res = await fetch("http://127.0.0.1:8000/documents/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            template_id: docId,
            extracted_data: mapping
          }),
        });
        if (res.ok) {
          const data = await res.json();
          newGeneratedDocs[docId] = {
            preview_text: data.preview_text,
            download_url: data.download_url
          };
        } else {
            console.error("Failed to generate doc", await res.text());
        }
      }
      setGeneratedDocs(newGeneratedDocs);
    } catch (e) {
      console.error(e);
      alert("Error generating documents");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (docId: string) => {
    const docData = generatedDocs[docId];
    if (!docData) return;
    
    if (!docData.is_edited) {
        // Not edited, download the original formatted file
        const a = document.createElement("a");
        a.href = docData.download_url;
        a.download = "Final_Document.docx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
    }

    setDownloadingDoc(true);
    try {
      const originalFilename = docData.download_url.split('/').pop();
      const mapping: {[key: string]: string} = {};
      extractedData.forEach(d => mapping[d.label] = d.value);

      const res = await fetch("http://127.0.0.1:8000/documents/save-edited", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            text: docData.preview_text,
            original_filename: originalFilename,
            extracted_data: mapping
        })
      });
      if (res.ok) {
        const data = await res.json();
        const a = document.createElement("a");
        a.href = data.download_url;
        a.download = "Final_Document_Edited.docx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert("Failed to prepare edited document for download.");
      }
    } catch (e) {
      console.error(e);
      alert("Error downloading edited document.");
    } finally {
      setDownloadingDoc(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-full pb-6 animate-in fade-in duration-500">
      
      {/* LEFT COLUMN: Input & Setup (Steps 1 and 2) */}
      <div className="xl:col-span-4 space-y-6 flex flex-col">
        
        {/* Step 1: Select Templates */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">1</div>
            <h2 className="text-lg font-bold text-slate-900">Select Templates to Generate</h2>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 overflow-x-auto max-h-[300px] overflow-y-auto">
            {templates.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No templates available. Please upload them in the Templates Library first.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {templates.map((doc) => {
                  const isSelected = selectedDocs.includes(doc.id);
                  return (
                    <div key={doc.id} onClick={() => toggleDoc(doc.id)} className={`w-[calc(50%-6px)] flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-indigo-600 bg-indigo-50/30 shadow-sm' : 'border-slate-200 hover:border-indigo-200 bg-white'}`}>
                      <FileCode className={`w-6 h-6 text-indigo-500 mb-2`} strokeWidth={1.5} />
                      <span className="font-semibold text-slate-900 text-xs text-center line-clamp-2">{doc.title}</span>
                      <div className={`mt-2 w-4 h-4 rounded flex items-center justify-center border transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                        {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Upload Zone */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">2</div>
            <h2 className="text-lg font-bold text-slate-900">Upload Registration Document</h2>
          </div>

          {!file && (
            <div 
              onClick={() => {
                if (selectedDocs.length === 0) {
                  alert("Please select at least one template first!");
                  return;
                }
                fileInputRef.current?.click();
              }}
              className={`bg-white rounded-2xl p-6 border-2 border-dashed flex flex-col items-center justify-center text-center transition-colors ${selectedDocs.length === 0 ? 'border-slate-200 opacity-60 cursor-not-allowed' : 'border-indigo-200 cursor-pointer hover:bg-indigo-50/50'}`}
            >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                accept=".pdf,.jpg,.jpeg,.png" 
                onChange={handleFileUpload}
              />
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 text-white shadow-sm ${selectedDocs.length === 0 ? 'bg-slate-400' : 'bg-indigo-600 shadow-indigo-200'}`}>
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-slate-600 font-medium text-sm mb-1">Drag & drop your PDF here</p>
              <button 
                disabled={selectedDocs.length === 0}
                className="mt-3 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white text-sm rounded-lg font-medium transition-colors shadow-sm"
              >
                Choose File
              </button>
            </div>
          )}

          {/* Uploaded File */}
          {file && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {extracting ? `Analyzing Document... ${progress}%` : 'Uploaded successfully'}
                    </p>
                  </div>
                </div>
                {extracting ? (
                  <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                )}
              </div>
              {extracting && (
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Extracted Details */}
        {extractedData.length > 0 && !extracting && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col max-h-[400px]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-slate-900 text-sm">Extracted Details</h3>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] uppercase font-bold rounded border border-emerald-100 tracking-wider">AI Extracted</span>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center justify-center p-1.5 rounded-md transition-colors ${isEditing ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              >
                {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              </button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-1">
              {extractedData.map((field, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-start justify-between text-sm">
                  <span className="text-slate-500 w-1/3 shrink-0 py-1">{field.label}</span>
                  {isEditing ? (
                    <input 
                      type="text"
                      className="sm:w-2/3 px-2 py-1 text-sm border border-slate-300 rounded focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={field.value}
                      onChange={(e) => handleFieldChange(idx, e.target.value)}
                    />
                  ) : (
                    <span className="text-slate-900 font-medium sm:w-2/3 sm:text-left py-1 break-all">{field.value}</span>
                  )}
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100 shrink-0">
              <button 
                onClick={() => { setFile(null); setExtractedData([]); }} 
                className="w-full py-2 bg-white text-indigo-600 font-medium text-xs rounded-lg border border-indigo-100 flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors shadow-sm"
              >
                Upload Different Document
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMNS (Step 3) */}
      <div className="xl:col-span-8 space-y-6 flex flex-col h-full">
        {selectedDocs.length > 0 && (
          <div className="flex-1 flex flex-col min-h-[600px]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">3</div>
                <h2 className="text-lg font-bold text-slate-900">Preview & Edit Generated Documents</h2>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleGenerate}
                  disabled={generating || !extractedData.length}
                  className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {generating ? "Generating..." : "Generate Selected"}
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-slate-100 overflow-x-auto bg-slate-50/50">
                {selectedDocs.map(docId => {
                  const doc = templates.find(t => t.id === docId);
                  if (!doc) return null;
                  return (
                    <button 
                      key={docId}
                      onClick={() => { setActiveTab(docId); setEditingPreview(false); }}
                      className={`flex items-center gap-3 px-6 py-3 text-sm font-medium border-r border-slate-100 transition-colors ${activeTab === docId ? 'bg-indigo-50/50 text-indigo-700 border-t-2 border-t-indigo-600 shadow-[0_-1px_0_0_white]' : 'text-slate-600 hover:bg-white hover:text-slate-900 border-t-2 border-t-transparent'}`}
                    >
                      {doc.title}
                      <span className="text-slate-400 hover:text-slate-600" onClick={(e) => { e.stopPropagation(); toggleDoc(docId); }}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></span>
                    </button>
                  );
                })}
              </div>

              {/* Preview and Side Panel */}
              <div className="flex-1 flex flex-col md:flex-row min-h-0 bg-slate-50/30">
                
                {/* Document Preview */}
                <div className="flex-1 p-6 overflow-y-auto border-r border-slate-200 flex items-start justify-center">
                  {generatedDocs[activeTab] ? (
                    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm max-w-2xl w-full">
                       <div className="flex justify-end gap-2 mb-4">
                         <button 
                           onClick={() => setEditingPreview(!editingPreview)}
                           className="px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-medium rounded hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                         >
                           <Edit3 className="w-3.5 h-3.5" /> {editingPreview ? "View Mode" : "Edit Text"}
                         </button>
                         <button 
                           onClick={() => handleDownload(activeTab)} 
                           disabled={downloadingDoc}
                           className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded hover:bg-indigo-100 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                         >
                           {downloadingDoc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />} 
                           {downloadingDoc ? "Preparing..." : (generatedDocs[activeTab].is_edited ? "Download Edited .docx" : "Download Final .docx")}
                         </button>
                       </div>
                       {editingPreview ? (
                         <textarea 
                           className="w-full min-h-[400px] text-sm text-slate-800 leading-relaxed font-serif p-4 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-y"
                           value={generatedDocs[activeTab].preview_text}
                           onChange={(e) => {
                             setGeneratedDocs(prev => ({
                               ...prev,
                               [activeTab]: {
                                 ...prev[activeTab],
                                 preview_text: e.target.value,
                                 is_edited: true
                               }
                             }))
                           }}
                         />
                       ) : (
                         <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-serif">
                           {(() => {
                             const text = generatedDocs[activeTab].preview_text;
                             if (!text || !extractedData.length) return text;
                             
                             const errorStrings = ["NOT FOUND", "Google API Overloaded", "API Quota Exceeded", "AI Extraction Error"];
                             
                             const validValues = extractedData
                               .map(d => d.value)
                               .filter(v => v && typeof v === 'string' && v.trim() !== '' && !errorStrings.includes(v) && v.length > 1);
                               
                             const allHighlightStrings = Array.from(new Set([...validValues, ...errorStrings])).sort((a, b) => b.length - a.length);
                               
                             if (allHighlightStrings.length === 0) return text;
                             
                             const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                             const regex = new RegExp(`(${allHighlightStrings.map(escapeRegExp).join('|')})`, 'g');
                             
                             const parts = text.split(regex);
                             return parts.map((part, i) => {
                               if (errorStrings.includes(part)) {
                                 return <strong key={i} className="font-bold text-red-600 bg-red-50 px-1 border border-red-200 rounded">{part}</strong>;
                               } else if (validValues.includes(part)) {
                                 return <strong key={i} className="font-bold text-indigo-900 bg-indigo-50/80 px-0.5 rounded">{part}</strong>;
                               }
                               return part;
                             });
                           })()}
                         </div>
                       )}
                    </div>
                  ) : (
                    <div className="text-center my-auto">
                      <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="font-bold text-slate-700 mb-2">Live Preview Pending</h3>
                      <p className="text-slate-500 text-sm max-w-sm">
                        The document preview will render here once the "Generate Selected" button is clicked and the backend replaces all placeholders with the extracted data.
                      </p>
                    </div>
                  )}
                </div>

                {/* Side Panel */}
                <div className="w-full md:w-[300px] bg-white p-6 shrink-0 flex flex-col">
                  <h4 className="font-bold text-slate-900 mb-4 text-sm">Extracted Mappings</h4>
                  <div className="space-y-3 mb-8 overflow-y-auto flex-1">
                    {extractedData.length > 0 ? extractedData.map((field, idx) => (
                      <div key={idx} className="flex flex-col gap-1 border-b border-slate-100 pb-2">
                        <span className="text-xs text-slate-500">{field.label}</span>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="text-sm font-medium text-slate-800 line-clamp-1">{field.value}</span>
                        </div>
                      </div>
                    )) : (
                      <p className="text-sm text-slate-400">Upload a document to extract fields.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
