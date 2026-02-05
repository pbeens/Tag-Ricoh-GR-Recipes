import React, { useState, useCallback } from 'react'
import { UploadCloud, CheckCircle, Loader2, Image as ImageIcon } from 'lucide-react'

function App() {
    const [isDragging, setIsDragging] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState(0)
    const [history, setHistory] = useState([])
    const [status, setStatus] = useState('Ready to tag')

    const onDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const onDragLeave = () => {
        setIsDragging(false)
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
                const metadata = await window.api.getImageTone(filePath)
                if (metadata && metadata[0] && metadata[0].ImageTone) {
                    const tone = metadata[0].ImageTone
                    const finalTag = `${tone} Film Recipe`

                    await window.api.tagImage(filePath, finalTag)

                    setHistory(prev => [{
                        id: Date.now() + i,
                        filename: file.name,
                        tone: tone,
                        timestamp: new Date().toLocaleTimeString()
                    }, ...prev].slice(0, 10))
                }
            } catch (err) {
                console.error(`Error processing ${file.name}:`, err)
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
                    <h1>RICOH GR IMAGE TAGGER</h1>
                </div>
                <div className="window-controls">
                    <button className="control-btn minimize" onClick={() => window.api.minimize()} />
                    <button className="control-btn close" onClick={() => window.api.close()} />
                </div>
            </div>

            <div className="app-layout">
                <main className="main-content">
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
                    <h2>Recently Tagged</h2>
                    <div className="history-list">
                        {history.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No images tagged yet.</p>
                        ) : (
                            history.map(item => (
                                <div key={item.id} className="history-item">
                                    <span className="filename">{item.filename}</span>
                                    <span className="tag">{item.tone}</span>
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
