import React, { useState, useEffect } from 'react';
import { 
  Save, 
  DownloadCloud, 
  Trash2, 
  Plus, 
  Edit3, 
  Check, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { loadGovernorates, saveGovernorates, mockImportFromGoogleMaps } from '../services/dataService';
import { enhancePlaceDescriptions } from '../services/geminiService';
import { Governorate, CategoryType, Place } from '../types';

const AdminDashboard: React.FC = () => {
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [selectedGovId, setSelectedGovId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'import'>('overview');
  
  // Import State
  const [importCategory, setImportCategory] = useState<CategoryType>(CategoryType.RESTAURANT);
  const [isImporting, setIsImporting] = useState(false);
  const [importedPlaces, setImportedPlaces] = useState<Place[]>([]);
  const [isEnhancing, setIsEnhancing] = useState(false);

  useEffect(() => {
    const data = loadGovernorates();
    setGovernorates(data);
    if (data.length > 0) setSelectedGovId(data[0].id);
  }, []);

  const selectedGov = governorates.find(g => g.id === selectedGovId);

  const handleSave = () => {
    saveGovernorates(governorates);
    alert('All changes saved to local database successfully!');
  };

  // Simulate fetching from Google Maps
  const handleImport = async () => {
    if (!selectedGov) return;
    setIsImporting(true);
    try {
      const places = await mockImportFromGoogleMaps(selectedGov.name, importCategory);
      setImportedPlaces(places);
    } catch (error) {
      console.error(error);
      alert("Failed to import data");
    } finally {
      setIsImporting(false);
    }
  };

  // AI Enhancement using Gemini
  const handleAiEnhance = async () => {
    if (!selectedGov || importedPlaces.length === 0) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhancePlaceDescriptions(importedPlaces, selectedGov.name);
      setImportedPlaces(enhanced);
    } catch (error) {
      alert("AI Enhancement failed. Check console.");
    } finally {
      setIsEnhancing(false);
    }
  };

  // Commit imported places to the main list
  const handleCommitImport = () => {
    if (!selectedGov) return;
    const updatedGov = { ...selectedGov, places: [...selectedGov.places, ...importedPlaces] };
    const updatedList = governorates.map(g => g.id === selectedGov.id ? updatedGov : g);
    setGovernorates(updatedList);
    setImportedPlaces([]); // Clear staging
    alert(`${importedPlaces.length} places added to ${selectedGov.name}`);
  };

  const handleDeletePlace = (placeId: string) => {
    if (!selectedGov) return;
    if (!window.confirm('Are you sure?')) return;
    
    const updatedGov = {
      ...selectedGov,
      places: selectedGov.places.filter(p => p.id !== placeId)
    };
    setGovernorates(governorates.map(g => g.id === selectedGov.id ? updatedGov : g));
  };

  if (!selectedGov) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Control Panel</h1>
          <p className="text-slate-500">Manage content and Maps integration</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm transition-all"
        >
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Selector */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
            Select Governorate
          </div>
          <div className="divide-y divide-slate-100">
            {governorates.map(g => (
              <button
                key={g.id}
                onClick={() => { setSelectedGovId(g.id); setActiveTab('overview'); }}
                className={`w-full text-left px-4 py-3 flex justify-between items-center hover:bg-slate-50 transition-colors ${selectedGovId === g.id ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500' : ''}`}
              >
                <span>{g.name}</span>
                <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-full">{g.places.length}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Area */}
        <div className="lg:col-span-3">
          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-slate-200">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-2 font-medium transition-colors relative ${activeTab === 'overview' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Overview & Edit
              {activeTab === 'overview' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('import')}
              className={`pb-3 px-2 font-medium transition-colors relative ${activeTab === 'import' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Import from Maps
              {activeTab === 'import' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600"></span>}
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Current Places in {selectedGov.name}</h2>
                <button className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-md flex items-center gap-1">
                  <Plus size={14} /> Manual Add
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 text-sm">
                      <th className="p-3 rounded-tl-lg">Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Rating</th>
                      <th className="p-3">Source</th>
                      <th className="p-3 rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedGov.places.map(place => (
                      <tr key={place.id} className="hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-800">{place.name}</td>
                        <td className="p-3 text-slate-600 text-sm">{place.type}</td>
                        <td className="p-3 text-slate-600 text-sm">{place.rating.toFixed(1)}</td>
                        <td className="p-3">
                          {place.isManual ? 
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Manual</span> : 
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Maps API</span>
                          }
                        </td>
                        <td className="p-3 flex gap-2">
                          <button className="p-1 text-slate-400 hover:text-emerald-600"><Edit3 size={16} /></button>
                          <button onClick={() => handleDeletePlace(place.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {selectedGov.places.length === 0 && (
                  <div className="text-center py-8 text-slate-500">No places found. Go to Import tab.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-6">
              {/* Import Controls */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold mb-4">1. Fetch Data</h2>
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-grow w-full md:w-auto">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <select 
                      value={importCategory}
                      onChange={(e) => setImportCategory(e.target.value as CategoryType)}
                      className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      {Object.values(CategoryType).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    onClick={handleImport}
                    disabled={isImporting}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 transition-all"
                  >
                    {isImporting ? <RefreshCw className="animate-spin" size={18} /> : <DownloadCloud size={18} />}
                    {isImporting ? 'Fetching...' : 'Import from Google Maps'}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">Simulates connection to Google Places API for the selected region.</p>
              </div>

              {/* Staging Area */}
              {importedPlaces.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 border-indigo-500 animate-fade-in">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">2. Review & Enhance</h2>
                    <div className="flex gap-2">
                       <button 
                        onClick={handleAiEnhance}
                        disabled={isEnhancing}
                        className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        title="Use Gemini AI to write better descriptions"
                      >
                        <Sparkles size={16} />
                        {isEnhancing ? 'Generating...' : 'AI Polish'}
                      </button>
                      <button 
                        onClick={handleCommitImport}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                      >
                        <Check size={16} />
                        Confirm Import
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {importedPlaces.map(place => (
                      <div key={place.id} className="border border-slate-200 rounded-lg p-4 flex gap-4 bg-slate-50">
                        <div className="w-16 h-16 bg-slate-200 rounded-md flex-shrink-0 overflow-hidden">
                            <img src={place.imageUrl} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{place.name}</h4>
                          <p className="text-xs text-slate-500 mb-2">{place.type}</p>
                          <p className="text-sm text-slate-600 italic">{place.description || "No description."}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;