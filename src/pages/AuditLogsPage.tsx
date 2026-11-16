import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';
import { Search, Activity, Clock, Download, RotateCcw, Filter, Terminal, Shield, Server, RefreshCw, Trash2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AuditLogsPage: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'STAFF' | 'API'>('STAFF');
  const [logs, setLogs] = useState<any[]>([]);
  const [apiLogs, setApiLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Filter States for Staff Logs
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter States for API Logs
  const [apiSearchQuery, setApiSearchQuery] = useState('');
  const [apiMethodFilter, setApiMethodFilter] = useState('all');

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('tab') === 'api') {
      setActiveTab('API');
    } else {
      setActiveTab('STAFF');
    }
    fetchLogs();
    fetchApiLogs();
  }, [location.search]);

  useEffect(() => {
    let interval: any;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchLogs();
        fetchApiLogs();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/v1/audit-logs');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        setLogs(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApiLogs = async () => {
    try {
      const res = await fetch('/api/v1/api-logs');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        setApiLogs(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch API access logs:', err);
    }
  };

  const handleClearApiLogs = async () => {
    if (!window.confirm('Apakah Anda yakin ingin mengosongkan/reset seluruh Log Akses REST API di database PostgreSQL?')) {
      return;
    }
    try {
      const res = await fetch('/api/v1/api-logs', { method: 'DELETE' });
      const data = await res.json();
      if (data && data.status === 'success') {
        setApiLogs([]);
        alert('Log akses REST API berhasil dibersihkan/direset!');
      }
    } catch (e) {
      alert('Gagal mereset log API.');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setModuleFilter('all');
    setUserFilter('all');
    setActionFilter('all');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const uniqueUsers = Array.from(new Set(logs.map((l) => l.user)));
  const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));

  const filteredLogs = logs.filter((log) => {
    if (moduleFilter !== 'all' && log.module.toLowerCase() !== moduleFilter.toLowerCase()) return false;
    if (userFilter !== 'all' && log.user !== userFilter) return false;
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    if (startDate && log.created_at && log.created_at.substring(0, 10) < startDate) return false;
    if (endDate && log.created_at && log.created_at.substring(0, 10) > endDate) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.user.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.ip_address.includes(q)
      );
    }
    return true;
  });

  const filteredApiLogs = apiLogs.filter((log) => {
    if (apiMethodFilter !== 'all' && log.method !== apiMethodFilter) return false;
    if (apiSearchQuery) {
      const q = apiSearchQuery.toLowerCase();
      return (
        log.endpoint.toLowerCase().includes(q) ||
        log.client_ip.toLowerCase().includes(q) ||
        String(log.status_code).includes(q)
      );
    }
    return true;
  });

  const isFilterActive =
    searchQuery !== '' ||
    moduleFilter !== 'all' ||
    userFilter !== 'all' ||
    actionFilter !== 'all' ||
    startDate !== '' ||
    endDate !== '';

  const totalPages = Math.ceil(
    (activeTab === 'STAFF' ? filteredLogs.length : filteredApiLogs.length) / rowsPerPage
  ) || 1;

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const paginatedApiLogs = filteredApiLogs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const formatDate = (isoString: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return (
      date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) + ' WIB'
    );
  };

  const getMethodBadge = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-black text-[10px]">GET</span>;
      case 'POST':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">POST</span>;
      case 'PUT':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-black text-[10px]">PUT</span>;
      case 'DELETE':
        return <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-black text-[10px]">DELETE</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-black text-[10px]">{method}</span>;
    }
  };

  const getStatusBadge = (code: number) => {
    if (code >= 200 && code < 300) {
      return <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">{code} OK</span>;
    } else if (code >= 400 && code < 500) {
      return <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px]">{code} BAD REQ</span>;
    } else {
      return <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px]">{code} ERR</span>;
    }
  };

  return (
    <div className="flex-1 min-w-0 pb-12">
      <Header title="Audit Trail & System Security Telemetry" subtitle="Log aktivitas staf harian, jejak transaksi, & audit log REST API real-time" />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Top Tab Bar & Live Telemetry Control */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setActiveTab('STAFF'); setCurrentPage(1); }}
              className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'STAFF'
                  ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Log Aktivitas Staf</span>
            </button>

            <button
              onClick={() => { setActiveTab('API'); setCurrentPage(1); }}
              className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'API'
                  ? 'bg-[#EF3F09] text-white shadow-lg shadow-[#EF3F09]/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>⚡ Log Akses REST API & Telemetry (IT)</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer ${
                autoRefresh ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} />
              <span>Auto Refresh (3s): {autoRefresh ? 'ON' : 'OFF'}</span>
            </button>

            <a
              href="/api/v1/analytics/export-excel"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-2xl shadow transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Excel</span>
            </a>
          </div>
        </div>

        {/* STAFF AUDIT TAB */}
        {activeTab === 'STAFF' ? (
          <>
            {/* Filter Bar */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#EF3F09]" />
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Filter Audit Logs Terintegrasi
                  </h4>
                  {isFilterActive && (
                    <span className="px-2 py-0.5 bg-[#EF3F09]/10 text-[#EF3F09] text-[10px] font-black rounded-lg">
                      Filter Aktif
                    </span>
                  )}
                </div>
                {isFilterActive && (
                  <button
                    onClick={handleResetFilters}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reset Filter</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari staf, aksi, detail..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#EF3F09]"
                  />
                </div>

                <select
                  value={moduleFilter}
                  onChange={(e) => { setModuleFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#EF3F09]"
                >
                  <option value="all">Semua Modul System</option>
                  <option value="reservasi">Reservasi</option>
                  <option value="pos restoran & f&b">POS Restoran & F&B</option>
                  <option value="layanan hotel (laundry/spa)">Layanan Laundry & Spa</option>
                  <option value="housekeeping lost & found">Lost & Found</option>
                  <option value="night audit">Night Audit</option>
                </select>

                <select
                  value={userFilter}
                  onChange={(e) => { setUserFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#EF3F09]"
                >
                  <option value="all">Semua Staf User</option>
                  {uniqueUsers.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>

                <select
                  value={actionFilter}
                  onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#EF3F09]"
                >
                  <option value="all">Semua Tipe Aksi</option>
                  {uniqueActions.map((act) => (
                    <option key={act} value={act}>{act}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Staff Logs Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-slate-600">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-900 font-extrabold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4 pl-6">Waktu & Tanggal</th>
                      <th className="p-4">Staf Pengguna</th>
                      <th className="p-4">Tipe Aksi</th>
                      <th className="p-4">Modul Terkait</th>
                      <th className="p-4">Detail Perubahan</th>
                      <th className="p-4 pr-6">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={6} className="p-8 text-center text-slate-400">Memuat log aktivitas staf...</td></tr>
                    ) : paginatedLogs.length === 0 ? (
                      <tr><td colSpan={6} className="p-8 text-center text-slate-400">Tidak ada log aktivitas ditemukan.</td></tr>
                    ) : (
                      paginatedLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-4 pl-6 font-bold text-slate-900 whitespace-nowrap">{formatDate(log.created_at)}</td>
                          <td className="p-4 font-black text-slate-900">{log.user}</td>
                          <td className="p-4"><span className="px-2.5 py-0.5 rounded-full bg-slate-100 font-black text-[10px] text-slate-800">{log.action}</span></td>
                          <td className="p-4 font-bold text-slate-700">{log.module}</td>
                          <td className="p-4 font-semibold text-slate-800">{log.details}</td>
                          <td className="p-4 pr-6 font-mono text-[11px] text-slate-500">{log.ip_address}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* REST API LOGS TAB */
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari endpoint URI, IP address, atau status code..."
                  value={apiSearchQuery}
                  onChange={(e) => setApiSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto">
                {['all', 'GET', 'POST', 'PUT', 'DELETE'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setApiMethodFilter(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
                      apiMethodFilter === m ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {m === 'all' ? 'Semua Method' : m}
                  </button>
                ))}

                {(apiSearchQuery || apiMethodFilter !== 'all') && (
                  <button
                    onClick={() => { setApiSearchQuery(''); setApiMethodFilter('all'); }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Filter</span>
                  </button>
                )}

                <button
                  onClick={handleClearApiLogs}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-black text-xs rounded-xl transition border border-rose-200 flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Reset / Bersihkan Log API</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-950 text-slate-200 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden font-mono">
              <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Terminal className="w-4 h-4" />
                  <span>REST API Telemetry & Latency Monitor</span>
                </div>
                <span className="text-[10px] text-slate-500 font-bold">PostgreSQL Table: api_access_logs</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/60 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-4 pl-6">HTTP Method</th>
                      <th className="p-4">Endpoint Path</th>
                      <th className="p-4">Status Code</th>
                      <th className="p-4">Latency (ms)</th>
                      <th className="p-4">Client IP</th>
                      <th className="p-4 pr-6">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-[11px]">
                    {paginatedApiLogs.length === 0 ? (
                      <tr><td colSpan={6} className="p-8 text-center text-slate-500">Belum ada log request REST API yang terekam.</td></tr>
                    ) : (
                      paginatedApiLogs.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/50 transition">
                          <td className="p-4 pl-6">{getMethodBadge(item.method)}</td>
                          <td className="p-4 text-slate-100 font-bold">{item.endpoint}</td>
                          <td className="p-4">{getStatusBadge(item.status_code)}</td>
                          <td className="p-4 text-amber-400 font-bold">{item.latency_ms} ms</td>
                          <td className="p-4 text-slate-400">{item.client_ip}</td>
                          <td className="p-4 pr-6 text-slate-500">{formatDate(item.created_at)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={activeTab === 'STAFF' ? filteredLogs.length : filteredApiLogs.length}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
        />
      </div>
    </div>
  );
};
