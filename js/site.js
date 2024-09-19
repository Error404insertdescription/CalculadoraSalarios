﻿// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

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

    $('#fileContent').val('');
    $('#fileContent').hide();
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