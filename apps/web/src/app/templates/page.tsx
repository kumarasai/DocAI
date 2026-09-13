"use client";

import { useState, useEffect, useRef } from "react";
import { 
  FileText, Plus, Upload, ShieldCheck, HelpCircle, FileCode, CheckCircle2, ChevronRight, 
  FileBox, Code, PlayCircle, Download, Check, Save, FileSignature, Layers
} from "lucide-react";

export default function Templates() {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/templates/");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
        if (data.length > 0 && !activeTemplate) {
          setActiveTemplate(data[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to fetch templates", e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/templates/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        await fetchTemplates();
        setActiveTemplate(data.id);
      } else {
        const errorData = await res.json();
        alert("Upload failed: " + (errorData.detail || res.statusText));
      }
    } catch (e) {
      console.error(e);
      alert("Error connecting to server.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase tracking-wider">Engine V4.19</span>
            <span className="text-xs text-slate-500 font-medium tracking-wide">• Telangana & AP Land Revenue Taxonomy</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Document Templates Library</h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Manage legally certified master templates and configure dynamic placeholder bindings (<span className="text-indigo-600 font-mono bg-indigo-50 px-1 rounded">{'{{field_name}}'}</span>) mapped directly to OCR-extracted property deed entities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".docx" 
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-white text-slate-700 font-medium text-sm rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload Master (.docx)'}
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white font-medium text-sm rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
            <Plus className="w-4 h-4" />
            Create New Template
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-full whitespace-nowrap flex items-center gap-2">
          All Templates <span className="bg-indigo-500 text-white px-1.5 py-0.5 rounded-full text-[10px]">{templates.length}</span>
        </button>
        <button className="px-4 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 text-sm font-medium rounded-full whitespace-nowrap flex items-center gap-2 transition-colors">
          <FileSignature className="w-3.5 h-3.5" /> Affidavits & Undertakings
        </button>
      </div>

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Master Registry Files */}
        <div className="lg:col-span-4 flex flex-col h-full bg-slate-50 rounded-xl">
          <div className="flex items-center justify-between mb-4 px-2 pt-2">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <FileBox className="w-4 h-4 text-indigo-500" /> Master Registry Files
            </h3>
            <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              {templates.length} active
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto pr-2 pb-10">
            {templates.length === 0 ? (
              <div className="text-center p-6 text-slate-500 text-sm">No templates found. Upload one to get started.</div>
            ) : templates.map((tpl) => {
              const isActive = activeTemplate === tpl.id;
              return (
                <div 
                  key={tpl.id} 
                  onClick={() => setActiveTemplate(tpl.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${isActive ? 'bg-indigo-50/50 border-indigo-200 shadow-sm relative' : 'bg-white border-slate-200 hover:border-indigo-100 shadow-sm'}`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-l-xl"></div>}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tpl.iconBg || 'bg-indigo-50'} ${tpl.iconColor || 'text-indigo-500'}`}>
                        <FileSignature className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{tpl.title}</h4>
                        <p className="text-xs text-slate-500">{tpl.subtitle}</p>
                      </div>
                    </div>
                    {isActive ? (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold rounded">Active</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded">v1.0</span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {tpl.tags.map((tag: string) => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        {tag}
                      </span>
                    ))}
                    {tpl.formats.map((fmt: string) => (
                      <span key={fmt} className="px-1.5 py-0.5 bg-slate-200/70 text-slate-600 text-[10px] font-bold rounded uppercase">{fmt}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> In Use ({tpl.usage})</span>
                    <span>Modified {tpl.modified}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Configuration & Preview */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Config Header */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded tracking-wide border border-emerald-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  LIVE SYNCHRONIZER ACTIVE
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Checksum: 8FA-2025</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded border border-slate-200 hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Download Master
                </button>
                <button className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-1.5">
                  <PlayCircle className="w-3.5 h-3.5" /> Test with Sample Deed
                </button>
                <button className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-sm">
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              Configuring: {activeTemplate ? templates.find(t => t.id === activeTemplate)?.title : "Select a Template"}
            </h2>
            <p className="text-sm text-slate-500">
              {activeTemplate ? templates.find(t => t.id === activeTemplate)?.subtitle : "Select a template from the list on the left"}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto bg-slate-50/50 flex flex-col">
            {/* Field Bindings Table */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-900">Field-Level Placeholder Bindings</h3>
                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded ml-2">Defined</span>
                <span className="text-xs text-slate-500 ml-auto">Changes reflect immediately in OCR compile tests</span>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden text-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/80 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Template Placeholder</th>
                      <th className="px-4 py-3">Source AI Extracted Field</th>
                      <th className="px-4 py-3">Data Category</th>
                      <th className="px-4 py-3 text-right">Confidence & Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(() => {
                      const activeTemplateObj = activeTemplate ? templates.find(t => t.id === activeTemplate) : null;
                      if (!activeTemplateObj || !activeTemplateObj.mappings || Object.keys(activeTemplateObj.mappings).length === 0) {
                        return (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                              No placeholders found in this template.
                            </td>
                          </tr>
                        );
                      }
                      return Object.keys(activeTemplateObj.mappings).map((key, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-4 py-3 font-mono text-indigo-600 font-bold bg-indigo-50/30 group-hover:bg-indigo-50/50 transition-colors border-r border-slate-100">
                            <span className="text-indigo-300 mr-1">{'<>'}</span>{`{{${key}}}`}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-800">Auto-mapped to AI Extraction</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-medium rounded">Text</span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="inline-flex items-center gap-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded">
                              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Ready</span>
                            </span>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Simulated Render Preview */}
            <div className="flex-1 p-6 bg-slate-100/50 border-t border-slate-200 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4 text-indigo-500" /> Simulated Render Output Preview
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">Page 1 of 2</span>
                  <button className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 hover:bg-indigo-100 transition-colors">Raw Template</button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-10 shadow-sm max-w-3xl mx-auto w-full relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
                <FileText className="w-16 h-16 text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-2">Preview Available in Processing</h3>
                <p className="text-sm text-slate-500 max-w-md text-center">
                  To see this template rendered with actual data, go to the <strong>New Processing</strong> tab, upload a source document, and generate the final output.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
