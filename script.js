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
        
        // Mostrar los pasos
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
        
        // Mostrar los pasos
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
        
        // Mostrar los pasos
        showExpIntegrationSteps(coefficientA, coefficientArg, coefficientArgInput, variable);
    });
    
    // Función para calcular integral logarítmica
    // Modificar el event listener del botón para calcular integral logarítmica
    calculateLogBtn.addEventListener('click', function() {
        // Obtener el coeficiente común
        const coefficient = parseFloat(document.getElementById('log-coefficient').value) || 1;
        
        // Obtener el tipo de función
        const functionType = document.getElementById('log-function-type').value;
        
        let result = '';
        let integralText = '';
        let variable = '';
        let expression = '';
        
        // Procesar según el tipo de función
        if (functionType === 'simple') {
            // Integral simple 1/x
            variable = document.getElementById('log-variable').value || 'x';
            integralText = `∫${formatCoefficient(coefficient)}/${variable} d${variable}`;
            result = `${coefficient}ln|${variable}| + C`;
        } 
        else if (functionType === 'algebraic') {
            // Integral algebraica 1/(x+a), 1/x^2, etc.
            expression = document.getElementById('log-algebraic-expression').value || 'x+1';
            variable = document.getElementById('log-algebraic-variable').value || 'x';
            integralText = `∫${formatCoefficient(coefficient)}/(${expression}) d${variable}`;
            result = `${coefficient}ln|${expression}| + C`;
        } 
        else if (functionType === 'exponential') {
            // Integral exponencial 1/e^x, etc.
            const base = document.getElementById('log-exp-base').value || 'e';
            const exponent = document.getElementById('log-exp-exponent').value || 'x';
            variable = document.getElementById('log-exp-variable').value || 'x';
            
            // Formato especial para base e
            const baseDisplay = base === 'e' ? 'e' : base;
            
            integralText = `∫${formatCoefficient(coefficient)}/${baseDisplay}<sup>${exponent}</sup> d${variable}`;
            result = `${coefficient}ln|${baseDisplay}<sup>${exponent}</sup>| + C`;
            
            expression = `${baseDisplay}<sup>${exponent}</sup>`;
        }
        
        resultDiv.innerHTML = `<p>${integralText} = ${result}</p>`;
        
        // Mostrar los pasos
        showLogIntegrationSteps(coefficient, functionType, variable, expression);
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

    // Modificar la función para calcular integral logarítmica
    calculateLogBtn.addEventListener('click', function() {
        // Obtener el coeficiente común
        const coefficient = parseFloat(document.getElementById('log-coefficient').value) || 1;
        
        // Obtener el tipo de función
        const functionType = document.getElementById('log-function-type').value;
        
        let result = '';
        let integralText = '';
        
        // Procesar según el tipo de función
        if (functionType === 'simple') {
            // Integral simple 1/x
            const variable = document.getElementById('log-variable').value || 'x';
            integralText = `∫${formatCoefficient(coefficient)}/${variable} d${variable}`;
            result = `${coefficient}ln|${variable}| + C`;
        } 
        else if (functionType === 'algebraic') {
            // Integral algebraica 1/(x+a), 1/x^2, etc.
            const expression = document.getElementById('log-algebraic-expression').value || 'x+1';
            const variable = document.getElementById('log-algebraic-variable').value || 'x';
            integralText = `∫${formatCoefficient(coefficient)}/(${expression}) d${variable}`;
            result = `${coefficient}ln|${expression}| + C`;
        } 
        else if (functionType === 'exponential') {
            // Integral exponencial 1/e^x, etc.
            const base = document.getElementById('log-exp-base').value || 'e';
            const exponent = document.getElementById('log-exp-exponent').value || 'x';
            const variable = document.getElementById('log-exp-variable').value || 'x';
            
            // Formato especial para base e
            const baseDisplay = base === 'e' ? 'e' : base;
            
            integralText = `∫${formatCoefficient(coefficient)}/${baseDisplay}<sup>${exponent}</sup> d${variable}`;
            result = `${coefficient}ln|${baseDisplay}<sup>${exponent}</sup>| + C`;
        }
        
        resultDiv.innerHTML = `<p>${integralText} = ${result}</p>`;
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
        
        // Limpiar contenido anterior
        stepsContent.innerHTML = '';
        
        // Mostrar el contenedor de pasos
        stepsContainer.classList.add('active');
        
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
    }

    // Función para generar y mostrar los pasos de una integral trigonométrica
    function showTrigIntegrationSteps(coefficient, trigFunction, aCoefficient, variable, bConstant) {
        const stepsContainer = document.getElementById('steps-container');
        const stepsContent = document.getElementById('steps-content');
        
        // Limpiar contenido anterior
        stepsContent.innerHTML = '';
        
        // Mostrar el contenedor de pasos
        stepsContainer.classList.add('active');
        
        // Crear representación del argumento
        const argument = formatArgument(aCoefficient, variable, bConstant);
        
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
        
        let result;
        if (trigFunction === 'sin') {
            const factor = coefficient / aCoefficient;
            result = `${formatCoefficient(-factor)}cos(<span class="variable">${argument}</span>) + C`;
            
            step4.innerHTML = `
                <div class="step-title">Paso 4: Desarrollo matemático</div>
                <div class="step-content">
                    <p>∫<span class="coef">${formatCoefficient(coefficient)}</span>sin(<span class="variable">${argument}</span>) d<span class="variable">${variable}</span> = 
                    <span class="coef">${formatCoefficient(coefficient)}</span>·(-cos(<span class="variable">${argument}</span>)/<span class="coef">${aCoefficient}</span>) + C</p>
                    <p>= ${result}</p>
                </div>
            `;
        } else {
            const factor = coefficient / aCoefficient;
            result = `${formatCoefficient(factor)}sin(<span class="variable">${argument}</span>) + C`;
            
            step4.innerHTML = `
                <div class="step-title">Paso 4: Desarrollo matemático</div>
                <div class="step-content">
                    <p>∫<span class="coef">${formatCoefficient(coefficient)}</span>cos(<span class="variable">${argument}</span>) d<span class="variable">${variable}</span> = 
                    <span class="coef">${formatCoefficient(coefficient)}</span>·(sin(<span class="variable">${argument}</span>)/<span class="coef">${aCoefficient}</span>) + C</p>
                    <p>= ${result}</p>
                </div>
            `;
        }
        stepsContent.appendChild(step4);
    }

    // Función para generar y mostrar los pasos de una integral exponencial
    function showExpIntegrationSteps(coefficientA, coefficientArg, coefficientArgInput, variable) {
        const stepsContainer = document.getElementById('steps-container');
        const stepsContent = document.getElementById('steps-content');
        
        // Limpiar contenido anterior
        stepsContent.innerHTML = '';
        
        // Mostrar el contenedor de pasos
        stepsContainer.classList.add('active');
        
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
            const originalArgDisplay = coefficientArgInput.includes('/') ? coefficientArgInput : formatCoefficient(coefficientArg);
            
            step4.innerHTML = `
                <div class="step-title">Paso 4: Desarrollo matemático</div>
                <div class="step-content">
                    <p>∫<span class="coef">${formatCoefficient(coefficientA)}</span>e<sup><span class="coef">${originalArgDisplay}</span><span class="variable">${variable}</span></sup> d<span class="variable">${variable}</span> = 
                    <span class="coef">${formatCoefficient(coefficientA)}</span>/<span class="coef">a</span>·e<sup><span class="coef">${originalArgDisplay}</span><span class="variable">${variable}</span></sup> + C</p>
                    <p>= <span class="coef">${formatCoefficient(factor)}</span>e<sup><span class="coef">${originalArgDisplay}</span><span class="variable">${variable}</span></sup> + C</p>
                </div>
            `;
        }
        stepsContent.appendChild(step4);
    }

    // Función para generar y mostrar los pasos de una integral logarítmica
    function showLogIntegrationSteps(coefficient, functionType, variable, expression) {
        const stepsContainer = document.getElementById('steps-container');
        const stepsContent = document.getElementById('steps-content');
        
        // Limpiar contenido anterior
        stepsContent.innerHTML = '';
        
        // Mostrar el contenedor de pasos
        stepsContainer.classList.add('active');
        
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
    }
});