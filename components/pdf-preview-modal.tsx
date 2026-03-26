"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, X, ZoomIn, ZoomOut, Eye } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface PDFPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  pdfDataUrl: string | null
  fileName: string
  onDownload: () => void
}

export function PDFPreviewModal({ isOpen, onClose, pdfDataUrl, fileName, onDownload }: PDFPreviewModalProps) {
  const [zoom, setZoom] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [previewError, setPreviewError] = useState(false)

  useEffect(() => {
    if (isOpen && pdfDataUrl) {
      setIsLoading(true)
      setPreviewError(false)
      // Reset loading state after a short delay
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, pdfDataUrl])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
    setPreviewError(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setPreviewError(true)
  }

  const openInNewTab = () => {
    if (pdfDataUrl) {
      window.open(pdfDataUrl, "_blank")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[95vh] flex flex-col p-0">
        <DialogHeader className="p-4 border-b bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-600" />
              <DialogTitle className="text-lg">Preview: {fileName}</DialogTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={openInNewTab} disabled={!pdfDataUrl}>
                <Eye className="h-4 w-4 mr-1" />
                Open in New Tab
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomOut} disabled={zoom <= 0.5}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
              <Button variant="outline" size="icon" onClick={handleZoomIn} disabled={zoom >= 2}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <DialogDescription>
            Review the document before downloading. If preview doesn't work, try opening in a new tab.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-4">
          {isLoading && (
            <div className="w-full h-[600px] flex items-center justify-center">
              <div className="space-y-4 w-full max-w-lg">
                <div className="flex items-center justify-center mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="h-4" />
                <Skeleton className="h-40 w-full" />
                <div className="h-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          )}

          {previewError && !isLoading && (
            <div className="w-full h-[600px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-red-500 text-6xl">⚠️</div>
                <h3 className="text-lg font-semibold">Preview Not Available</h3>
                <p className="text-muted-foreground max-w-md">
                  The PDF preview couldn't be loaded. This might be due to browser security settings. You can still
                  download the PDF or open it in a new tab.
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={openInNewTab}>
                    <Eye className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                  <Button onClick={onDownload} className="bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !previewError && pdfDataUrl && (
            <div className="flex justify-center">
              <div
                className="bg-white shadow-lg transition-all duration-200 border"
                style={{
                  width: `${8.5 * 96 * zoom}px`, // 8.5 inches at 96 DPI
                  minHeight: `${11 * 96 * zoom}px`, // 11 inches at 96 DPI
                  transform: `scale(${zoom})`,
                  transformOrigin: "top center",
                }}
              >
                <iframe
                  src={`${pdfDataUrl}#toolbar=1&navpanes=0&scrollbar=1`}
                  className="w-full h-full border-0"
                  style={{
                    width: "100%",
                    height: `${11 * 96}px`, // Fixed height in pixels
                    minHeight: "800px",
                  }}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  title="PDF Preview"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 border-t bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {pdfDataUrl ? "PDF ready for download" : "Generating PDF..."}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={onDownload} className="gap-2 bg-green-600 hover:bg-green-700" disabled={!pdfDataUrl}>
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
