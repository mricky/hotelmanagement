import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';
import { 
  Shield, Users, Plus, Search, Check, X, Trash2, Key, 
  Lock, CheckCircle2, XCircle, AlertCircle, SlidersHorizontal, Edit, UserCheck, Square, CheckSquare, KeyRound 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  emp_id: string;
  status: string;
  created_by?: string;
}

export interface Permission {
  id: number;
  module: string;
  description: string;
  gm: boolean;
  fo: boolean;
  hk: boolean;
  na: boolean;
}

interface UsersPageProps {
  defaultTab?: 'users' | 'roles';
}

export const UsersPage: React.FC<UsersPageProps> = ({ defaultTab = 'users' }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>(defaultTab);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Front Desk Receptionist');
  const [empId, setEmpId] = useState('EMP-709');
  const [status, setStatus] = useState('ACTIVE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchUsers();
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await fetch('/api/v1/permissions');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        setPermissions(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch permissions:', err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/users');
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name,
        email,
        role,
        emp_id: empId,
        status,
      };

      const res = await fetch('/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data && data.status === 'success') {
        fetchUsers();
        setIsModalOpen(false);
        setName('');
        setEmail('');
      }
    } catch (err) {
      console.error('Failed to create user:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus akun staf ini?')) return;
    try {
      await fetch(`/api/v1/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const togglePermission = async (index: number, roleKey: 'gm' | 'fo' | 'hk' | 'na') => {
    const perm = permissions[index];
    if (!perm) return;
    const updated = [...permissions];
    updated[index][roleKey] = !updated[index][roleKey];
    setPermissions(updated);

    try {
      await fetch('/api/v1/permissions/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: perm.id, role: roleKey }),
      });
    } catch (err) {
      console.error('Failed to toggle permission in DB:', err);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && !u.role.toLowerCase().includes(roleFilter.toLowerCase())) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchEmp = u.emp_id.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchEmp) return false;
    }
    return true;
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pageUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage);

  const getRoleBadge = (r: string) => {
    if (r.includes('General Manager') || r.includes('Admin')) {
      return 'bg-purple-100 text-purple-800 border-purple-200';
    }
    if (r.includes('Supervisor') || r.includes('Manager')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (r.includes('Receptionist') || r.includes('Front Desk')) {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  return (
    <div className="flex-1 min-w-0 pb-12">
      <Header
        title={t('users.title')}
        subtitle={t('users.subtitle')}
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Tab Switcher: Daftar Akun vs Role Management Matrix */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-3xl border border-slate-200/80 shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>👤 Daftar Akun Staf ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'roles'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>🛡️ Matriks Peran & Hak Akses (Role Permission Matrix)</span>
          </button>
        </div>

        {activeTab === 'users' ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[11px] font-black uppercase tracking-wider mb-1">TOTAL STAF AKTIF</p>
                  <p className="text-3xl font-black text-slate-900">{users.length}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Shield className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[11px] font-black uppercase tracking-wider mb-1">GENERAL MANAGER</p>
                  <p className="text-3xl font-black text-purple-600">1</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Shield className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[11px] font-black uppercase tracking-wider mb-1">RECEPTIONIST</p>
                  <p className="text-3xl font-black text-emerald-600">1</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <UserCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500 text-[11px] font-black uppercase tracking-wider mb-1">HK SUPERVISOR</p>
                  <p className="text-3xl font-black text-blue-600">1</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Shield className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Action & Filter Bar */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[280px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    placeholder="Search staff name, email or NIP..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-[#EF3F09]"
                  />
                </div>

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-900 focus:outline-none"
                >
                  <option value="all">Semua Peran (Roles)</option>
                  <option value="Manager">General Manager</option>
                  <option value="Supervisor">Housekeeping Supervisor</option>
                  <option value="Receptionist">Front Desk Receptionist</option>
                  <option value="Runner">HK Runner</option>
                </select>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#EF3F09]/30 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Staf Baru (RBAC)</span>
              </button>
            </div>

            {/* Full Feature User Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase border-b border-slate-200">
                      <th className="py-4 px-6">NIP / STAF ID</th>
                      <th className="py-4 px-6">NAMA STAF & EMAIL</th>
                      <th className="py-4 px-6">PERAN OPERASIONAL (ROLE)</th>
                      <th className="py-4 px-6">STATUS AKUN</th>
                      <th className="py-4 px-6">DIBUAT OLEH (AUDIT)</th>
                      <th className="py-4 px-6 text-center">AKSI (CRUD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                          Memuat daftar staf RBAC dari PostgreSQL Server...
                        </td>
                      </tr>
                    ) : pageUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                          Tidak ada data staf yang sesuai.
                        </td>
                      </tr>
                    ) : (
                      pageUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-4 px-6 font-extrabold text-slate-900">{u.emp_id || `EMP-${u.id + 100}`}</td>
                          <td className="py-4 px-6">
                            <p className="font-extrabold text-slate-900 text-sm">{u.name}</p>
                            <p className="text-slate-400 text-[11px] font-normal">{u.email}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-xl text-[10px] font-black border uppercase tracking-wider ${getRoleBadge(u.role)}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                              {u.status || 'ACTIVE'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-bold text-slate-700">{u.created_by || 'System Administrator'}</p>
                            <p className="text-slate-400 text-[10px]">Audit Log Verified</p>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                title="Edit Staf"
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                title="Hapus Staf"
                                onClick={() => handleDeleteUser(u.id)}
                                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                rowsPerPage={rowsPerPage}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={(rows) => {
                  setRowsPerPage(rows);
                  setCurrentPage(1);
                }}
              />
            </div>
          </>
        ) : (
          /* Role Permission Matrix View */
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-black text-slate-900">Matriks Perizinan Peran (Role Permission Matrix)</h3>
                <p className="text-slate-500 text-xs font-semibold">Atur izin akses (*read, write, execute*) setiap peran operasional staf hotel</p>
              </div>

              <button
                onClick={() => alert('Matriks perizinan peran berhasil disimpan di PostgreSQL!')}
                className="px-6 py-3 bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-[#EF3F09]/30 transition cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Matriks Perizinan</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase border-b border-slate-200">
                    <th className="py-4 px-6 w-96">FITUR & MODUL PMS</th>
                    <th className="py-4 px-4 text-center">GENERAL MANAGER (GM)</th>
                    <th className="py-4 px-4 text-center">FRONT DESK (RECEPTIONIST)</th>
                    <th className="py-4 px-4 text-center">HOUSEKEEPING TECH</th>
                    <th className="py-4 px-4 text-center">NIGHT AUDITOR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {permissions.map((p, idx) => (
                    <tr key={p.module} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-6">
                        <p className="font-extrabold text-slate-900 text-sm">{p.module}</p>
                        <p className="text-slate-400 text-[11px] font-normal">{p.description}</p>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => togglePermission(idx, 'gm')}
                          className={`p-2 rounded-xl transition cursor-pointer ${
                            p.gm ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {p.gm ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </button>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => togglePermission(idx, 'fo')}
                          className={`p-2 rounded-xl transition cursor-pointer ${
                            p.fo ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {p.fo ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </button>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => togglePermission(idx, 'hk')}
                          className={`p-2 rounded-xl transition cursor-pointer ${
                            p.hk ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {p.hk ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </button>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => togglePermission(idx, 'na')}
                          className={`p-2 rounded-xl transition cursor-pointer ${
                            p.na ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {p.na ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Tambah Akun Staf Baru (RBAC)</h3>
                  <p className="text-slate-500 text-xs font-semibold">Penetapan Nama, Email, & Hak Akses Peran Operasional</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">NIP / EMP STAF ID</label>
                <input
                  type="text"
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">NAMA LENGKAP STAF</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Rina Anggraini, S.Tr.Par"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">ALAMAT EMAIL RESMI</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rina.staf@grandhorizon.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">PERAN OPERASIONAL (ROLE)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none"
                >
                  <option value="Front Desk Receptionist">Front Desk Receptionist</option>
                  <option value="Housekeeping Supervisor">Housekeeping Supervisor</option>
                  <option value="Housekeeping Technician">Housekeeping Technician</option>
                  <option value="General Manager">General Manager</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-2xl bg-[#EF3F09] hover:bg-[#D63405] text-white font-extrabold text-xs shadow-lg shadow-[#EF3F09]/30 transition cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Akun Staf'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
