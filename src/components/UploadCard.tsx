import { useState, useCallback } from 'react'
import { useI18n } from '../utils/i18n'

interface UploadCardProps {
  onImageUpload: (image: string) => void
}

export function UploadCard({ onImageUpload }: UploadCardProps) {
  const { t } = useI18n()
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      onImageUpload(result)
    }
    reader.readAsDataURL(file)
  }, [onImageUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  // 支持复制粘贴
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile()
        if (file) {
          handleFile(file)
          e.preventDefault()
          break
        }
      }
    }
  }, [handleFile])

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {t('uploadTitle')}
      </h2>

      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onPaste={handlePaste}
        tabIndex={0}
      >
        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg shadow-md"
            />
            <button
              onClick={() => {
                setPreview(null)
                onImageUpload('')
              }}
              className="w-full btn-primary bg-gray-500 hover:bg-gray-600"
            >
              {t('uploadReplace')}
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="space-y-2">
              <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                {t('uploadDrop')}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('uploadBrowse')}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {t('uploadFormat')}
              </p>
            </div>

            <label className="inline-block">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <span className="btn-primary cursor-pointer inline-block">
                {t('uploadDrop').split(' ')[0]}
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          {t('uploadTips')}
        </p>
      </div>
    </div>
  )
}
