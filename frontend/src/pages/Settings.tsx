import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Key, Palette, CreditCard, Copy, CheckCheck, Plus, Trash2, Eye, EyeOff, Check } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { useAuthStore } from '@/store/authStore'
import { useAppStore } from '@/store/appStore'
import { mockApiKeys } from '@/utils/mockData'
import { formatRelativeTime, copyToClipboard } from '@/utils/helpers'

const TABS = [
  { label: 'Profile', icon: User },
  { label: 'Notifications', icon: Bell },
  { label: 'Security', icon: Shield },
  { label: 'API Keys', icon: Key },
  { label: 'Appearance', icon: Palette },
  { label: 'Billing', icon: CreditCard },
]

export function Settings() {
  const { user } = useAuthStore()
  const { theme, toggleTheme } = useAppStore()
  const [tab, setTab] = useState('Profile')
  const [saved, setSaved] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [profile, setProfile] = useState({ name: user?.name ?? '', email: user?.email ?? '' })
  const [notifSettings, setNotifSettings] = useState({
    deploySuccess: true,
    deployFail: true,
    highCpu: false,
    highMemory: false,
    weeklyReport: true,
  })

  const handleSave = async () => {
    await new Promise((r) => setTimeout(r, 600))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleCopyKey = async (key: string, id: string) => {
    await copyToClipboard(key)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <nav className="w-48 flex-shrink-0 hidden sm:block">
          <div className="space-y-0.5">
            {TABS.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setTab(label)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === label ? 'bg-primary text-white' : 'text-text-secondary hover:text-text hover:bg-slate-100'}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile tab select */}
        <div className="sm:hidden w-full mb-4">
          <select value={tab} onChange={(e) => setTab(e.target.value)} className="input">
            {TABS.map(({ label }) => <option key={label}>{label}</option>)}
          </select>
        </div>

        {/* Content */}
        <motion.div className="flex-1 max-w-lg" key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          {/* Profile */}
          {tab === 'Profile' && (
            <div className="card p-6 space-y-5">
              <h2 className="text-base font-semibold text-text">Profile Information</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                  {user?.name?.charAt(0) ?? 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-text">{user?.name}</p>
                  <p className="text-sm text-text-secondary">{user?.email}</p>
                  <p className="text-xs text-text-muted mt-0.5 capitalize">{user?.role}</p>
                </div>
              </div>
              <div>
                <label className="label">Full Name</label>
                <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input" />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="input" />
              </div>
              <div>
                <label className="label">Role</label>
                <input type="text" value={user?.role ?? ''} className="input bg-slate-50" disabled />
              </div>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                {saved ? <><Check className="w-4 h-4" />Saved!</> : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Notifications */}
          {tab === 'Notifications' && (
            <div className="card p-6 space-y-5">
              <h2 className="text-base font-semibold text-text">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: 'deploySuccess', label: 'Deployment successful', desc: 'When a build completes successfully' },
                  { key: 'deployFail', label: 'Deployment failed', desc: 'When a build or health check fails' },
                  { key: 'highCpu', label: 'High CPU alert', desc: 'When CPU exceeds 85% for 5+ minutes' },
                  { key: 'highMemory', label: 'High memory alert', desc: 'When memory exceeds 90% for 5+ minutes' },
                  { key: 'weeklyReport', label: 'Weekly digest', desc: 'Weekly summary of deployments and metrics' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-text">{label}</p>
                      <p className="text-xs text-text-secondary">{desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifSettings((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                      className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ${notifSettings[key as keyof typeof notifSettings] ? 'bg-primary' : 'bg-slate-200'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${notifSettings[key as keyof typeof notifSettings] ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                {saved ? <><Check className="w-4 h-4" />Saved!</> : 'Save Preferences'}
              </button>
            </div>
          )}

          {/* Security */}
          {tab === 'Security' && (
            <div className="space-y-4">
              <div className="card p-6 space-y-5">
                <h2 className="text-base font-semibold text-text">Change Password</h2>
                <div>
                  <label className="label">Current Password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input type="password" className="input" placeholder="••••••••" />
                </div>
                <button className="btn-primary">Update Password</button>
              </div>
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-text mb-3">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-text">2FA not enabled</p>
                    <p className="text-xs text-text-secondary">Secure your account with an authenticator app</p>
                  </div>
                  <button className="btn-secondary text-xs">Enable 2FA</button>
                </div>
              </div>
            </div>
          )}

          {/* API Keys */}
          {tab === 'API Keys' && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-text">API Keys</h2>
                <button className="btn-primary flex items-center gap-1.5 text-xs">
                  <Plus className="w-3.5 h-3.5" />New Key
                </button>
              </div>
              <div className="space-y-3">
                {mockApiKeys.map((key) => (
                  <div key={key.id} className="border border-border rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-text">{key.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">
                          Created {formatRelativeTime(key.createdAt)}
                          {key.lastUsed && ` · Last used ${formatRelativeTime(key.lastUsed)}`}
                        </p>
                      </div>
                      <button className="p-1.5 text-text-muted hover:text-error hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                      <code className="text-xs font-mono text-text-secondary flex-1">
                        {showKeys[key.id] ? key.key.replace('...', Math.random().toString(36).slice(2, 10)) : key.key}
                      </code>
                      <button onClick={() => setShowKeys((prev) => ({ ...prev, [key.id]: !prev[key.id] }))} className="text-text-muted hover:text-text transition-colors">
                        {showKeys[key.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => handleCopyKey(key.key, key.id)} className="text-text-muted hover:text-text transition-colors">
                        {copiedKey === key.id ? <CheckCheck className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      {key.permissions.map((p) => (
                        <span key={p} className="px-2 py-0.5 bg-slate-100 text-text-secondary text-xs rounded-full capitalize">{p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Appearance */}
          {tab === 'Appearance' && (
            <div className="card p-6 space-y-5">
              <h2 className="text-base font-semibold text-text">Appearance</h2>
              <div>
                <p className="text-sm font-medium text-text mb-3">Theme</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'light', label: 'Light', preview: 'bg-white border-border' },
                    { value: 'dark', label: 'Dark', preview: 'bg-slate-900 border-slate-700' },
                  ].map((t) => (
                    <button
                      key={t.value}
                      onClick={() => theme !== t.value && toggleTheme()}
                      className={`p-4 rounded-xl border-2 transition-all ${theme === t.value ? 'border-primary' : 'border-border hover:border-slate-300'}`}
                    >
                      <div className={`h-16 rounded-lg ${t.preview} border mb-2`} />
                      <p className={`text-sm font-medium ${theme === t.value ? 'text-primary' : 'text-text'}`}>{t.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Billing */}
          {tab === 'Billing' && (
            <div className="space-y-4">
              <div className="card p-6">
                <h2 className="text-base font-semibold text-text mb-4">Current Plan</h2>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-primary">Pro Plan</span>
                    <span className="text-lg font-bold text-text">$29<span className="text-sm text-text-secondary font-normal">/mo</span></span>
                  </div>
                  <p className="text-xs text-text-secondary">Next billing date: July 1, 2026</p>
                </div>
              </div>
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-text mb-4">Usage This Month</h3>
                {[
                  { label: 'Deployments', used: 47, limit: 100 },
                  { label: 'Build Minutes', used: 842, limit: 2000 },
                  { label: 'Bandwidth', used: 12.4, limit: 50, unit: 'GB' },
                ].map((item) => (
                  <div key={item.label} className="mb-4 last:mb-0">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-text-secondary">{item.label}</span>
                      <span className="text-text font-medium">{item.used}{item.unit ?? ''} / {item.limit}{item.unit ?? ''}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${Math.min(100, (item.used / item.limit) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="card p-6">
                <h3 className="text-sm font-semibold text-text mb-3">Payment Method</h3>
                <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                  <span className="text-sm text-text">•••• •••• •••• 4242</span>
                  <span className="text-xs text-text-muted ml-auto">Expires 04/27</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}