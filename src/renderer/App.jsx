import React, { useState, useCallback, useEffect } from 'react'
import { UploadCloud, CheckCircle, Loader2, Image as ImageIcon } from 'lucide-react'

function App() {
    const [isDragging, setIsDragging] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [history, setHistory] = useState([])
    const [status, setStatus] = useState('Ready to tag')

    const [options, setOptions] = useState({
        ev: true,
        iso: true,
        wb: true
    })

    const [version, setVersion] = useState('')

    const HISTORY_KEY = 'tagger.history.v1'
    const OPTIONS_KEY = 'tagger.options.v1'
    const MAX_HISTORY = 50

    const saveHistory = useCallback((items) => {
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(items))
        } catch (err) {
            console.warn('Unable to save history', err)
        }
    }, [])

    const saveOptions = useCallback((opts) => {
        try {
            localStorage.setItem(OPTIONS_KEY, JSON.stringify(opts))
        } catch (err) {
            console.warn('Unable to save options', err)
        }
    }, [])

    useEffect(() => {
        const init = async () => {
            const v = await window.api.getAppVersion()
            setVersion(v)

            const stored = localStorage.getItem(OPTIONS_KEY)
            if (stored) {
                try {
                    setOptions(JSON.parse(stored))
                } catch (err) {
                    console.warn('Unable to parse stored options', err)
                }
            }
        }
        init()
    }, [])

    useEffect(() => {
        const loadHistory = async () => {
            let stored = []
            try {
                const raw = localStorage.getItem(HISTORY_KEY)
                stored = raw ? JSON.parse(raw) : []
            } catch (err) {
                stored = []
            }

            if (!stored.length) {
                setHistory([])
                return
            }

            const checks = await Promise.all(
                stored.map(async (item) => {
                    const ok = await window.api.fileExists(item.filePath)
                    if (!ok) return null
                    let previewUrl = item.previewUrl || null
                    if (!previewUrl || previewUrl.startsWith('file:')) {
                        previewUrl = await window.api.getThumbnail(item.filePath, 96)
                    }
                    return {
                        ...item,
                        previewUrl: previewUrl || null
                    }
                })
            )

            const filtered = checks.filter(Boolean)
            setHistory(filtered)
            saveHistory(filtered)
        }

        loadHistory()
    }, [saveHistory])

    const onDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const onDragLeave = () => {
        setIsDragging(false)
    }

    const toggleOption = (key) => {
        setOptions(prev => {
            const updated = { ...prev, [key]: !prev[key] }
            saveOptions(updated)
            return updated
        })
    }

    const setAllOptions = (value) => {
        const updated = Object.keys(options).reduce((acc, key) => {
            acc[key] = value
            return acc
        }, {})
        setOptions(updated)
        saveOptions(updated)
    }

    const onDrop = async (e) => {
        e.preventDefault()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files)
        const imageFiles = files.filter(f => f.type === 'image/jpeg' || f.name.toLowerCase().endsWith('.jpg') || f.name.toLowerCase().endsWith('.jpeg'))

        if (imageFiles.length === 0) {
            setStatus('No JPEG images found')
            return
        }

        setIsProcessing(true)
        setProgress(0)
        setStatus(`Processing ${imageFiles.length} images...`)

        for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i]
            const filePath = window.api.getPathForFile(file) || file.path

            try {
                const metadataList = await window.api.getImageMetadata(filePath)
                if (!metadataList || !metadataList[0]) {
                    setStatus(`Metadata error for ${file.name}`)
                    continue
                }

                const metadata = metadataList[0]
                const tone = metadata.ImageTone
                if (!tone) {
                    setStatus(`No ImageTone found for ${file.name}`)
                    continue
                }

                const tags = [`${tone} Film Recipe`]

                if (options.ev && metadata.ExposureCompensation !== undefined) {
                    const evVal = parseFloat(metadata.ExposureCompensation)
                    const evStr = evVal >= 0 ? `+${evVal}` : `${evVal}`
                    tags.push(`EV: ${evStr}`)
                }
                if (options.iso && metadata.ISO) {
                    tags.push(`ISO: ${metadata.ISO}`)
                }
                if (options.wb && metadata.WhiteBalance) {
                    tags.push(`WB: ${metadata.WhiteBalance}`)
                }

                const tagResult = await window.api.tagImage(filePath, tags)
                if (tagResult && tagResult.skipped) {
                    setStatus(`Already tagged: ${file.name}`)
                    continue
                }
                const previewUrl = await window.api.getThumbnail(filePath, 96)

                setHistory(prev => {
                    const updated = [{
                        id: Date.now() + i,
                        filename: file.name,
                        filePath,
                        tone: tone,
                        tags: tags, // Store all tags for display
                        timestamp: new Date().toLocaleTimeString(),
                        previewUrl
                    }, ...prev].slice(0, MAX_HISTORY)
                    saveHistory(updated)
                    return updated
                })
            } catch (err) {
                console.error(`Error processing ${file.name}:`, err)
                setStatus(`Error tagging ${file.name}`)
            }

            setProgress(((i + 1) / imageFiles.length) * 100)
        }

        setIsProcessing(false)
        setStatus('Processing complete!')
        setTimeout(() => setStatus('Ready to tag'), 3000)
    }

    return (
        <div className="app-container">
            <div className="app-header">
                <div className="logo-section">
                    <div className="logo">
                        <ImageIcon size={20} color="white" />
                    </div>
                    <h1>RICOH GR IMAGE TAGGER {version && `v${version}`}</h1>
                </div>
                <div className="window-controls">
                    <button className="control-btn minimize" onClick={() => window.api.minimize()} />
                    <button className="control-btn close" onClick={() => window.api.quit()} />
                </div>
            </div>

            <div className="app-layout">
                <main className="main-content">
                    <section className="options-panel">
                        <div className="options-header">
                            <h3>Metadata Options</h3>
                            <div className="bulk-actions">
                                <button onClick={() => setAllOptions(true)}>All</button>
                                <button onClick={() => setAllOptions(false)}>None</button>
                            </div>
                        </div>
                        <div className="options-grid">
                            <label className={`option-chip ${options.ev ? 'active' : ''}`}>
                                <input type="checkbox" checked={options.ev} onChange={() => toggleOption('ev')} />
                                <span>Exposure (EV)</span>
                            </label>
                            <label className={`option-chip ${options.iso ? 'active' : ''}`}>
                                <input type="checkbox" checked={options.iso} onChange={() => toggleOption('iso')} />
                                <span>ISO</span>
                            </label>
                            <label className={`option-chip ${options.wb ? 'active' : ''}`}>
                                <input type="checkbox" checked={options.wb} onChange={() => toggleOption('wb')} />
                                <span>White Balance</span>
                            </label>
                        </div>
                    </section>
                    <div
                        className={`drop-zone ${isDragging ? 'active' : ''}`}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="drop-icon animate-spin" strokeWidth={1.5} />
                                <h2>Processing Images...</h2>
                                <div className="progress-container">
                                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                                </div>
                            </>
                        ) : (
                            <>
                                <UploadCloud className="drop-icon" strokeWidth={1.5} />
                                <h2>Drag & Drop Ricoh GR JPEGs</h2>
                                <p style={{ color: 'var(--text-muted)' }}>Here to Import</p>
                            </>
                        )}
                        <div className="status-badge">{status}</div>
                    </div>
                </main>

                <aside className="sidebar">
                    <div className="sidebar-header">
                        <h2>Recently Tagged</h2>
                        <button
                            className="history-clear"
                            title="Clear history"
                            onClick={() => {
                                setHistory([])
                                saveHistory([])
                            }}
                        >
                            <span aria-hidden="true">Clear</span>
                        </button>
                    </div>
                    <div className="history-list">
                        {history.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No images tagged yet.</p>
                        ) : (
                            history.map(item => (
                                <div key={item.id} className="history-item">
                                    {item.previewUrl ? (
                                        <img src={item.previewUrl} alt={item.filename} className="history-thumb" />
                                    ) : null}
                                    <div className="history-meta">
                                        <span className="filename">{item.filename}</span>
                                        <div className="tag-cloud">
                                            <span className="tag tone">{item.tone}</span>
                                            {item.tags && item.tags.slice(1).map((t, idx) => (
                                                <span key={idx} className="tag extra">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default App
