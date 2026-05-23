'use client'

import { useRef } from 'react'

interface Props {
  file: File | null
  existingUrl?: string
  onChange: (file: File | null) => void
}

export default function ImagePicker({ file, existingUrl, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const preview = file ? URL.createObjectURL(file) : existingUrl ?? null

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="w-full h-40 rounded-2xl border-2 border-dashed border-gray-200 bg-white flex items-center justify-center cursor-pointer overflow-hidden active:opacity-70 transition-opacity"
    >
      {preview ? (
        <img src={preview} alt="미리보기" className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-300">
          <span className="text-4xl">📷</span>
          <span className="text-sm">사진 추가</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  )
}
