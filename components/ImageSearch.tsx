'use client'

import { useState, useRef } from 'react'

interface ImageResult {
  thumbnail: string
  url: string
  site: string
}

interface Props {
  onSelect: (url: string) => void
}

export default function ImageSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ImageResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    const res = await fetch(`/api/search-image?q=${encodeURIComponent(query)}`)
    const data = await res.json()
    setResults(data.images ?? [])
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="예) 이니스프리 수분크림"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-rose-200 focus:border-rose-300"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-3 bg-rose-400 text-white text-sm font-medium rounded-xl disabled:opacity-60"
        >
          {loading ? '...' : '검색'}
        </button>
      </div>

      {searched && !loading && results.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">검색 결과가 없어요</p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {results.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(img.url)}
              className="aspect-square rounded-xl overflow-hidden bg-gray-100 active:opacity-70 transition-opacity"
            >
              <img
                src={img.thumbnail}
                alt={img.site}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
