import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface Props {
  onLogin: (token: string) => void;
}

export const AdminLogin: React.FC<Props> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        onLogin(data.token);
      } else {
        setError(data.error || '登入失敗，請檢查密碼');
      }
    } catch (err) {
      setError('網路錯誤，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
      <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
        <Lock className="w-8 h-8 text-brand-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">管理者登入</h2>
      <p className="text-center text-slate-500 mb-8 text-sm">請輸入管理者密碼以查看系統統計數據</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">密碼</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="請輸入密碼"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? '登入中...' : '登入'} <ArrowRight className="w-4 h-4" />
        </button>
      </form>
      <div className="mt-6 text-center text-xs text-slate-400">
        預設測試密碼: admin123
      </div>
    </div>
  );
};
