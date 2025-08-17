// components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { ThemedText } from './atoms/ThemedText'
import { ThemedView } from './atoms/ThemedView'

interface ErrorBoundaryState {
  readonly hasError: boolean
  readonly error: Error | null
  readonly errorInfo: string | null
  readonly errorId: string | null
}

interface ErrorBoundaryProps {
  readonly children: ReactNode
  readonly fallback?: (
    error: Error,
    errorInfo: string,
    retry: () => void,
  ) => ReactNode
  readonly onError?: (error: Error, errorInfo: string, errorId: string) => void
  readonly enableDevelopmentMode?: boolean
}

// Tipo para errorInfo con tipado estricto
interface SafeErrorInfo {
  readonly componentStack: string
  readonly errorBoundary?: string
  readonly errorBoundaryStack?: string
}

// Función pura para extraer stack de forma segura
const extractComponentStack = (errorInfo: ErrorInfo): string => {
  // Verificación estricta del tipo
  const stack = errorInfo?.componentStack

  if (typeof stack === 'string') {
    return stack.trim()
  }

  // Fallback robusto
  return 'Component stack not available'
}

// Función pura para generar ID único de error
const generateErrorId = (): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `error_${timestamp}_${random}`
}

// Función pura para formatear error info
const formatErrorInfo = (error: Error, componentStack: string): string => {
  const errorName = error.name || 'UnknownError'
  const errorMessage = error.message || 'No error message available'
  const errorStack = error.stack || 'No stack trace available'

  return [
    `Error: ${errorName}`,
    `Message: ${errorMessage}`,
    `Stack: ${errorStack}`,
    `Component Stack: ${componentStack}`,
    `Timestamp: ${new Date().toISOString()}`,
  ].join('\n\n')
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  private retryTimeoutId: ReturnType<typeof setTimeout> | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Solo actualiza estado, no efectos secundarios aquí
    return {
      hasError: true,
      error,
      errorId: generateErrorId(),
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Extraer component stack de forma segura
    const componentStack = extractComponentStack(errorInfo)
    const formattedErrorInfo = formatErrorInfo(error, componentStack)

    // Actualizar estado con información completa
    this.setState({
      errorInfo: formattedErrorInfo,
    })

    // Callback opcional para logging externo
    if (this.props.onError && this.state.errorId) {
      try {
        this.props.onError(error, formattedErrorInfo, this.state.errorId)
      } catch (callbackError) {
        // Prevenir loops de error en callback
        console.error('Error in ErrorBoundary onError callback:', callbackError)
      }
    }

    // Log en development
    if (this.props.enableDevelopmentMode || __DEV__) {
      console.group(`🚨 ErrorBoundary caught error [${this.state.errorId}]`)
      console.error('Error:', error)
      console.error('Component Stack:', componentStack)
      console.error('Full Error Info:', formattedErrorInfo)
      console.groupEnd()
    }
  }

  componentWillUnmount(): void {
    // Cleanup timeout si existe
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
      this.retryTimeoutId = null
    }
  }

  private readonly handleRetry = (): void => {
    // Prevenir clicks múltiples
    if (this.retryTimeoutId) {
      return
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    })

    // Pequeño delay para evitar loops inmediatos
    this.retryTimeoutId = setTimeout(() => {
      this.retryTimeoutId = null
    }, 100)
  }

  private readonly renderFallbackUI = (): ReactNode => {
    const { error, errorInfo } = this.state
    const { fallback } = this.props

    // Si hay fallback personalizado, usarlo
    if (fallback && error && errorInfo) {
      try {
        return fallback(error, errorInfo, this.handleRetry)
      } catch (fallbackError) {
        console.error('Error in custom fallback:', fallbackError)
        // Continúa con fallback por defecto
      }
    }

    // Fallback por defecto
    return this.renderDefaultFallback()
  }

  private readonly renderDefaultFallback = (): ReactNode => {
    const { error, errorId, errorInfo } = this.state
    const { enableDevelopmentMode } = this.props

    const errorMessage = error?.message || 'Something went wrong'
    const isDevelopment = enableDevelopmentMode || __DEV__

    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.errorContainer}>
          {/* Icono de error */}
          <ThemedText style={styles.errorIcon}>⚠️</ThemedText>

          {/* Título */}
          <ThemedText type='title' style={styles.errorTitle}>
            Oops! Something went wrong
          </ThemedText>

          {/* Mensaje principal */}
          <ThemedText style={styles.errorMessage}>{errorMessage}</ThemedText>

          {/* ID de error para soporte */}
          {errorId && (
            <ThemedText style={styles.errorId}>Error ID: {errorId}</ThemedText>
          )}

          {/* Información detallada en development */}
          {isDevelopment && errorInfo && (
            <ThemedView style={styles.debugContainer}>
              <ThemedText type='defaultSemiBold' style={styles.debugTitle}>
                Debug Information:
              </ThemedText>
              <Text style={styles.debugText} selectable>
                {errorInfo}
              </Text>
            </ThemedView>
          )}

          {/* Botón de retry */}
          <TouchableOpacity
            style={styles.retryButton}
            onPress={this.handleRetry}
            activeOpacity={0.8}>
            <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
          </TouchableOpacity>

          {/* Sugerencias de solución */}
          <ThemedView style={styles.suggestionsContainer}>
            <ThemedText type='defaultSemiBold' style={styles.suggestionsTitle}>
              What you can try:
            </ThemedText>
            <ThemedText style={styles.suggestion}>
              • Check your internet connection
            </ThemedText>
            <ThemedText style={styles.suggestion}>
              • Close and reopen the app
            </ThemedText>
            <ThemedText style={styles.suggestion}>
              • Update the app if available
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    )
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.renderFallbackUI()
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    maxWidth: '100%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorIcon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#d32f2f',
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  errorId: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
    marginBottom: 24,
  },
  debugContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    maxHeight: 200,
  },
  debugTitle: {
    marginBottom: 8,
    color: '#d32f2f',
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
    lineHeight: 16,
  },
  retryButton: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  suggestionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  suggestionsTitle: {
    marginBottom: 8,
    color: '#333',
  },
  suggestion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
})

// HOC para wrappear componentes fácilmente
/*
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} ref={ref} />
    </ErrorBoundary>
  ));

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
*/

// Hook para reportar errores manualmente
export function useErrorHandler() {
  return React.useCallback((error: Error, context?: string) => {
    const errorInfo = formatErrorInfo(error, context || 'Manual error report')
    const errorId = generateErrorId()

    console.error(`Manual error report [${errorId}]:`, errorInfo)

    // Aquí podrías integrar con servicios de logging como Sentry
    // Sentry.captureException(error, { tags: { errorId, context } });

    return errorId
  }, [])
}

export default ErrorBoundary
