import { useState, useCallback } from 'react'
import { Layer, createNewLayer, sortLayersByZIndex } from '@/types/layer'

export function useLayers() {
  const [layers, setLayers] = useState<Layer[]>([])
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null)

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null

  const addLayerFromFile = useCallback(
    async (file: File, canvasWidth: number, canvasHeight: number) => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          const img = new Image()
          img.onload = () => {
            setLayers((prev) => {
              const maxZ = prev.length > 0 ? Math.max(...prev.map((l) => l.zIndex)) : 0
              const newLayer = createNewLayer(
                file.name.replace(/\.[^/.]+$/, ''),
                imageUrl,
                img.naturalWidth,
                img.naturalHeight,
                canvasWidth,
                canvasHeight,
                maxZ + 1
              )
              newLayer.imageElement = img
              setSelectedLayerId(newLayer.id)
              return [...prev, newLayer]
            })
            resolve()
          }
          img.src = imageUrl
        }
        reader.readAsDataURL(file)
      })
    },
    []
  )

  const addMultipleFiles = useCallback(
    async (files: FileList | File[], canvasWidth: number, canvasHeight: number) => {
      const fileArray = Array.from(files).filter((file) =>
        file.type.startsWith('image/')
      )
      for (const file of fileArray) {
        await addLayerFromFile(file, canvasWidth, canvasHeight)
      }
    },
    [addLayerFromFile]
  )

  const updateLayer = useCallback((id: string, patch: Partial<Layer>) => {
    setLayers((prev) =>
      prev.map((layer) => (layer.id === id ? { ...layer, ...patch } : layer))
    )
  }, [])

  const deleteLayer = useCallback((id: string) => {
    setLayers((prev) => {
      const filtered = prev.filter((l) => l.id !== id)
      if (selectedLayerId === id) {
        setSelectedLayerId(filtered.length > 0 ? filtered[filtered.length - 1].id : null)
      }
      return filtered
    })
  }, [selectedLayerId])

  const duplicateLayer = useCallback((id: string) => {
    setLayers((prev) => {
      const target = prev.find((l) => l.id === id)
      if (!target) return prev
      const maxZ = Math.max(...prev.map((l) => l.zIndex))
      const duplicated: Layer = {
        ...target,
        id: `layer_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: `${target.name} (Copy)`,
        x: target.x + 10,
        y: target.y + 10,
        zIndex: maxZ + 1,
      }
      setSelectedLayerId(duplicated.id)
      return [...prev, duplicated]
    })
  }, [])

  const moveLayerUp = useCallback((id: string) => {
    setLayers((prev) => {
      const sorted = sortLayersByZIndex(prev)
      const index = sorted.findIndex((l) => l.id === id)
      if (index === -1 || index === sorted.length - 1) return prev

      const current = sorted[index]
      const next = sorted[index + 1]

      const currentZ = current.zIndex
      current.zIndex = next.zIndex
      next.zIndex = currentZ

      return [...prev]
    })
  }, [])

  const moveLayerDown = useCallback((id: string) => {
    setLayers((prev) => {
      const sorted = sortLayersByZIndex(prev)
      const index = sorted.findIndex((l) => l.id === id)
      if (index <= 0) return prev

      const current = sorted[index]
      const prevLayer = sorted[index - 1]

      const currentZ = current.zIndex
      current.zIndex = prevLayer.zIndex
      prevLayer.zIndex = currentZ

      return [...prev]
    })
  }, [])

  const toggleLayerVisibility = useCallback((id: string) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l))
    )
  }, [])

  const clearLayers = useCallback(() => {
    setLayers([])
    setSelectedLayerId(null)
  }, [])

  return {
    layers,
    setLayers,
    selectedLayerId,
    setSelectedLayerId,
    selectedLayer,
    addLayerFromFile,
    addMultipleFiles,
    updateLayer,
    deleteLayer,
    duplicateLayer,
    moveLayerUp,
    moveLayerDown,
    toggleLayerVisibility,
    clearLayers,
  }
}
