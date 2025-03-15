let chartInstance = null;

function destroyChart() {
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
}

function createChart(originalFunction, integralFunction, variable) {
    destroyChart();
    
    const ctx = document.getElementById('integralChart').getContext('2d');
    const labels = Array.from({length: 21}, (_, i) => -5 + i * 0.5); // Rango de -5 a 5
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Función original (${variable})`,
                data: labels.map(x => originalFunction(x)),
                borderColor: '#3498db',
                tension: 0.4
            }, {
                label: `Integral (${variable})`,
                data: labels.map(x => integralFunction(x)),
                borderColor: '#2ecc71',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}
// Esperar a que el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Referencias para la pantalla de bienvenida
    const welcomeScreen = document.getElementById('welcome-screen');
    const enterButton = document.getElementById('enter-button');
    const mainContent = document.getElementById('main-content');
    const welcomeSound = document.getElementById('welcome-sound');
    
    // AÑADE LAS FUNCIONES DE EASTER EGG AQUÍ
    // Función para crear y configurar los easter eggs
    function setupEasterEggs() {
        // Definir los easter eggs para cada tipo de integral
        const easterEggs = {
          'power': {
            position: 'top-right',
            image: 'assets/easter-eggs/img/Taylor_Swift.jpg',
            caption: "OMGG!! IT'S TAYLOR SWIFT!!",
            sound: 'assets/easter-eggs/sounds/New_Romantics.mp3'
          },
          'trig': {
            position: 'bottom-left',
            image: 'assets/easter-eggs/img/Sabrina_Carpenter.jpg',
            caption: 'Lit si',
            sound: 'assets/easter-eggs/sounds/Espresso.mp3'
          },
          'exp': {
            position: 'top-left',
            image: 'assets/easter-eggs/img/Olivia_Rodrigo.jpg',
            caption: 'We love you too Olivia Rodrigoo <33',
            sound: 'assets/easter-eggs/sounds/All_American_Bitch.mp3'
          },
          'log': {
            position: 'bottom-right',
            image: 'assets/easter-eggs/img/Luis_Miguel.jpg',
            caption: 'Está fuerte el sol...',
            sound: 'assets/easter-eggs/sounds/Cuando_Calienta_el_Sol.mp3'
          }
        };
        
        // Crear el contenedor modal para mostrar las imágenes
        const modal = document.createElement('div');
        modal.className = 'easter-egg-modal';
        modal.innerHTML = `
          <div class="easter-egg-content">
            <span class="close-easter-egg">&times;</span>
            <img id="easter-egg-image" src="" alt="Easter egg">
            <p id="easter-egg-caption"></p>
          </div>
        `;
        document.body.appendChild(modal);
        
        // Cerrar el modal al hacer clic en X
        const closeBtn = modal.querySelector('.close-easter-egg');
        closeBtn.addEventListener('click', () => {
          modal.classList.remove('show');
          // Eliminamos el sonido de cierre
        });
        
        // Cerrar el modal al hacer clic fuera de la imagen
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('show');
            // Eliminamos el sonido de cierre
          }
        });
        
        // Crear y añadir puntos de easter egg para cada tipo de formulario
        Object.keys(easterEggs).forEach(formType => {
          const formSection = document.getElementById(`${formType}-form`);
          if (!formSection) return;
          
          const eggData = easterEggs[formType];
          const eggDot = document.createElement('div');
          eggDot.className = `easter-egg-dot ${eggData.position}`;
          
          // Añadir un pequeño efecto de brillo ocasional para dar pistas sutiles
          setInterval(() => {
            eggDot.classList.add('twinkle');
            setTimeout(() => eggDot.classList.remove('twinkle'), 500);
          }, Math.random() * 20000 + 15000); // Entre 15-35 segundos
          
          formSection.appendChild(eggDot);
          
          // Configurar el evento de clic
          eggDot.addEventListener('click', () => {
            const img = document.getElementById('easter-egg-image');
            const caption = document.getElementById('easter-egg-caption');
            
            img.src = eggData.image;
            caption.textContent = eggData.caption;
            modal.classList.add('show');
            
            // Reproducir el sonido específico para este easter egg
            playSound(eggData.sound);
            
            // Registrar que el usuario encontró este easter egg
            markEasterEggFound(formType);
          });
        });
      }
  
      // Función para reproducir sonidos
      function playSound(src) {
        const sound = new Audio(src);
        sound.volume = 0.5;
        sound.play().catch(err => console.error('Error playing sound:', err));
      }
  
      // Función para registrar easter eggs encontrados
      function markEasterEggFound(type) {
        let foundEggs = JSON.parse(localStorage.getItem('foundEasterEggs') || '[]');
        if (!foundEggs.includes(type)) {
          foundEggs.push(type);
          localStorage.setItem('foundEasterEggs', JSON.stringify(foundEggs));
          
          // Si el usuario ha encontrado todos, mostrar un mensaje especial
          if (foundEggs.length === 4) {
            setTimeout(() => {
              alert('¡Felicidades! Has encontrado todos los easter eggs cantautores. A hidratarse, porque está fuerte el sol.');
            }, 1500);
          }
        }
      }

    // Función para entrar a la aplicación
    enterButton.addEventListener('click', function() {
        // Reproducir sonido
        welcomeSound.play().catch(err => {
            console.error('Error al reproducir sonido:', err);
        });
        
        // Ocultar pantalla de bienvenida
        welcomeScreen.classList.add('welcome-hidden');
        
        // Preparar el contenido principal: quitamos la clase hidden pero mantenemos opacidad 0
        mainContent.classList.remove('main-content-hidden');
        mainContent.style.opacity = '0';
        
        // Aplicamos las animaciones inmediatamente, sin delay
        if (!sessionStorage.getItem('animationShown')) {
            sessionStorage.setItem('animationShown', 'true');
            
            // Agregar las clases de animación
            const title = document.querySelector('h1');
            if (title) title.classList.add('animate-title');
            
            const container = document.querySelector('.container');
            if (container) container.classList.add('animate-container');
            
            document.querySelectorAll('.form-section').forEach(function(el) {
                el.classList.add('animate-form');
            });
            
            const result = document.getElementById('result');
            if (result) result.classList.add('animate-result');
            
            const chartContainer = document.querySelector('.chart-container');
            if (chartContainer) chartContainer.classList.add('animate-chart');
            
            const footer = document.querySelector('.site-footer');
            if (footer) footer.classList.add('animate-footer');
            
            const integralSymbol = document.querySelector('.math-symbol');
            if (integralSymbol) integralSymbol.classList.add('animate-integral-symbol');
            
            // Una vez aplicadas las clases, hacemos visible todo con una transición suave
            setTimeout(() => {
                mainContent.style.opacity = '1';
                mainContent.style.transition = 'opacity 0.3s ease';
            }, 50);
        } else {
            // Si ya se mostró la animación, simplemente hacemos todo visible inmediatamente
            mainContent.style.opacity = '1';
            document.querySelectorAll('[class*="animate-"]').forEach(function(el) {
                el.style.opacity = '1';
                el.style.animation = 'none';
            });
        }
        setTimeout(setupEasterEggs, 1000);
    });
    
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
        
        // Mostrar los pasos y resultados mejorados
        showPowerIntegrationSteps(coefficient, variable, exponent);
    });
    
    // Modificar el event listener del botón para calcular integral trigonométrica
    calculateTrigBtn.addEventListener('click', function() {
        // Obtener valores del formulario
        const coefficient = parseFloat(document.getElementById('trig-coefficient').value) || 1;
        const trigFunction = document.getElementById('trig-function').value;
        const aCoefficient = parseFloat(document.getElementById('trig-a').value) || 1;
        const variable = document.getElementById('trig-variable').value || 'x';
        const bConstant = parseFloat(document.getElementById('trig-b').value) || 0;
        
        // Crear representación del argumento
        const argument = formatArgument(aCoefficient, variable, bConstant);
        
        // Mostrar los pasos y resultados mejorados
        showTrigIntegrationSteps(coefficient, trigFunction, aCoefficient, variable, bConstant);
    });
    
    // (1)Función para calcular integral exponencial
    // (2)Modificación para manejar fracciones en exponentes de integrales exponenciales
    // (3)Modificar el event listener del botón para calcular integral exponencial
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
        
        // Mostrar los pasos y resultados mejorados
        showExpIntegrationSteps(coefficientA, coefficientArg, coefficientArgInput, variable);
    });
    
    // Event listener para el botón de calcular integral logarítmica
    calculateLogBtn.addEventListener('click', function() {
        // Obtener valores del formulario
        const coefficient = parseFloat(document.getElementById('log-coefficient').value) || 1;
        const functionType = document.getElementById('log-function-type').value;
        
        // Variables específicas según el tipo de función
        let variable, expression;
        
        if (functionType === 'simple') {
            variable = document.getElementById('log-variable').value || 'x';
            
            // Mostrar los pasos y resultados mejorados
            showLogIntegrationSteps(coefficient, functionType, variable);
            
        } else if (functionType === 'algebraic') {
            expression = document.getElementById('log-algebraic-expression').value || 'x+1';
            variable = document.getElementById('log-algebraic-variable').value || 'x';
            
            // Mostrar los pasos y resultados mejorados
            showLogIntegrationSteps(coefficient, functionType, variable, expression);
            
        } else if (functionType === 'exponential') {
            const base = document.getElementById('log-exp-base').value || 'e';
            const exponent = document.getElementById('log-exp-exponent').value || 'x';
            variable = document.getElementById('log-exp-variable').value || 'x';
            
            // Crear una representación para mostrar
            const expression = `${base}<sup>${exponent}</sup>`;
            
            // Mostrar los pasos y resultados mejorados
            showLogIntegrationSteps(coefficient, functionType, variable, expression);
        }
        
        // Actualizar el resultado para mostrar en la UI si no se hace en showLogIntegrationSteps
        const resultDiv = document.getElementById('result');
        if (resultDiv.innerHTML === '<p>El resultado aparecerá aquí.</p>') {
            let result = '';
            
            if (functionType === 'simple') {
                result = `∫${formatCoefficient(coefficient)}/${variable} d${variable} = ${coefficient}ln|${variable}| + C`;
            } else if (functionType === 'algebraic') {
                result = `∫${formatCoefficient(coefficient)}/(${expression}) d${variable} = ${coefficient}ln|${expression}| + C`;
            } else if (functionType === 'exponential') {
                const base = document.getElementById('log-exp-base').value || 'e';
                const exponent = document.getElementById('log-exp-exponent').value || 'x';
                result = `∫${formatCoefficient(coefficient)}/${base}<sup>${exponent}</sup> d${variable} = ${coefficient}ln|${base}<sup>${exponent}</sup>| + C`;
            }
            
            resultDiv.innerHTML = `<p>${result}</p>`;
        }
    });

    // Manejador para el cambio de tipo de función logarítmica
    document.getElementById('log-function-type').addEventListener('change', function() {
        // Ocultar todos los formularios de entrada logarítmica
        document.querySelectorAll('.log-input').forEach(form => {
            form.classList.remove('active');
        });
        
        // Mostrar el formulario seleccionado
        const selectedForm = document.getElementById(`log-${this.value}`);
        selectedForm.classList.add('active');
    });

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
    // Función para generar y mostrar los pasos de una integral de potencia
    function showPowerIntegrationSteps(coefficient, variable, exponent) {
        const stepsContainer = document.getElementById('steps-container');
        const stepsContent = document.getElementById('steps-content');
        const resultDiv = document.getElementById('result');
        
        // Limpiar contenido anterior
        stepsContent.innerHTML = '';
        
        // Mostrar el contenedor de pasos
        stepsContainer.classList.add('active');
        
        // Crear una versión mejorada del resultado
        let enhancedResult = '';
        
        if (exponent === -1) {
            enhancedResult = `
                <div class="integral-result">
                    <div class="integral-expression">
                        ∫
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(coefficient)}
                            <span class="integral-tooltip">Coeficiente: multiplicador constante</span>
                        </span>
                        <span class="integral-component variable" tabindex="0">
                            ${variable}<sup>-1</sup>
                            <span class="integral-tooltip">Variable con exponente -1 (reciproco)</span>
                        </span>
                        d<span class="integral-component variable" tabindex="0">
                            ${variable}
                            <span class="integral-tooltip">Variable de integración</span>
                        </span>
                        <span class="integral-component operation">=</span>
                        <span class="integral-component coefficient" tabindex="0">
                            ${coefficient}
                            <span class="integral-tooltip">Coeficiente original</span>
                        </span>
                        ln|<span class="integral-component variable" tabindex="0">
                            ${variable}
                            <span class="integral-tooltip">Logaritmo natural del valor absoluto</span>
                        </span>| + C
                    </div>
                </div>
            `;
        } else {
            const newExponent = exponent + 1;
            let result = coefficient / newExponent;
            
            enhancedResult = `
                <div class="integral-result">
                    <div class="integral-expression">
                        ∫
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(coefficient)}
                            <span class="integral-tooltip">Coeficiente: multiplicador constante</span>
                        </span>
                        <span class="integral-component variable" tabindex="0">
                            ${variable}
                            <span class="integral-tooltip">Variable de integración</span>
                        </span>
                        <sup>
                            <span class="integral-component exponent" tabindex="0">
                                ${exponent}
                                <span class="integral-tooltip">Exponente original</span>
                            </span>
                        </sup>
                        d<span class="integral-component variable" tabindex="0">
                            ${variable}
                            <span class="integral-tooltip">Diferencial de la variable</span>
                        </span>
                        <span class="integral-component operation">=</span>
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(result)}
                            <span class="integral-tooltip">Coeficiente ÷ (exponente+1)</span>
                        </span>
                        <span class="integral-component variable" tabindex="0">
                            ${variable}
                            <span class="integral-tooltip">Variable de integración</span>
                        </span>
                        <sup>
                            <span class="integral-component exponent" tabindex="0">
                                ${newExponent}
                                <span class="integral-tooltip">Exponente + 1</span>
                            </span>
                        </sup>
                        + C
                    </div>
                </div>
            `;
        }
        
        // Actualizar el resultado con la versión mejorada
        resultDiv.innerHTML = enhancedResult;
        
        // Paso 1: Identificar la forma y componentes
        const step1 = document.createElement('div');
        step1.className = 'step';
        step1.innerHTML = `
            <div class="step-title">Paso 1: Identificar la forma y componentes</div>
            <div class="step-content">
                <p>La integral tiene la forma <span class="formula">∫A·x<sup>n</sup> dx</span>, donde:</p>
                <p><span class="coef">A = ${coefficient}</span></p>
                <p><span class="variable">Variable = ${variable}</span></p>
                <p><span class="variable">n = ${exponent}</span></p>
            </div>
        `;
        stepsContent.appendChild(step1);
        
        // Paso 2: Aplicar la fórmula de integración
        const step2 = document.createElement('div');
        step2.className = 'step';
        
        if (exponent === -1) {
            step2.innerHTML = `
                <div class="step-title">Paso 2: Aplicar la fórmula de integración para n = -1</div>
                <div class="step-content">
                    <p><span class="warning">Para n = -1</span>, la fórmula es:</p>
                    <p><span class="formula">∫A·${variable}<sup>-1</sup> d${variable} = ∫A/(${variable}) d${variable} = A·ln|${variable}| + C</span></p>
                </div>
            `;
        } else {
            step2.innerHTML = `
                <div class="step-title">Paso 2: Aplicar la fórmula de integración</div>
                <div class="step-content">
                    <p>Para n ≠ -1, la fórmula es:</p>
                    <p><span class="formula">∫A·${variable}<sup>n</sup> d${variable} = A·${variable}<sup>n+1</sup>/(n+1) + C</span></p>
                </div>
            `;
        }
        stepsContent.appendChild(step2);
        
        // Paso 3: Sustitución de valores
        const step3 = document.createElement('div');
        step3.className = 'step';
        step3.innerHTML = `
            <div class="step-title">Paso 3: Sustituir valores en la fórmula</div>
            <div class="step-content">
                <p>Sustituimos <span class="coef">A = ${coefficient}</span>, <span class="variable">variable = ${variable}</span>, <span class="variable">n = ${exponent}</span></p>
            </div>
        `;
        stepsContent.appendChild(step3);
        
        // Paso 4: Desarrollo matemático
        const step4 = document.createElement('div');
        step4.className = 'step';
        
        if (exponent === -1) {
            step4.innerHTML = `
                <div class="step-title">Paso 4: Desarrollo matemático</div>
                <div class="step-content">
                    <p>∫<span class="coef">${formatCoefficient(coefficient)}</span>/<span class="variable">${variable}</span> d<span class="variable">${variable}</span> = <span class="coef">${coefficient}</span>·ln|<span class="variable">${variable}</span>| + C</p>
                </div>
            `;
        } else {
            const newExponent = exponent + 1;
            const result = coefficient / newExponent;
            
            step4.innerHTML = `
                <div class="step-title">Paso 4: Desarrollo matemático</div>
                <div class="step-content">
                    <p>∫<span class="coef">${formatCoefficient(coefficient)}</span><span class="variable">${variable}</span><sup><span class="variable">${exponent}</span></sup> d<span class="variable">${variable}</span> = 
                    <span class="coef">${formatCoefficient(coefficient)}</span>·<span class="variable">${variable}</span><sup><span class="variable">${newExponent}</span></sup>/<span class="variable">${newExponent}</span> + C</p>
                    <p>= <span class="coef">${formatCoefficient(result)}</span><span class="variable">${variable}</span><sup><span class="variable">${newExponent}</span></sup> + C</p>
                </div>
            `;
        }
        stepsContent.appendChild(step4);
        // Función original e integral para graficar
        const originalFunction = x => coefficient * Math.pow(x, exponent);
        const integralFunction = x => (coefficient / (exponent + 1)) * Math.pow(x, exponent + 1);

        createChart(originalFunction, integralFunction, variable);
    }

    // Función para generar y mostrar los pasos de una integral trigonométrica
    function showTrigIntegrationSteps(coefficient, trigFunction, aCoefficient, variable, bConstant) {
        const stepsContainer = document.getElementById('steps-container');
        const stepsContent = document.getElementById('steps-content');
        const resultDiv = document.getElementById('result');
        
        // Limpiar contenido anterior
        stepsContent.innerHTML = '';
        
        // Mostrar el contenedor de pasos
        stepsContainer.classList.add('active');
        
        // Crear representación del argumento
        const argument = formatArgument(aCoefficient, variable, bConstant);
        
        // Crear una versión mejorada del resultado
        let enhancedResult = '';
        let factor;
        let resultFormula;
        
        if (trigFunction === 'sin') {
            factor = coefficient / aCoefficient;
            resultFormula = `${formatCoefficient(-factor)}cos(${argument}) + C`;
            
            enhancedResult = `
                <div class="integral-result">
                    <div class="integral-expression">
                        ∫
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(coefficient)}
                            <span class="integral-tooltip">Coeficiente: multiplicador constante</span>
                        </span>
                        sin(
                        <span class="integral-component variable" tabindex="0">
                            ${argument}
                            <span class="integral-tooltip">Argumento de la función seno</span>
                        </span>
                        ) d<span class="integral-component variable" tabindex="0">
                            ${variable}
                            <span class="integral-tooltip">Variable de integración</span>
                        </span>
                        <span class="integral-component operation">=</span>
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(-factor)}
                            <span class="integral-tooltip">-${coefficient}/${aCoefficient}</span>
                        </span>
                        cos(
                        <span class="integral-component variable" tabindex="0">
                            ${argument}
                            <span class="integral-tooltip">El mismo argumento se mantiene</span>
                        </span>
                        ) + C
                    </div>
                </div>
            `;
        } else {
            factor = coefficient / aCoefficient;
            resultFormula = `${formatCoefficient(factor)}sin(${argument}) + C`;
            
            enhancedResult = `
                <div class="integral-result">
                    <div class="integral-expression">
                        ∫
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(coefficient)}
                            <span class="integral-tooltip">Coeficiente: multiplicador constante</span>
                        </span>
                        cos(
                        <span class="integral-component variable" tabindex="0">
                            ${argument}
                            <span class="integral-tooltip">Argumento de la función coseno</span>
                        </span>
                        ) d<span class="integral-component variable" tabindex="0">
                            ${variable}
                            <span class="integral-tooltip">Variable de integración</span>
                        </span>
                        <span class="integral-component operation">=</span>
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(factor)}
                            <span class="integral-tooltip">${coefficient}/${aCoefficient}</span>
                        </span>
                        sin(
                        <span class="integral-component variable" tabindex="0">
                            ${argument}
                            <span class="integral-tooltip">El mismo argumento se mantiene</span>
                        </span>
                        ) + C
                    </div>
                </div>
            `;
        }
        
        // Actualizar el resultado con la versión mejorada
        resultDiv.innerHTML = enhancedResult;
        
        // Paso 1: Identificar la forma y componentes
        const step1 = document.createElement('div');
        step1.className = 'step';
        step1.innerHTML = `
            <div class="step-title">Paso 1: Identificar la forma y componentes</div>
            <div class="step-content">
                <p>La integral tiene la forma <span class="formula">∫A·${trigFunction}(ax+b) dx</span>, donde:</p>
                <p><span class="coef">A = ${coefficient}</span></p>
                <p><span class="coef">a = ${aCoefficient}</span></p>
                <p><span class="variable">Variable = ${variable}</span></p>
                <p><span class="coef">b = ${bConstant}</span></p>
            </div>
        `;
        stepsContent.appendChild(step1);
        
        // Paso 2: Aplicar la fórmula de integración
        const step2 = document.createElement('div');
        step2.className = 'step';
        
        if (trigFunction === 'sin') {
            step2.innerHTML = `
                <div class="step-title">Paso 2: Aplicar la fórmula de integración para seno</div>
                <div class="step-content">
                    <p>Para la función seno, la fórmula es:</p>
                    <p><span class="formula">∫sin(ax+b) dx = -cos(ax+b)/a + C</span></p>
                </div>
            `;
        } else {
            step2.innerHTML = `
                <div class="step-title">Paso 2: Aplicar la fórmula de integración para coseno</div>
                <div class="step-content">
                    <p>Para la función coseno, la fórmula es:</p>
                    <p><span class="formula">∫cos(ax+b) dx = sin(ax+b)/a + C</span></p>
                </div>
            `;
        }
        stepsContent.appendChild(step2);
        
        // Paso 3: Sustitución de valores
        const step3 = document.createElement('div');
        step3.className = 'step';
        step3.innerHTML = `
            <div class="step-title">Paso 3: Sustituir valores en la fórmula</div>
            <div class="step-content">
                <p>Sustituimos <span class="coef">A = ${coefficient}</span>, <span class="coef">a = ${aCoefficient}</span>, <span class="variable">variable = ${variable}</span>, <span class="coef">b = ${bConstant}</span></p>
            </div>
        `;
        stepsContent.appendChild(step3);
        
        // Paso 4: Desarrollo matemático
        const step4 = document.createElement('div');
        step4.className = 'step';
        
        if (trigFunction === 'sin') {
            step4.innerHTML = `
                <div class="step-title">Paso 4: Desarrollo matemático</div>
                <div class="step-content">
                    <p>∫<span class="coef">${formatCoefficient(coefficient)}</span>sin(<span class="variable">${argument}</span>) d<span class="variable">${variable}</span> = 
                    <span class="coef">${formatCoefficient(coefficient)}</span>·(-cos(<span class="variable">${argument}</span>)/<span class="coef">${aCoefficient}</span>) + C</p>
                    <p>= <span class="substitution">${resultFormula}</span></p>
                </div>
            `;
        } else {
            step4.innerHTML = `
                <div class="step-title">Paso 4: Desarrollo matemático</div>
                <div class="step-content">
                    <p>∫<span class="coef">${formatCoefficient(coefficient)}</span>cos(<span class="variable">${argument}</span>) d<span class="variable">${variable}</span> = 
                    <span class="coef">${formatCoefficient(coefficient)}</span>·(sin(<span class="variable">${argument}</span>)/<span class="coef">${aCoefficient}</span>) + C</p>
                    <p>= <span class="substitution">${resultFormula}</span></p>
                </div>
            `;
        }
        stepsContent.appendChild(step4);
        const originalFunction = x => coefficient * Math[trigFunction](aCoefficient * x + bConstant);
        const integralFunction = x => trigFunction === 'sin' 
            ? (-coefficient/aCoefficient) * Math.cos(aCoefficient * x + bConstant)
            : (coefficient/aCoefficient) * Math.sin(aCoefficient * x + bConstant);
        
        createChart(originalFunction, integralFunction, variable);
    }

    // Función para generar y mostrar los pasos de una integral exponencial
    function showExpIntegrationSteps(coefficientA, coefficientArg, coefficientArgInput, variable) {
        const stepsContainer = document.getElementById('steps-container');
        const stepsContent = document.getElementById('steps-content');
        const resultDiv = document.getElementById('result');
        
        // Limpiar contenido anterior
        stepsContent.innerHTML = '';
        
        // Mostrar el contenedor de pasos
        stepsContainer.classList.add('active');
        
        // Crear una versión mejorada del resultado
        let enhancedResult = '';
        const originalArgDisplay = coefficientArgInput.includes('/') ? coefficientArgInput : formatCoefficient(coefficientArg);

        if (coefficientArg === 0) {
            enhancedResult = `
                <div class="integral-result">
                    <div class="integral-expression">
                        ∫
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(coefficientA)}
                            <span class="integral-tooltip">Coeficiente constante</span>
                        </span>
                        d<span class="integral-component variable" tabindex="0">
                            ${variable}
                            <span class="integral-tooltip">Variable de integración</span>
                        </span>
                        <span class="integral-component operation">=</span>
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(coefficientA)}
                            <span class="integral-tooltip">El mismo coeficiente</span>
                        </span>
                        <span class="integral-component variable" tabindex="0">
                            ${variable}
                            <span class="integral-tooltip">Variable integrada</span>
                        </span>
                        + C
                    </div>
                </div>
            `;
        } else {
            const factor = coefficientA / coefficientArg;
            
            enhancedResult = `
                <div class="integral-result">
                    <div class="integral-expression">
                        ∫
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(coefficientA)}
                            <span class="integral-tooltip">Coeficiente constante</span>
                        </span>
                        e<sup>
                        <span class="integral-component exponent" tabindex="0">
                            ${originalArgDisplay}${variable}
                            <span class="integral-tooltip">Argumento del exponente</span>
                        </span>
                        </sup>
                        d<span class="integral-component variable" tabindex="0">
                            ${variable}
                            <span class="integral-tooltip">Variable de integración</span>
                        </span>
                        <span class="integral-component operation">=</span>
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(factor)}
                            <span class="integral-tooltip">${coefficientA}/${coefficientArgInput}</span>
                        </span>
                        e<sup>
                        <span class="integral-component exponent" tabindex="0">
                            ${originalArgDisplay}${variable}
                            <span class="integral-tooltip">El mismo exponente</span>
                        </span>
                        </sup>
                        + C
                    </div>
                </div>
            `;
        }
        
        // Actualizar el resultado con la versión mejorada
        resultDiv.innerHTML = enhancedResult;
        
        // Paso 1: Identificar la forma y componentes
        const step1 = document.createElement('div');
        step1.className = 'step';
        step1.innerHTML = `
            <div class="step-title">Paso 1: Identificar la forma y componentes</div>
            <div class="step-content">
                <p>La integral tiene la forma <span class="formula">∫A·e<sup>ax</sup> dx</span>, donde:</p>
                <p><span class="coef">A = ${coefficientA}</span></p>
                <p><span class="coef">a = ${coefficientArgInput}</span></p>
                <p><span class="variable">Variable = ${variable}</span></p>
            </div>
        `;
        stepsContent.appendChild(step1);
        
        // Paso 2: Aplicar la fórmula de integración
        const step2 = document.createElement('div');
        step2.className = 'step';
        
        if (coefficientArg === 0) {
            step2.innerHTML = `
                <div class="step-title">Paso 2: Aplicar la fórmula de integración para a = 0</div>
                <div class="step-content">
                    <p><span class="warning">Para a = 0</span>, la función se convierte en una constante:</p>
                    <p><span class="formula">∫A·e<sup>0</sup> dx = ∫A dx = A·x + C</span></p>
                </div>
            `;
        } else {
            step2.innerHTML = `
                <div class="step-title">Paso 2: Aplicar la fórmula de integración</div>
                <div class="step-content">
                    <p>Para la función exponencial, la fórmula es:</p>
                    <p><span class="formula">∫A·e<sup>ax</sup> dx = (A/a)·e<sup>ax</sup> + C</span></p>
                </div>
            `;
        }
        stepsContent.appendChild(step2);
        
        // Paso 3: Sustitución de valores
        const step3 = document.createElement('div');
        step3.className = 'step';
        step3.innerHTML = `
            <div class="step-title">Paso 3: Sustituir valores en la fórmula</div>
            <div class="step-content">
                <p>Sustituimos <span class="coef">A = ${coefficientA}</span>, <span class="coef">a = ${coefficientArgInput}</span>, <span class="variable">variable = ${variable}</span></p>
            </div>
        `;
        stepsContent.appendChild(step3);
        
        // Paso 4: Desarrollo matemático
        const step4 = document.createElement('div');
        step4.className = 'step';
        
        if (coefficientArg === 0) {
            step4.innerHTML = `
                <div class="step-title">Paso 4: Desarrollo matemático</div>
                <div class="step-content">
                    <p>∫<span class="coef">${formatCoefficient(coefficientA)}</span> d<span class="variable">${variable}</span> = <span class="coef">${formatCoefficient(coefficientA)}</span><span class="variable">${variable}</span> + C</p>
                </div>
            `;
        } else {
            const factor = coefficientA / coefficientArg;
            
            step4.innerHTML = `
                <div class="step-title">Paso 4: Desarrollo matemático</div>
                <div class="step-content">
                    <p>∫<span class="coef">${formatCoefficient(coefficientA)}</span>e<sup><span class="coef">${originalArgDisplay}</span><span class="variable">${variable}</span></sup> d<span class="variable">${variable}</span> = 
                    <span class="coef">${formatCoefficient(coefficientA)}</span>/<span class="coef">${coefficientArgInput}</span>·e<sup><span class="coef">${originalArgDisplay}</span><span class="variable">${variable}</span></sup> + C</p>
                    <p>= <span class="substitution">${formatCoefficient(factor)}e<sup>${originalArgDisplay}${variable}</sup> + C</span></p>
                </div>
            `;
        }
        stepsContent.appendChild(step4);
        const originalFunction = x => coefficientA * Math.exp(coefficientArg * x);
        const integralFunction = x => (coefficientA / coefficientArg) * Math.exp(coefficientArg * x);
        
        createChart(originalFunction, integralFunction, variable);
    }

    // Función para generar y mostrar los pasos de una integral logarítmica
    function showLogIntegrationSteps(coefficient, functionType, variable, expression) {
        const stepsContainer = document.getElementById('steps-container');
        const stepsContent = document.getElementById('steps-content');
        const resultDiv = document.getElementById('result');
        
        // Limpiar contenido anterior
        stepsContent.innerHTML = '';
        
        // Mostrar el contenedor de pasos
        stepsContainer.classList.add('active');
        
        // Crear una versión mejorada del resultado
        let enhancedResult = '';
        
        if (functionType === 'simple') {
            enhancedResult = `
                <div class="integral-result">
                    <div class="integral-expression">
                        ∫
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(coefficient)}
                            <span class="integral-tooltip">Coeficiente: multiplicador constante</span>
                        </span>
                        /<span class="integral-component variable" tabindex="0">
                            ${variable}
                            <span class="integral-tooltip">Variable en el denominador</span>
                        </span>
                        d<span class="integral-component variable" tabindex="0">
                            ${variable}
                            <span class="integral-tooltip">Variable de integración</span>
                        </span>
                        <span class="integral-component operation">=</span>
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(coefficient)}
                            <span class="integral-tooltip">Coeficiente original</span>
                        </span>
                        ln|<span class="integral-component variable" tabindex="0">
                            ${variable}
                            <span class="integral-tooltip">Logaritmo natural del valor absoluto</span>
                        </span>| + C
                    </div>
                </div>
            `;
        } else if (functionType === 'algebraic') {
            enhancedResult = `
                <div class="integral-result">
                    <div class="integral-expression">
                        ∫
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(coefficient)}
                            <span class="integral-tooltip">Coeficiente: multiplicador constante</span>
                        </span>
                        /(<span class="integral-component variable" tabindex="0">
                            ${expression}
                            <span class="integral-tooltip">Expresión algebraica en el denominador</span>
                        </span>)
                        d<span class="integral-component variable" tabindex="0">
                            ${variable}
                            <span class="integral-tooltip">Variable de integración</span>
                        </span>
                        <span class="integral-component operation">=</span>
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(coefficient)}
                            <span class="integral-tooltip">Coeficiente original</span>
                        </span>
                        ln|<span class="integral-component variable" tabindex="0">
                            ${expression}
                            <span class="integral-tooltip">Logaritmo natural del valor absoluto</span>
                        </span>| + C
                    </div>
                </div>
            `;
        } else if (functionType === 'exponential') {
            const base = document.getElementById('log-exp-base').value || 'e';
            const exponent = document.getElementById('log-exp-exponent').value || 'x';
            const baseDisplay = base === 'e' ? 'e' : base;
            
            enhancedResult = `
                <div class="integral-result">
                    <div class="integral-expression">
                        ∫
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(coefficient)}
                            <span class="integral-tooltip">Coeficiente: multiplicador constante</span>
                        </span>
                        /<span class="integral-component variable" tabindex="0">
                            ${baseDisplay}<sup>${exponent}</sup>
                            <span class="integral-tooltip">Función exponencial en el denominador</span>
                        </span>
                        d<span class="integral-component variable" tabindex="0">
                            ${variable}
                            <span class="integral-tooltip">Variable de integración</span>
                        </span>
                        <span class="integral-component operation">=</span>
                        <span class="integral-component coefficient" tabindex="0">
                            ${formatCoefficient(coefficient)}
                            <span class="integral-tooltip">Coeficiente original</span>
                        </span>
                        ln|<span class="integral-component variable" tabindex="0">
                            ${baseDisplay}<sup>${exponent}</sup>
                            <span class="integral-tooltip">Logaritmo natural del valor absoluto</span>
                        </span>| + C
                    </div>
                </div>
            `;
        }
        
        // Actualizar el resultado con la versión mejorada
        resultDiv.innerHTML = enhancedResult;
        
        // Paso 1: Identificar la forma y componentes
        const step1 = document.createElement('div');
        step1.className = 'step';
        
        if (functionType === 'simple') {
            step1.innerHTML = `
                <div class="step-title">Paso 1: Identificar la forma y componentes</div>
                <div class="step-content">
                    <p>La integral tiene la forma <span class="formula">∫A/x dx</span>, donde:</p>
                    <p><span class="coef">A = ${coefficient}</span></p>
                    <p><span class="variable">Variable = ${variable}</span></p>
                </div>
            `;
        } else if (functionType === 'algebraic') {
            step1.innerHTML = `
                <div class="step-title">Paso 1: Identificar la forma y componentes</div>
                <div class="step-content">
                    <p>La integral tiene la forma <span class="formula">∫A/(expresión) dx</span>, donde:</p>
                    <p><span class="coef">A = ${coefficient}</span></p>
                    <p><span class="variable">Expresión = ${expression}</span></p>
                </div>
            `;
        } else if (functionType === 'exponential') {
            const base = document.getElementById('log-exp-base').value || 'e';
            const exponent = document.getElementById('log-exp-exponent').value || 'x';
            
            step1.innerHTML = `
                <div class="step-title">Paso 1: Identificar la forma y componentes</div>
                <div class="step-content">
                    <p>La integral tiene la forma <span class="formula">∫A/e^(expresión) dx</span>, donde:</p>
                    <p><span class="coef">A = ${coefficient}</span></p>
                    <p><span class="variable">Base = ${base}</span></p>
                    <p><span class="variable">Exponente = ${exponent}</span></p>
                </div>
            `;
        }
        stepsContent.appendChild(step1);
            
        // Paso 2: Aplicar la fórmula de integración
        const step2 = document.createElement('div');
        step2.className = 'step';
        
        step2.innerHTML = `
            <div class="step-title">Paso 2: Aplicar la fórmula de integración</div>
            <div class="step-content">
                <p>Para funciones de la forma 1/f(x), la fórmula es:</p>
                <p><span class="formula">∫A·1/f(x) dx = A·ln|f(x)| + C</span></p>
            </div>
        `;
        stepsContent.appendChild(step2);
        
        // Paso 3: Sustitución de valores
        const step3 = document.createElement('div');
        step3.className = 'step';
        
        if (functionType === 'simple') {
            step3.innerHTML = `
                <div class="step-title">Paso 3: Sustituir valores en la fórmula</div>
                <div class="step-content">
                    <p>Sustituimos <span class="coef">A = ${coefficient}</span>, <span class="variable">f(x) = ${variable}</span></p>
                </div>
            `;
        } else if (functionType === 'algebraic') {
            step3.innerHTML = `
                <div class="step-title">Paso 3: Sustituir valores en la fórmula</div>
                <div class="step-content">
                    <p>Sustituimos <span class="coef">A = ${coefficient}</span>, <span class="variable">f(x) = ${expression}</span></p>
                </div>
            `;
        } else if (functionType === 'exponential') {
            const base = document.getElementById('log-exp-base').value || 'e';
            const exponent = document.getElementById('log-exp-exponent').value || 'x';
            
            step3.innerHTML = `
                <div class="step-title">Paso 3: Sustituir valores en la fórmula</div>
                <div class="step-content">
                    <p>Sustituimos <span class="coef">A = ${coefficient}</span>, <span class="variable">f(x) = ${base}<sup>${exponent}</sup></span></p>
                </div>
            `;
        }
        stepsContent.appendChild(step3);
        
        // Paso 4: Desarrollo matemático
        const step4 = document.createElement('div');
        step4.className = 'step';
        
        let integralText = '';
        let result = '';
        
        if (functionType === 'simple') {
            integralText = `∫<span class="coef">${formatCoefficient(coefficient)}</span>/<span class="variable">${variable}</span> d<span class="variable">${variable}</span>`;
            result = `<span class="coef">${coefficient}</span>ln|<span class="variable">${variable}</span>| + C`;
        } else if (functionType === 'algebraic') {
            integralText = `∫<span class="coef">${formatCoefficient(coefficient)}</span>/(<span class="variable">${expression}</span>) d<span class="variable">${variable}</span>`;
            result = `<span class="coef">${coefficient}</span>ln|<span class="variable">${expression}</span>| + C`;
        } else if (functionType === 'exponential') {
            const base = document.getElementById('log-exp-base').value || 'e';
            const exponent = document.getElementById('log-exp-exponent').value || 'x';
            const baseDisplay = base === 'e' ? 'e' : base;
            
            integralText = `∫<span class="coef">${formatCoefficient(coefficient)}</span>/<span class="variable">${baseDisplay}</span><sup><span class="variable">${exponent}</span></sup> d<span class="variable">${variable}</span>`;
            result = `<span class="coef">${coefficient}</span>ln|<span class="variable">${baseDisplay}</span><sup><span class="variable">${exponent}</span></sup>| + C`;
        }
        
        step4.innerHTML = `
            <div class="step-title">Paso 4: Desarrollo matemático</div>
            <div class="step-content">
                <p class="substitution">${integralText} = ${result}</p>
            </div>
        `;
        stepsContent.appendChild(step4);
        
        // Definir las funciones para todos los casos antes de intentar crear la gráfica
        let originalFunction, integralFunction;
        
        if (functionType === 'simple') {
            originalFunction = x => coefficient / x;
            integralFunction = x => coefficient * Math.log(Math.abs(x));
        } else if (functionType === 'algebraic') {
            originalFunction = x => {
                try {
                    return coefficient / (eval(expression.replace(new RegExp(variable, 'g'), x)));
                } catch (e) {
                    return NaN;
                }
            };
            integralFunction = x => {
                try {
                    return coefficient * Math.log(Math.abs(eval(expression.replace(new RegExp(variable, 'g'), x))));
                } catch (e) {
                    return NaN;
                }
            };
        } else if (functionType === 'exponential') {
            const base = document.getElementById('log-exp-base').value || 'e';
            const exponent = document.getElementById('log-exp-exponent').value || 'x';
            
            originalFunction = x => {
                try {
                    const baseValue = base === 'e' ? Math.E : parseFloat(base);
                    const expValue = eval(exponent.replace(new RegExp(variable, 'g'), x));
                    return coefficient / Math.pow(baseValue, expValue);
                } catch (e) {
                    console.error("Error en la función exponencial:", e);
                    return NaN;
                }
            };
            
            integralFunction = x => {
                try {
                    const baseValue = base === 'e' ? Math.E : parseFloat(base);
                    const expValue = eval(exponent.replace(new RegExp(variable, 'g'), x));
                    return coefficient * Math.log(Math.abs(Math.pow(baseValue, expValue)));
                } catch (e) {
                    console.error("Error en la integral exponencial:", e);
                    return NaN;
                }
            };
        }
        
        // Ahora crear la gráfica con las funciones definidas
        if (originalFunction && integralFunction) {
            createChart(originalFunction, integralFunction, variable);
        } else {
            console.error("No se pudieron definir las funciones para la gráfica");
        }
    }
});