import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ImagePlus } from "lucide-react"

interface FileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value'> {
  label?: string
  previews?: string[]
  value?: File[]
  onFileSelect?: (files: File[]) => void
  className?: string
  previewClassName?: string
  multiple?: boolean
}

export function FileInput({
  label,
  previews = [],
  onFileSelect,
  className,
  previewClassName,
  multiple = true,
  ...props
}: FileInputProps) {
  const [previewUrls, setPreviewUrls] = React.useState<string[]>(previews || [])
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      const urls = files.map(file => URL.createObjectURL(file))
      setPreviewUrls(prev => [...prev, ...urls])
      onFileSelect?.(files)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const removePreview = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  React.useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [previewUrls])

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {previewUrls.map((url, index) => (
          <div
            key={url}
            className="relative aspect-video rounded-lg overflow-hidden group border border-gray-200 dark:border-gray-800"
          >
            <Image
              src={url}
              alt={`Preview ${index + 1}`}
              fill
              className="object-cover rounded-lg"
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                removePreview(index)
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        ))}
        <div
          onClick={handleClick}
          className={cn(
            "relative flex items-center justify-center aspect-video rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900",
            previewClassName
          )}
        >
          {previewUrls.length === 0 ? (
          <div className="text-center">
            <ImagePlus className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Klik untuk memilih gambar
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF sehingga 10MB
            </p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
        {...props}
      />
    </div>
  )
}
