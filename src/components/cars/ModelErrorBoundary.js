import React, { Component } from 'react';
import FallbackCar from './FallbackCar';

/**
 * Componente de limite de erro para modelos 3D
 * Captura erros durante a renderização de modelos 3D e exibe um fallback
 */
class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o estado para que a próxima renderização mostre o fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Você pode registrar o erro em um serviço de relatório de erros
    console.error('Erro ao renderizar modelo 3D:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Renderiza o componente de fallback
      return <FallbackCar color={this.props.fallbackColor || "#FF0000"} />;
    }

    return this.props.children;
  }
}

export default ModelErrorBoundary;