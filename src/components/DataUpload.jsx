
import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CloudArrowUpIcon,
    DocumentTextIcon,
    CheckCircleIcon,
    ArrowPathIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline'

const steps = [
    { id: 'upload', label: 'Uploading file...' },
    { id: 'parse', label: 'Parsing rows...' },
    { id: 'validate', label: 'Validating data...' },
    { id: 'build', label: 'Building 3D model...' }
]

const DataUpload = ({ onUploadSuccess }) => {
    const [currentStep, setCurrentStep] = useState(-1)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [rowCount, setRowCount] = useState(0)
    const [error, setError] = useState(null)
    const [showPreview, setShowPreview] = useState(false)
    const [previewData, setPreviewData] = useState(null)
    const [uploadedFile, setUploadedFile] = useState(null)
    const [summary, setSummary] = useState(null)

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0]
        if (file) {
            if (file.type !== 'text/csv' && !file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
                setError('Please upload a CSV or TXT file')
                return
            }
            setUploadedFile(file)
            handleUpload(file)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv', '.txt'],
            'text/plain': ['.txt', '.csv']
        },
        multiple: false
    })

    const simulateProgress = async (start, end, duration) => {
        const startTime = Date.now()
        return new Promise(resolve => {
            const interval = setInterval(() => {
                const elapsed = Date.now() - startTime
                const progress = Math.min(start + (end - start) * (elapsed / duration), end)
                setUploadProgress(progress)

                if (elapsed >= duration) {
                    clearInterval(interval)
                    resolve()
                }
            }, 50)
        })
    }

    const handleUpload = async (file) => {
        setError(null)
        setCurrentStep(0)
        setUploadProgress(0)

        try {
            // Step 1: Uploading
            await simulateProgress(0, 30, 800)

            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload/dataset', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Upload failed')
            }

            const result = await response.json()
            setSummary(result.summary)

            // Step 2: Parsing
            setCurrentStep(1)
            await simulateProgress(30, 60, 1000)
            setRowCount(result.summary.count)

            // Step 3: Validating
            setCurrentStep(2)
            await simulateProgress(60, 90, 800)

            // Show preview
            setPreviewData(result.summary.preview)
            setShowPreview(true)

        } catch (err) {
            setError(err.message)
            setCurrentStep(-1)
            setUploadProgress(0)
        }
    }

    const confirmUpload = async () => {
        setShowPreview(false)
        setCurrentStep(3) // Building 3D model

        // Simulate building phase
        await simulateProgress(90, 100, 1500)

        // Complete
        if (onUploadSuccess && summary) {
            onUploadSuccess(summary)
        }

        // Reset state after success (optional, or keep showing success state)
        // setCurrentStep(4) // specific complete state?
    }

    const downloadTemplate = (type) => {
        let content = ''
        let filename = ''

        if (type === 'hospital') {
            content = 'bed_id,patient_id,status,last_updated\n1,P-101,occupied,2023-10-27\n2,P-102,available,2023-10-27\n3,,critical,2023-10-27\n4,,cleaning,2023-10-27'
            filename = 'hospital_template.csv'
        } else {
            content = 'shelf_id,capacity,item_count,zone\nA-01,100,45,Zone-A\nA-02,100,0,Zone-A\nB-01,150,140,Zone-B\nB-02,50,10,Zone-B'
            filename = 'warehouse_template.csv'
        }

        const blob = new Blob([content], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
    }

    const resetUpload = () => {
        setUploadedFile(null)
        setCurrentStep(-1)
        setUploadProgress(0)
        setError(null)
        setShowPreview(false)
        setPreviewData(null)
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-6 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
            <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-white">Upload Dataset</h2>
                    <p className="text-gray-400 text-sm mt-1 mb-4">Upload CSV or TXT file for Hospital or Warehouse data</p>
                    <div className="flex justify-center gap-4 mb-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); downloadTemplate('hospital'); }}
                            className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Hospital CSV
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); downloadTemplate('warehouse'); }}
                            className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Warehouse CSV
                        </button>
                    </div>
                </div>

                {/* Dropzone */}
                {!uploadedFile && (
                    <div
                        {...getRootProps()}
                        className={`
              relative overflow-hidden cursor-pointer
              h-48 rounded-xl border-2 border-dashed transition-all duration-300
              flex flex-col items-center justify-center text-center p-6
              ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'}
              ${error ? 'border-red-500 bg-red-500/10' : ''}
            `}
                    >
                        <input {...getInputProps()} />
                        <CloudArrowUpIcon className={`w-12 h-12 mb-4 ${isDragActive ? 'text-blue-400' : 'text-gray-400'}`} />
                        <p className="text-lg font-medium text-white">
                            {isDragActive ? 'Drop file here' : 'Drag & drop file here'}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">or click to select</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200"
                    >
                        <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                        <button onClick={resetUpload} className="ml-auto text-xs hover:underline">Try Again</button>
                    </motion.div>
                )}

                {/* Selected File & Progress */}
                {uploadedFile && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                            <div className="flex items-center gap-3">
                                <DocumentTextIcon className="w-8 h-8 text-blue-400" />
                                <div>
                                    <p className="font-medium text-white">{uploadedFile.name}</p>
                                    <p className="text-xs text-gray-400">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                                </div>
                            </div>
                            {currentStep < 3 && !showPreview && (
                                <button onClick={resetUpload} className="p-2 hover:bg-gray-600/50 rounded-full transition-colors">
                                    <ArrowPathIcon className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                        </div>

                        {/* Steps Visualization */}
                        <div className="grid grid-cols-4 gap-2">
                            {steps.map((step, index) => {
                                const isActive = index === currentStep
                                const isCompleted = index < currentStep

                                return (
                                    <div key={step.id} className="text-center relative">
                                        <div
                                            className={`
                        w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 transition-all duration-300
                        ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-blue-500 text-white animate-pulse' : 'bg-gray-700 text-gray-400'}
                      `}
                                        >
                                            {isCompleted ? (
                                                <CheckCircleIcon className="w-5 h-5" />
                                            ) : isActive ? (
                                                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <span className="text-xs">{index + 1}</span>
                                            )}
                                        </div>
                                        <p className={`text-xs transition-colors duration-300 ${isActive || isCompleted ? 'text-white' : 'text-gray-500'}`}>
                                            {step.label}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Total Progress</span>
                                <span>{Math.round(uploadProgress)}%</span>
                            </div>
                            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress}%` }}
                                    transition={{ duration: 0.2 }}
                                />
                            </div>
                            {currentStep === 1 && (
                                <p className="text-center text-xs text-blue-400 animate-pulse">
                                    Processing row {Math.min(Math.floor((uploadProgress - 30) / 30 * rowCount * 2), rowCount)} of {rowCount}...
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Preview Modal Overlay */}
                <AnimatePresence>
                    {showPreview && previewData && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                className="bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full border border-gray-700 overflow-hidden"
                            >
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Validate Dataset</h3>
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-6">
                                        <p className="text-blue-200 text-sm">
                                            Found {rowCount} rows. Start validated successfully. Please review the first 5 records.
                                        </p>
                                    </div>

                                    <div className="overflow-x-auto mb-6 bg-gray-900/50 rounded-lg border border-gray-700">
                                        <table className="w-full text-sm text-left text-gray-300">
                                            <thead className="bg-gray-700/50 text-gray-100 uppercase text-xs">
                                                <tr>
                                                    {Object.keys(previewData[0]).map(header => (
                                                        <th key={header} className="px-4 py-3">{header}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {previewData.map((row, i) => (
                                                    <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                                                        {Object.values(row).map((val, j) => (
                                                            <td key={j} className="px-4 py-2">{val}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => { setShowPreview(false); resetUpload(); }}
                                            className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmUpload}
                                            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20"
                                        >
                                            Confirm Upload
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}


export default DataUpload
