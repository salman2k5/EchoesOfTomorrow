import { Component, ErrorInfo, ReactNode } from 'react'

interface WebGLBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface WebGLBoundaryState {
  hasError: boolean
}

export class WebGLBoundary extends Component<WebGLBoundaryProps, WebGLBoundaryState> {
  constructor(props: WebGLBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): WebGLBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('[EchoesOfTomorrow] WebGL render error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }

    return this.props.children
  }
}

let webglSupport: boolean | null = null

/**
 * Probes WebGL support exactly once. The previous implementation created a new
 * WebGL context on every call (i.e. on every render), which can exhaust the
 * browser's context limit and make the live canvas lose its context.
 */
export function isWebGLAvailable(): boolean {
  if (webglSupport !== null) return webglSupport

  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    webglSupport = Boolean(window.WebGLRenderingContext && gl)
    // Release the probe context immediately
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    webglSupport = false
  }

  return webglSupport
}
