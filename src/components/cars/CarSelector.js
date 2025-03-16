import React, { useState, useEffect } from 'react';
import { availableCars } from '../../assets/models/cars';
import CarPreview from './CarPreview';
import { audioManager } from '../../assets/audio';

/**
 * Componente para seleção de carros
 * @param {Object} props - Propriedades do componente
 * @param {string} props.selectedCar - ID do carro selecionado
 * @param {Function} props.onSelectCar - Função chamada quando um carro é selecionado
 */
function CarSelector({ selectedCar, onSelectCar }) {
  // Encontrar o índice do carro selecionado no array de carros disponíveis
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Atualiza o índice quando o carro selecionado muda
  useEffect(() => {
    const index = availableCars.findIndex(car => car.id === selectedCar);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [selectedCar]);
  
  // Seleciona um carro
  const handleSelectCar = (carId) => {
    if (audioManager.sounds['click'] && !audioManager.isMuted) {
      audioManager.playSFX('click');
    }
    onSelectCar(carId);
  };
  
  // Navega para o próximo carro
  const nextCar = () => {
    const newIndex = (currentIndex + 1) % availableCars.length;
    setCurrentIndex(newIndex);
    handleSelectCar(availableCars[newIndex].id);
  };
  
  // Navega para o carro anterior
  const prevCar = () => {
    const newIndex = (currentIndex - 1 + availableCars.length) % availableCars.length;
    setCurrentIndex(newIndex);
    handleSelectCar(availableCars[newIndex].id);
  };
  
  // Obtém o carro atual
  const currentCar = availableCars[currentIndex];

  return (
    <div style={{ marginBottom: '20px' }}>
      <label 
        style={{ 
          display: 'block', 
          marginBottom: '15px',
          fontWeight: 'bold',
          color: '#ffffff',
          fontSize: 'clamp(18px, 2.5vw, 22px)',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}
      >
        Escolha seu carro:
      </label>
      
      {/* Visualização grande do carro selecionado com setas de navegação */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        height: '350px', // Aumentado de 250px para 350px
        margin: '0 auto 20px auto',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        {/* Seta esquerda */}
        <button 
          onClick={(e) => {
            e.preventDefault(); // Previne o submit do formulário
            e.stopPropagation(); // Impede a propagação do evento
            prevCar();
          }}
          type="button" // Especifica que não é um botão de submit
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px', // Aumentado de 40px para 50px
            height: '50px', // Aumentado de 40px para 50px
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '28px', // Aumentado de 24px para 28px
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'}
        >
          &#8592;
        </button>
        
        {/* Visualização 3D do carro */}
        <CarPreview carId={currentCar.id} />
        
        {/* Seta direita */}
        <button 
          onClick={(e) => {
            e.preventDefault(); // Previne o submit do formulário
            e.stopPropagation(); // Impede a propagação do evento
            nextCar();
          }}
          type="button" // Especifica que não é um botão de submit
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px', // Aumentado de 40px para 50px
            height: '50px', // Aumentado de 40px para 50px
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '28px', // Aumentado de 24px para 28px
            cursor: 'pointer',
            zIndex: 10,
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)'}
        >
          &#8594;
        </button>
        
        {/* Nome e cor do carro */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '0',
          right: '0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          padding: '8px',
          borderRadius: '0 0 15px 15px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: currentCar.color,
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}></div>
          
          <span style={{ 
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 'bold',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)'
          }}>
            {currentCar.name}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CarSelector;