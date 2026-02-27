import { useEffect, useState } from 'react';
import { BarChart3, Clock, CheckCircle2, XCircle, Activity } from 'lucide-react';

interface StatsData {
  total: number;
  valid: number;
  invalid: number;
  recent: {
    id: number;
    duration_ms: number;
    is_valid: number;
    created_at: string;
  }[];
}

export function StatsDashboard({ token, onLogout }: { token: string, onLogout: () => void }) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status === 401) {
          onLogout();
          throw new Error('未授權，請重新登入');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token, onLogout]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">載入統計數據中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
        <p className="font-bold mb-2">無法載入統計數據</p>
        <p className="text-sm opacity-80">{error}</p>
        <button onClick={onLogout} className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200">
          重新登入
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const validPercentage = stats.total > 0 ? Math.round((stats.valid / stats.total) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">系統統計儀表板</h2>
            <p className="text-slate-500 font-medium mt-1">即時監控評估表單填寫狀況</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
        >
          登出
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">總填寫次數</p>
            <p className="text-4xl font-black text-slate-800">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">有效填寫</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-slate-800">{stats.valid}</p>
              <span className="text-sm font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                {validPercentage}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0">
            <XCircle className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">無效填寫 (過快)</p>
            <p className="text-4xl font-black text-slate-800">{stats.invalid}</p>
          </div>
        </div>
      </div>

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">最近填寫紀錄</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">ID</th>
                <th className="px-6 py-4 font-bold">時間</th>
                <th className="px-6 py-4 font-bold">填寫耗時</th>
                <th className="px-6 py-4 font-bold">狀態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats.recent.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    尚無填寫紀錄
                  </td>
                </tr>
              ) : (
                stats.recent.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-slate-500">#{sub.id}</td>
                    <td className="px-6 py-4 text-slate-700">
                      {new Date(sub.created_at).toLocaleString('zh-TW')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span>{(sub.duration_ms / 1000).toFixed(1)} 秒</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {sub.is_valid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          有效
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
                          <XCircle className="w-3.5 h-3.5" />
                          無效 (過快)
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
