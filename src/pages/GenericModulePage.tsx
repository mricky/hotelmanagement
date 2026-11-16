import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Pagination } from '../components/Pagination';

interface GenericModulePageProps {
  title: string;
  subtitle: string;
  apiEndpoint: string;
}

export const GenericModulePage: React.FC<GenericModulePageProps> = ({ title, subtitle, apiEndpoint }) => {
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchData();
  }, [apiEndpoint]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiEndpoint);
      const data = await res.json();
      if (data && data.status === 'success' && Array.isArray(data.data)) {
        setDataList(data.data);
      }
    } catch (err) {
      console.error(`Failed to fetch ${apiEndpoint} from Golang API:`, err);
    } finally {
      setLoading(false);
    }
  };

  const totalItems = dataList.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const pageData = dataList.slice(startIndex, startIndex + rowsPerPage);

  const formatDateValue = (key: string, val: any) => {
    if (typeof val === 'boolean') {
      return val ? '✅ YA' : '❌ TIDAK';
    }
    if (val && typeof val === 'string') {
      const keyLower = key.toLowerCase();
      const isDateField = keyLower.includes('at') || keyLower.includes('date') || keyLower.includes('created') || keyLower.includes('updated');
      const isIsoString = /^\d{4}-\d{2}-\d{2}/.test(val);

      if (isDateField || isIsoString) {
        const d = new Date(val);
        if (!isNaN(d.getTime())) {
          const day = String(d.getDate()).padStart(2, '0');
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
          const month = monthNames[d.getMonth()];
          const year = d.getFullYear();
          const hours = String(d.getHours()).padStart(2, '0');
          const mins = String(d.getMinutes()).padStart(2, '0');
          return `${day} ${month} ${year}, ${hours}:${mins} WIB`;
        }
      }
    }
    return String(val ?? '');
  };

  return (
    <div className="flex-1 min-w-0 pb-12">
      <Header title={title} subtitle={subtitle} />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900">{title} Data Records</h3>
            <span className="text-xs font-bold text-slate-400">PostgreSQL Golang Live API</span>
          </div>

          {loading ? (
            <p className="py-12 text-center text-slate-400 font-bold">Memuat data dari Golang Server...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {pageData[0] &&
                      Object.keys(pageData[0]).map((k) => (
                        <th key={k} className="py-3.5 px-4 capitalize">
                          {k.replace('_', ' ')}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {pageData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      {Object.entries(row).map(([k, val]: [string, any], vIdx) => (
                        <td key={vIdx} className="py-3.5 px-4 font-semibold text-slate-800">
                          {formatDateValue(k, val)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Reusable Enterprise Pagination */}
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
      </div>
    </div>
  );
};
