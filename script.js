// Esperar a que el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  // Referencia a elementos del DOM
  const integralTypeSelect = document.getElementById('integral-type');
  const resultDiv = document.getElementById('result');
  
  // Referencias a los formularios
  const powerForm = document.getElementById('power-form');
  const trigForm = document.getElementById('trig-form');
  const expForm = document.getElementById('exp-form');
  const logForm = document.getElementById('log-form');
  
  // Referencia a los botones de cálculo
  const calculatePowerBtn = document.getElementById('calculate-power');
  const calculateTrigBtn = document.getElementById('calculate-trig');
  const calculateExpBtn = document.getElementById('calculate-exp');
  const calculateLogBtn = document.getElementById('calculate-log');
  
  // Función para mostrar el formulario correcto
  integralTypeSelect.addEventListener('change', function() {
      // Ocultar todos los formularios
      [powerForm, trigForm, expForm, logForm].forEach(form => {
          form.classList.remove('active');
      });
      
      // Mostrar el formulario seleccionado
      const selectedForm = document.getElementById(`${this.value}-form`);
      selectedForm.classList.add('active');
  });
  
  // Función para calcular integral de potencia
  calculatePowerBtn.addEventListener('click', function() {
      const variable = document.getElementById('power-variable').value || 'x';
      const exponent = parseFloat(document.getElementById('power-exponent').value);
      
      if (isNaN(exponent)) {
          resultDiv.innerHTML = '<p>Por favor, introduce un exponente válido.</p>';
          return;
      }
      
      if (exponent === -1) {
          resultDiv.innerHTML = `<p>La integral ∫${variable}<sup>-1</sup> d${variable} = ln|${variable}| + C</p>`;
      } else {
          const newExponent = exponent + 1;
          const denominator = newExponent;
          resultDiv.innerHTML = `<p>∫${variable}<sup>${exponent}</sup> d${variable} = ${formatFraction(1, denominator)}${variable}<sup>${newExponent}</sup> + C</p>`;
      }
  });
  
  // Función para calcular integral trigonométrica
  calculateTrigBtn.addEventListener('click', function() {
      const trigFunction = document.getElementById('trig-function').value;
      const variable = document.getElementById('trig-variable').value || 'x';
      
      if (trigFunction === 'sin') {
          resultDiv.innerHTML = `<p>∫sin(${variable}) d${variable} = -cos(${variable}) + C</p>`;
      } else if (trigFunction === 'cos') {
          resultDiv.innerHTML = `<p>∫cos(${variable}) d${variable} = sin(${variable}) + C</p>`;
      }
  });
  
  // Función para calcular integral exponencial
  calculateExpBtn.addEventListener('click', function() {
      const coefficient = parseFloat(document.getElementById('exp-coefficient').value) || 1;
      const variable = document.getElementById('exp-variable').value || 'x';
      
      if (coefficient === 0) {
          resultDiv.innerHTML = `<p>Si el coeficiente es 0, la integral es ∫1 d${variable} = ${variable} + C</p>`;
      } else {
          resultDiv.innerHTML = `<p>∫e<sup>${coefficient}${variable}</sup> d${variable} = ${formatFraction(1, coefficient)}e<sup>${coefficient}${variable}</sup> + C</p>`;
      }
  });
  
  // Función para calcular integral logarítmica
  calculateLogBtn.addEventListener('click', function() {
      const variable = document.getElementById('log-variable').value || 'x';
      resultDiv.innerHTML = `<p>∫(1/${variable}) d${variable} = ln|${variable}| + C</p>`;
  });
  
  // Función para formatear fracciones
  function formatFraction(numerator, denominator) {
      if (denominator === 1) {
          return numerator;
      }
      
      // Simplificar la fracción usando el máximo común divisor
      const gcd = findGCD(numerator, denominator);
      numerator = numerator / gcd;
      denominator = denominator / gcd;
      
      if (denominator === 1) {
          return numerator;
      }
      
      return `<sup>${numerator}</sup>/<sub>${denominator}</sub>`;
  }
  
  // Función para calcular el máximo común divisor
  function findGCD(a, b) {
      a = Math.abs(a);
      b = Math.abs(b);
      if (b > a) {
          [a, b] = [b, a];
      }
      while (b) {
          [a, b] = [b, a % b];
      }
      return a;
  }
});