import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Upload, Plus, Minus, Loader2, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, Eye, EyeOff, Rocket } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { DeployStepper } from '@/components/DeployStepper'
import { useDeployments } from '@/hooks/useDeployments'
import { deploymentService } from '@/services/deploymentService'
import { DeploymentFormData, PipelineStage } from '@/types'
import { generateId } from '@/utils/helpers'

const STEPS = ['Source', 'Configure', 'Environment', 'Review & Deploy']

const REGIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'eu-west-1', label: 'EU (Ireland)' },
  { value: 'ap-southeast-1', label: 'AP (Singapore)' },
]

type EnvVar = { key: string; value: string; isSecret: boolean }

export function Deploy() {
  const navigate = useNavigate()
  const { deploy } = useDeployments()
  const [step, setStep] = useState(0)
  const [deploying, setDeploying] = useState(false)
  const [deployedId, setDeployedId] = useState<string | null>(null)
  const [repoValidating, setRepoValidating] = useState(false)
  const [repoValid, setRepoValid] = useState<boolean | null>(null)
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([])

  const [form, setForm] = useState<DeploymentFormData>({
    name: '',
    source: 'github',
    repoUrl: '',
    branch: 'main',
    region: 'us-east-1',
    tags: [],
    replicas: 1,
    buildSettings: {
      buildCommand: 'npm run build',
      startCommand: 'node dist/index.js',
      rootDirectory: '/',
      nodeVersion: '20.x',
      envVariables: [],
    },
  })
  const [envVars, setEnvVars] = useState<EnvVar[]>([{ key: '', value: '', isSecret: false }])
  const [showSecrets, setShowSecrets] = useState<Record<number, boolean>>({})

  const setField = (field: keyof DeploymentFormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const setBuildField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, buildSettings: { ...prev.buildSettings, [field]: value } }))
  }

  const validateRepo = async () => {
    if (!form.repoUrl) return
    setRepoValidating(true)
    setRepoValid(null)
    try {
      const result = await deploymentService.validateRepository(form.repoUrl)
      setRepoValid(true)
      if (!form.name) setField('name', result.name)
      setField('branch', result.branch)
    } catch {
      setRepoValid(false)
    } finally {
      setRepoValidating(false)
    }
  }

  const addEnvVar = () => setEnvVars((prev) => [...prev, { key: '', value: '', isSecret: false }])

  const updateEnvVar = (idx: number, field: keyof EnvVar, val: string | boolean) => {
    setEnvVars((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: val } : e)))
  }

  const removeEnvVar = (idx: number) => setEnvVars((prev) => prev.filter((_, i) => i !== idx))

  const simulatePipeline = async (stages: PipelineStage[]) => {
    for (let i = 0; i < stages.length; i++) {
      setPipelineStages((prev) => prev.map((s, idx) => (idx === i ? { ...s, status: 'running' } : s)))
      await new Promise((r) => setTimeout(r, 1200 + Math.random() * 1000))
      setPipelineStages((prev) => prev.map((s, idx) => (idx === i ? { ...s, status: 'success', duration: Math.floor(1200 + Math.random() * 30000) } : s)))
    }
  }

  const handleDeploy = async () => {
    setDeploying(true)
    const finalForm = {
      ...form,
      buildSettings: {
        ...form.buildSettings,
        envVariables: envVars.filter((e) => e.key),
      },
    }

    const initialStages: PipelineStage[] = [
      { id: generateId(), name: form.source === 'zip' ? 'Extract Archive' : 'Clone Repository', status: 'pending' },
      { id: generateId(), name: 'Install Dependencies', status: 'pending' },
      { id: generateId(), name: 'Run Tests', status: 'pending' },
      { id: generateId(), name: 'Build', status: 'pending' },
      { id: generateId(), name: 'Deploy', status: 'pending' },
    ]
    setPipelineStages(initialStages)

    const result = await deploy(finalForm)
    if (result.success && result.deployment) {
      setDeployedId(result.deployment.id)
      await simulatePipeline(initialStages)
    }
    setDeploying(false)
  }

  if (deployedId && pipelineStages.length > 0 && pipelineStages.every((s) => s.status === 'success')) {
    return (
      <div>
        <PageHeader title="Deploy" />
        <motion.div className="max-w-lg mx-auto card p-8 text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-7 h-7 text-success" />
          </div>
          <h2 className="text-xl font-bold text-text mb-2">Deployment Successful!</h2>
          <p className="text-text-secondary text-sm mb-6">{form.name} has been deployed successfully.</p>
          <div className="mb-6"><DeployStepper stages={pipelineStages} /></div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate(`/deployments/${deployedId}`)} className="btn-primary flex items-center gap-2">
              View Deployment <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigate('/deployments')} className="btn-secondary">All Deployments</button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (deploying) {
    return (
      <div>
        <PageHeader title="Deploy" />
        <motion.div className="max-w-lg mx-auto card p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text">Deploying {form.name}...</h2>
              <p className="text-sm text-text-secondary">This usually takes 1-3 minutes</p>
            </div>
          </div>
          <DeployStepper stages={pipelineStages} />
        </motion.div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="New Deployment"
        subtitle="Deploy your application to the cloud"
        breadcrumbs={[{ label: 'Deployments', href: '/deployments' }, { label: 'New Deploy' }]}
      />

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-shrink-0">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              i === step ? 'bg-primary text-white' : i < step ? 'bg-green-100 text-success' : 'bg-slate-100 text-text-secondary'
            }`}>
              {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs">{i + 1}</span>}
              {s}
            </div>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="max-w-2xl">
        <AnimatePresence mode="wait">
          {/* Step 0: Source */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-6">
              <h2 className="text-base font-semibold text-text mb-4">Select Source</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { val: 'github', label: 'GitHub Repository', icon: <Github className="w-5 h-5" /> },
                  { val: 'zip', label: 'ZIP Archive', icon: <Upload className="w-5 h-5" /> },
                ].map((src) => (
                  <button
                    key={src.val}
                    onClick={() => setField('source', src.val)}
                    className={`flex flex-col items-center gap-2.5 p-5 rounded-xl border-2 transition-all ${form.source === src.val ? 'border-primary bg-blue-50' : 'border-border hover:border-slate-300'}`}
                  >
                    <span className={form.source === src.val ? 'text-primary' : 'text-text-secondary'}>{src.icon}</span>
                    <span className={`text-sm font-medium ${form.source === src.val ? 'text-primary' : 'text-text'}`}>{src.label}</span>
                  </button>
                ))}
              </div>

              {form.source === 'github' && (
                <div className="space-y-4">
                  <div>
                    <label className="label">Repository URL</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={form.repoUrl ?? ''}
                        onChange={(e) => { setField('repoUrl', e.target.value); setRepoValid(null) }}
                        className="input flex-1"
                        placeholder="https://github.com/org/repo"
                      />
                      <button onClick={validateRepo} disabled={!form.repoUrl || repoValidating} className="btn-secondary flex items-center gap-1.5 flex-shrink-0">
                        {repoValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Validate'}
                      </button>
                    </div>
                    {repoValid === true && <p className="text-xs text-success mt-1.5 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />Repository found</p>}
                    {repoValid === false && <p className="text-xs text-error mt-1.5 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />Invalid repository URL</p>}
                  </div>
                  <div>
                    <label className="label">Branch</label>
                    <input type="text" value={form.branch} onChange={(e) => setField('branch', e.target.value)} className="input" placeholder="main" />
                  </div>
                </div>
              )}

              {form.source === 'zip' && (
                <div>
                  <label className="label">Upload ZIP file</label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
                    <p className="text-sm text-text-secondary">Drop your ZIP file here or click to browse</p>
                    <p className="text-xs text-text-muted mt-1">Max 100MB</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6">
                <button onClick={() => setStep(1)} disabled={!form.source} className="btn-primary flex items-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 1: Configure */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-6 space-y-4">
              <h2 className="text-base font-semibold text-text mb-4">Configure Deployment</h2>
              <div>
                <label className="label">Service Name</label>
                <input type="text" value={form.name} onChange={(e) => setField('name', e.target.value)} className="input" placeholder="my-api-service" required />
              </div>
              <div>
                <label className="label">Region</label>
                <select value={form.region} onChange={(e) => setField('region', e.target.value)} className="input">
                  {REGIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Build Command</label>
                  <input type="text" value={form.buildSettings.buildCommand} onChange={(e) => setBuildField('buildCommand', e.target.value)} className="input font-mono text-xs" />
                </div>
                <div>
                  <label className="label">Start Command</label>
                  <input type="text" value={form.buildSettings.startCommand} onChange={(e) => setBuildField('startCommand', e.target.value)} className="input font-mono text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Root Directory</label>
                  <input type="text" value={form.buildSettings.rootDirectory} onChange={(e) => setBuildField('rootDirectory', e.target.value)} className="input font-mono text-xs" />
                </div>
                <div>
                  <label className="label">Node Version</label>
                  <select value={form.buildSettings.nodeVersion} onChange={(e) => setBuildField('nodeVersion', e.target.value)} className="input text-xs">
                    {['20.x', '18.x', '16.x'].map((v) => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Replicas</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setField('replicas', Math.max(1, form.replicas - 1))} className="btn-secondary p-2"><Minus className="w-4 h-4" /></button>
                  <span className="text-sm font-medium w-8 text-center">{form.replicas}</span>
                  <button onClick={() => setField('replicas', Math.min(10, form.replicas + 1))} className="btn-secondary p-2"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(0)} className="btn-secondary flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</button>
                <button onClick={() => setStep(2)} disabled={!form.name} className="btn-primary flex items-center gap-2">Continue <ArrowRight className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Environment Variables */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-6">
              <h2 className="text-base font-semibold text-text mb-4">Environment Variables</h2>
              <div className="space-y-2 mb-4">
                {envVars.map((ev, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input type="text" value={ev.key} onChange={(e) => updateEnvVar(idx, 'key', e.target.value)} className="input font-mono text-xs flex-1" placeholder="KEY" />
                    <div className="relative flex-1">
                      <input
                        type={ev.isSecret && !showSecrets[idx] ? 'password' : 'text'}
                        value={ev.value}
                        onChange={(e) => updateEnvVar(idx, 'value', e.target.value)}
                        className="input font-mono text-xs pr-8"
                        placeholder="VALUE"
                      />
                      {ev.isSecret && (
                        <button onClick={() => setShowSecrets((prev) => ({ ...prev, [idx]: !prev[idx] }))} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text">
                          {showSecrets[idx] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                    <button onClick={() => updateEnvVar(idx, 'isSecret', !ev.isSecret)} className={`p-2 rounded-lg border text-xs font-medium transition-colors flex-shrink-0 ${ev.isSecret ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-border text-text-secondary hover:bg-slate-50'}`} title={ev.isSecret ? 'Secret' : 'Plaintext'}>
                      {ev.isSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => removeEnvVar(idx)} className="p-2 text-text-muted hover:text-error transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addEnvVar} className="btn-secondary flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />Add variable
              </button>
              <div className="flex justify-between mt-6">
                <button onClick={() => setStep(1)} className="btn-secondary flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex items-center gap-2">Continue <ArrowRight className="w-4 h-4" /></button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card p-6">
              <h2 className="text-base font-semibold text-text mb-4">Review & Deploy</h2>
              <div className="space-y-3 bg-slate-50 rounded-xl p-4 mb-6">
                {[
                  ['Service Name', form.name],
                  ['Source', form.source === 'github' ? `GitHub: ${form.repoUrl}` : 'ZIP Upload'],
                  ['Branch', form.branch],
                  ['Region', REGIONS.find((r) => r.value === form.region)?.label ?? form.region],
                  ['Replicas', String(form.replicas)],
                  ['Build Command', form.buildSettings.buildCommand],
                  ['Start Command', form.buildSettings.startCommand],
                  ['Env Variables', String(envVars.filter((e) => e.key).length) + ' defined'],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-4">
                    <span className="text-xs text-text-secondary flex-shrink-0">{k}</span>
                    <span className="text-xs font-medium text-text text-right truncate max-w-xs font-mono">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="btn-secondary flex items-center gap-2"><ArrowLeft className="w-4 h-4" />Back</button>
                <button onClick={handleDeploy} className="btn-primary flex items-center gap-2 bg-green-600 hover:bg-green-700">
                  <Rocket className="w-4 h-4" />Deploy Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}