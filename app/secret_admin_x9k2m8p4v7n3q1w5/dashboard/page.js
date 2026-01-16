'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [celebrities, setCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [bulkNames, setBulkNames] = useState('');
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0, name: '' });
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const isAdmin = localStorage.getItem('adminAuth');
    if (!isAdmin) {
      router.push('/admin/login');
      return;
    }
    fetchCelebrities();
  }, []);

  async function fetchCelebrities() {
    try {
      const response = await fetch('/api/admin/get-all-celebrities');
      const data = await response.json();
      setCelebrities(data.celebrities || []);
    } catch (error) {
      console.error('Error fetching celebrities:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('adminAuth');
    router.push('/admin/login');
  }

  function startEdit(celebrity) {
    setEditingId(celebrity._id);
    setEditData({
      name: celebrity.name,
      profession: celebrity.profession,
      stance: celebrity.stance,
      aiConfidence: celebrity.aiConfidence,
      featured: celebrity.featured,
      sources: celebrity.sources.join('\n')
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData({});
  }

  async function saveEdit(id) {
    try {
      const response = await fetch('/api/admin/update-celebrity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          updates: {
            name: editData.name,
            profession: editData.profession,
            stance: editData.stance,
            aiConfidence: parseInt(editData.aiConfidence),
            featured: editData.featured,
            sources: editData.sources.split('\n').filter(s => s.trim())
          }
        })
      });

      if (response.ok) {
        await fetchCelebrities();
        cancelEdit();
      }
    } catch (error) {
      console.error('Error updating celebrity:', error);
    }
  }

  async function toggleFeatured(id, currentStatus) {
    try {
      const response = await fetch('/api/admin/toggle-featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, featured: !currentStatus })
      });

      if (response.ok) {
        await fetchCelebrities();
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  }

  async function deleteCelebrity(id, name) {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;

    try {
      const response = await fetch('/api/admin/delete-celebrity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (response.ok) {
        await fetchCelebrities();
      }
    } catch (error) {
      console.error('Error deleting celebrity:', error);
    }
  }

  async function handleBulkImport() {
    const names = bulkNames.split('\n').filter(n => n.trim());
    
    if (names.length === 0) {
      alert('Please enter at least one celebrity name');
      return;
    }

    if (!confirm(`Import ${names.length} celebrities? This will take ${names.length * 3} seconds.`)) {
      return;
    }

    setImporting(true);
    setImportProgress({ current: 0, total: names.length, name: '' });

    for (let i = 0; i < names.length; i++) {
      const name = names[i].trim();
      setImportProgress({ current: i + 1, total: names.length, name });

      try {
        await fetch('/api/search-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name })
        });

        // Wait 3 seconds between requests
        if (i < names.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      } catch (error) {
        console.error(`Error importing ${name}:`, error);
      }
    }

    setImporting(false);
    setBulkNames('');
    setShowBulkImport(false);
    await fetchCelebrities();
    alert('Bulk import complete!');
  }

  const filteredCelebrities = celebrities.filter(c => {
    if (filter === 'all') return true;
    return c.stance === filter;
  });

  const stats = {
    total: celebrities.length,
    pro: celebrities.filter(c => c.stance === 'pro').length,
    neutral: celebrities.filter(c => c.stance === 'neutral').length,
    against: celebrities.filter(c => c.stance === 'against').length,
    featured: celebrities.filter(c => c.featured).length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Manage Palestine Stance database</p>
          </div>
          <div className="flex gap-4">
            <Link href="/" className="px-4 py-2 text-gray-700 hover:text-green-600">
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Entries</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-800">{stats.pro}</div>
            <div className="text-sm text-green-600">Pro-Palestine</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-800">{stats.neutral}</div>
            <div className="text-sm text-gray-600">Neutral</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-800">{stats.against}</div>
            <div className="text-sm text-red-600">Pro-Israel</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-800">{stats.featured}</div>
            <div className="text-sm text-yellow-600">Featured</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('pro')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'pro' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}
            >
              Pro ({stats.pro})
            </button>
            <button
              onClick={() => setFilter('neutral')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'neutral' ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Neutral ({stats.neutral})
            </button>
            <button
              onClick={() => setFilter('against')}
              className={`px-4 py-2 rounded-lg font-medium ${filter === 'against' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'}`}
            >
              Against ({stats.against})
            </button>
          </div>
          
          <button
            onClick={() => setShowBulkImport(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            📥 Bulk Import
          </button>
        </div>

        {/* Bulk Import Modal */}
        {showBulkImport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold mb-4">Bulk Import Celebrities</h2>
              
              {!importing ? (
                <>
                  <p className="text-gray-600 mb-4">
                    Enter celebrity names (one per line). AI will research each one automatically.
                  </p>
                  
                  <textarea
                    value={bulkNames}
                    onChange={(e) => setBulkNames(e.target.value)}
                    className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    placeholder="Bella Hadid&#10;Mark Ruffalo&#10;Dua Lipa&#10;Roger Waters&#10;Susan Sarandon"
                  />
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> This will take ~3 seconds per celebrity. 
                      {bulkNames.split('\n').filter(n => n.trim()).length > 0 && 
                        ` Estimated time: ${bulkNames.split('\n').filter(n => n.trim()).length * 3} seconds`
                      }
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleBulkImport}
                      className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                    >
                      Start Import
                    </button>
                    <button
                      onClick={() => {
                        setShowBulkImport(false);
                        setBulkNames('');
                      }}
                      className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-6"></div>
                  <h3 className="text-xl font-bold mb-2">
                    Importing... ({importProgress.current}/{importProgress.total})
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Researching: {importProgress.name}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Please don't close this window
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Celebrity List */}
        <div className="space-y-4">
          {filteredCelebrities.map((celebrity) => (
            <div key={celebrity._id} className="bg-white p-6 rounded-lg shadow">
              {editingId === celebrity._id ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Profession</label>
                      <input
                        type="text"
                        value={editData.profession}
                        onChange={(e) => setEditData({...editData, profession: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Stance</label>
                      <select
                        value={editData.stance}
                        onChange={(e) => setEditData({...editData, stance: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="pro">Pro-Palestine</option>
                        <option value="neutral">Neutral</option>
                        <option value="against">Pro-Israel</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Confidence (%)</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editData.aiConfidence}
                        onChange={(e) => setEditData({...editData, aiConfidence: e.target.value})}
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Sources (one per line)</label>
                    <textarea
                      value={editData.sources}
                      onChange={(e) => setEditData({...editData, sources: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg"
                      rows="4"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editData.featured}
                      onChange={(e) => setEditData({...editData, featured: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-medium">Featured</label>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(celebrity._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{celebrity.name}</h3>
                      <p className="text-gray-600">{celebrity.profession}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      {celebrity.featured && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                          ⭐ Featured
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        celebrity.stance === 'pro' ? 'bg-green-100 text-green-800' :
                        celebrity.stance === 'against' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {celebrity.stance === 'pro' ? 'Pro-Palestine' :
                         celebrity.stance === 'against' ? 'Pro-Israel' : 'Neutral'}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Confidence: {celebrity.aiConfidence}% • Sources: {celebrity.sources.length}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(celebrity)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleFeatured(celebrity._id, celebrity.featured)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                    >
                      {celebrity.featured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      onClick={() => deleteCelebrity(celebrity._id, celebrity.name)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}