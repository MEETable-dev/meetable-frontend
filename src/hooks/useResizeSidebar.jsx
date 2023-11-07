import { useState } from 'react'

export function useResizeSidebar(
  initialSize,
  min,
  max
) {
  const [resizing, setResizing] = useState(false)
  const [size, setSize] = useState(loadStoredSize() ?? initialSize)

  const startResizing = (e) => {
    !resizing && setResizing(true)
  }

  const stopResizing = () => {
    if (resizing) {
      setResizing(false)
      saveStoredSize(size)
    }
  }

  const updateSize = (e) => {
    const currentMouseX = e.clientX;
    if (resizing && currentMouseX >= min && currentMouseX <= max) {
      setSize(currentMouseX)
    }
  }

  const reset = () => {
    console.log('reset')
    setSize(initialSize)
    saveStoredSize(initialSize)
  }

  return {
    size,
    resizing,
    startResizing,
    stopResizing,
    updateSize,
    reset,
  }
}

// LocalStorage Helpers

function saveStoredSize(size) {
  localStorage.setItem('sidebar-width', size.toString())
  return null;
}

function loadStoredSize() {
  const storedSize = localStorage.getItem('sidebar-width')
  if (storedSize) {
    return Number.parseInt(storedSize)
  }
  return null
}