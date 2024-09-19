// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
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
                salario = "$500.000";
                sumaSalarioTotal += 500000;
                break;
            case 16:
                salario = "$1.000.000";
                sumaSalarioTotal += 1000000;
                break;
            case 17:
                salario = "$2.000.000";
                sumaSalarioTotal += 2000000;
                break;
            case 18:
                salario = "$3.000.000";
                sumaSalarioTotal += 3000000;
                break;
            case 19:
                salario = "$4.000.000";
                sumaSalarioTotal += 4000000;
                break;
            case 20:
                salario = "$5.000.000";
                sumaSalarioTotal += 5000000;
                break;
            case 21:
                salario = "$6.000.000";
                sumaSalarioTotal += 6000000;
                break;
            case 22:
                salario = "$7.000.000";
                sumaSalarioTotal += 7000000;
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