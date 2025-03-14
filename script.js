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
        // Obtener valores del formulario
        const coefficient = parseFloat(document.getElementById('power-coefficient').value) || 1;
        const variable = document.getElementById('power-variable').value || 'x';
        const exponent = parseFloat(document.getElementById('power-exponent').value);
        
        if (isNaN(exponent)) {
            resultDiv.innerHTML = '<p>Por favor, introduce un exponente válido.</p>';
            return;
        }
        
        // Calcular la integral
        if (exponent === -1) {
            // Caso especial: integrar 1/x
            resultDiv.innerHTML = `<p>∫${formatCoefficient(coefficient)}${variable}<sup>-1</sup> d${variable} = ${coefficient}ln|${variable}| + C</p>`;
        } else {
            // Caso general: integrar x^n
            const newExponent = exponent + 1;
            let result = coefficient / newExponent;
            
            resultDiv.innerHTML = `<p>∫${formatCoefficient(coefficient)}${variable}<sup>${exponent}</sup> d${variable} = ${formatCoefficient(result)}${variable}<sup>${newExponent}</sup> + C</p>`;
        }
    });
    
    // Función para calcular integral trigonométrica
    calculateTrigBtn.addEventListener('click', function() {
        // Obtener valores del formulario
        const coefficient = parseFloat(document.getElementById('trig-coefficient').value) || 1;
        const trigFunction = document.getElementById('trig-function').value;
        const aCoefficient = parseFloat(document.getElementById('trig-a').value) || 1;
        const variable = document.getElementById('trig-variable').value || 'x';
        const bConstant = parseFloat(document.getElementById('trig-b').value) || 0;
        
        // Crear representación del argumento
        const argument = formatArgument(aCoefficient, variable, bConstant);
        
        // Calcular la integral
        let result;
        if (trigFunction === 'sin') {
            // Integral de sin(ax+b)
            const factor = coefficient / aCoefficient;
            result = `${formatCoefficient(-factor)}cos(${argument}) + C`;
        } else if (trigFunction === 'cos') {
            // Integral de cos(ax+b)
            const factor = coefficient / aCoefficient;
            result = `${formatCoefficient(factor)}sin(${argument}) + C`;
        }
        
        resultDiv.innerHTML = `<p>∫${formatCoefficient(coefficient)}${trigFunction}(${argument}) d${variable} = ${result}</p>`;
    });
    
    // Función para calcular integral exponencial
    // Modificación para manejar fracciones en exponentes de integrales exponenciales
    calculateExpBtn.addEventListener('click', function() {
        // Obtener valores del formulario
        const coefficientA = parseFloat(document.getElementById('exp-coefficient-a').value) || 1;
        const coefficientArgInput = document.getElementById('exp-coefficient-arg').value;
        const variable = document.getElementById('exp-variable').value || 'x';
        
        // Procesar el coeficiente del exponente (permitir fracciones como "1/3")
        let coefficientArg;
        if (coefficientArgInput.includes('/')) {
            const parts = coefficientArgInput.split('/');
            if (parts.length === 2) {
                const numerator = parseFloat(parts[0]);
                const denominator = parseFloat(parts[1]);
                if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
                    coefficientArg = numerator / denominator;
                } else {
                    resultDiv.innerHTML = '<p>Por favor, introduce un coeficiente válido.</p>';
                    return;
                }
            }
        } else {
            coefficientArg = parseFloat(coefficientArgInput) || 1;
        }
        
        // Calcular la integral
        if (coefficientArg === 0) {
            // Caso especial: integrar A
            resultDiv.innerHTML = `<p>∫${formatCoefficient(coefficientA)} d${variable} = ${formatCoefficient(coefficientA)}${variable} + C</p>`;
        } else {
            // Caso general: integrar A*e^(ax)
            const factor = coefficientA / coefficientArg;
            
            // Para la visualización, mantener la forma original del input
            const originalArgDisplay = coefficientArgInput.includes('/') ? coefficientArgInput : formatCoefficient(coefficientArg);
            
            resultDiv.innerHTML = `<p>∫${formatCoefficient(coefficientA)}e<sup>${originalArgDisplay}${variable}</sup> d${variable} = ${formatCoefficient(factor)}e<sup>${originalArgDisplay}${variable}</sup> + C</p>`;
        }
    });
    
    // Función para calcular integral logarítmica
    calculateLogBtn.addEventListener('click', function() {
        // Obtener valores del formulario
        const coefficient = parseFloat(document.getElementById('log-coefficient').value) || 1;
        const variable = document.getElementById('log-variable').value || 'x';
        
        // Calcular la integral
        resultDiv.innerHTML = `<p>∫${formatCoefficient(coefficient)}/${variable} d${variable} = ${coefficient}ln|${variable}| + C</p>`;
    });
    
    // Función para formatear coeficientes
    // Función mejorada para formatear coeficientes
    function formatCoefficient(coefficient) {
        if (coefficient === 1) return '';
        if (coefficient === -1) return '-';
        
        // Verificar si es un número entero
        if (Number.isInteger(coefficient)) {
            return coefficient.toString();
        }
        
        // Para fracciones, simplificarlas
        if (isRational(coefficient)) {
            const [numerator, denominator] = decimalToFraction(coefficient);
            if (denominator === 1) {
                return numerator.toString();
            }
            return `<sup>${numerator}</sup>/<sub>${denominator}</sub>`;
        }
        
        // Para otros números decimales, mostrar con precisión limitada
        return coefficient.toFixed(3).replace(/\.?0+$/, '');
    }
    
    // Función para formatear el argumento de funciones trigonométricas
    function formatArgument(a, variable, b) {
        let result = '';
        
        // Añadir ax
        if (a === 1) {
            result = variable;
        } else if (a === -1) {
            result = `-${variable}`;
        } else {
            result = `${a}${variable}`;
        }
        
        // Añadir +b o -b si b no es cero
        if (b !== 0) {
            if (b > 0) {
                result += ` + ${b}`;
            } else {
                result += ` - ${Math.abs(b)}`;
            }
        }
        
        return result;
    }
    
    // Verificar si un número es racional con una precisión razonable
    function isRational(num, epsilon = 1e-10) {
        const [numerator, denominator] = decimalToFraction(num, epsilon);
        return denominator <= 1000;  // Limitar denominadores para fracciones razonables
    }
    
    // Convertir decimal a fracción usando el algoritmo de fracciones continuas
    function decimalToFraction(decimal, epsilon = 1e-10) {
        if (Math.abs(decimal) < epsilon) return [0, 1];
        if (Math.abs(decimal - Math.round(decimal)) < epsilon) return [Math.round(decimal), 1];
        
        let sign = decimal < 0 ? -1 : 1;
        decimal = Math.abs(decimal);
        
        // Algoritmo de fracciones continuas
        let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
        let b = decimal;
        
        do {
            let a = Math.floor(b);
            let aux = h1;
            h1 = a * h1 + h2;
            h2 = aux;
            aux = k1;
            k1 = a * k1 + k2;
            k2 = aux;
            b = 1 / (b - a);
        } while (Math.abs(decimal - h1 / k1) > epsilon * k1);
        
        return [sign * h1, k1];
    }
    
    // Función para encontrar el máximo común divisor (para simplificar fracciones)
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