// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.
$(document).ready(function() {
    var currentYear = new Date().getFullYear();
        
    document.getElementById("currentYear").textContent = currentYear;

    setDefaultParameters();
    $('#calculateButton').hide();
});

function setDefaultParameters(){
    $('#media15').val(formatCurrency(salarioMedia15));
    $('#media16').val(formatCurrency(salarioMedia16));
    $('#media17').val(formatCurrency(salarioMedia17));
    $('#media18').val(formatCurrency(salarioMedia18));
    $('#media19').val(formatCurrency(salarioMedia19));
    $('#media20').val(formatCurrency(salarioMedia20));
    $('#media21').val(formatCurrency(salarioMedia21));
    $('#media22').val(formatCurrency(salarioMedia22));
}

document.getElementById('fileContent').addEventListener('paste', function(event) {
    $('#calculateButton').show();
});

function onFileContentChanged(parameter){
    if(parameter.value == null || parameter.value.trim() == ''){
        $('#calculateButton').hide();
    }
}

// Write your JavaScript code.
document.getElementById('loadFileButton').addEventListener('click', function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.addEventListener('change', function () {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                document.getElementById('fileContent').value = event.target.result;
                document.getElementById('fileContent').style.display = 'block';
                document.getElementById('calculateButton').style.display = 'block';
            };
            reader.readAsText(file);
        }
    });
    input.click();
});

$('#calculateButton').click(function() {
    // Obtener el texto del área de texto
    var textBoxArea = $('#fileContent').val();

    // Separar líneas
    var lines = textBoxArea.split(/\r?\n/).filter(line => line.trim() !== '');

    // Crear un nuevo libro de trabajo
    var wb = XLSX.utils.book_new();
    var ws_data = [];
    var sumaSalarioTotal = 0;

    // Agregar encabezados
    ws_data.push(['Jugador', 'Media GK', 'Media DF', 'Media MF', 'Media FW', 'Salario']);

    // Procesar cada línea
    lines.forEach(function(line) {
        if (line.includes('Name') || line.includes('-----')) return;

        // Separar valores
        var values = line.split(/\s+/).filter(value => value.trim() !== '');
        if (values.length === 0) return;

        var nombre = values[0];
        var mediaGK = parseInt(values[3]);
        var mediaDF = parseInt(values[4]);
        var mediaMF = parseInt(values[5]);
        var mediaFW = parseInt(values[6]);

        // Calcular media máxima
        var medias = {
            'GK': mediaGK,
            'DF': mediaDF,
            'MF': mediaMF,
            'FW': mediaFW
        };

        var mediaMaxima = Math.max(mediaGK, mediaDF, mediaMF, mediaFW);
        var salario;

        switch (mediaMaxima) {
            case 15:
                salario = $('#media15').val();
                sumaSalarioTotal += parseCurrency($('#media15').val());
                break;
            case 16:
                salario = $('#media16').val();
                sumaSalarioTotal += parseCurrency($('#media16').val());
                break;
            case 17:
                salario = $('#media17').val();
                sumaSalarioTotal += parseCurrency($('#media17').val());
                break;
            case 18:
                salario = $('#media18').val();
                sumaSalarioTotal += parseCurrency($('#media18').val());
                break;
            case 19:
                salario = $('#media19').val();
                sumaSalarioTotal += parseCurrency($('#media19').val());
                break;
            case 20:
                salario = $('#media20').val();
                sumaSalarioTotal += parseCurrency($('#media20').val());
                break;
            case 21:
                salario = $('#media21').val();
                sumaSalarioTotal += parseCurrency($('#media21').val());
                break;
            case 22:
                salario = $('#media22').val();
                sumaSalarioTotal += parseCurrency($('#media22').val());
                break;
            default:
                salario = "$0";
                break;
        }

        // Agregar fila
        ws_data.push([nombre, mediaGK, mediaDF, mediaMF, mediaFW, salario]);
    });

    // Agregar fila de total
    ws_data.push(['', '', '', '', 'Salario Total', formatCurrency(sumaSalarioTotal)]);

    // Crear la hoja de trabajo
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Datos');

    // Generar el archivo Excel y descargarlo
    XLSX.writeFile(wb, 'CalculoSalarios.xlsx');

    var successToast = new bootstrap.Toast(document.getElementById('successToast'), {
        autohide: true, // Cambiar a false si no deseas que se cierre automáticamente
        delay: 2000    // Mostrar durante 10 segundos (10000 ms)
    });
    successToast.show();

    $('#fileContent').val('');
    $('#calculateButton').hide();
});

function formatCurrency(value) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatCurrencyWithSymbol(element) {
    let value = element.value;
    value = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    if (value) {
        // Convert to integer and format as currency
        let formattedValue = parseInt(value, 10).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
        element.value = formattedValue;
    } else {
        element.value = '';
    }
}

function parseCurrency(value) {
    // Eliminar caracteres que no sean números
    let numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
    
    // Verificar si el resultado es NaN, null, undefined o 0, y devolver 0 en esos casos
    if (isNaN(numericValue) || numericValue === null || numericValue === undefined || numericValue === 0
        || numericValue === '') {
        return 0;
    }
    
    // Devolver el valor numérico si es válido
    return numericValue;
}