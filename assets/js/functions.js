
function consultarAPIMicro() {
    medicamento = $('#medicamento  option:selected').val();
    inicio = $('#inicio').val()
    fim = $('#fim').val()
    const { palavrasChave } = dados.medicamentos[medicamento].microtendencia;
    const { estados } = dados;
    geoMapData = null;
    const data = {
        palavrasChave: JSON.stringify(palavrasChave),
        inicio,
        fim
    }
    $.ajax({
        url: 'http://localhost:3333/microtendencia',
        type: 'POST',
        data,
        success: (msg) => {
            geoMapData = msg.default
            gerarArrayMapa(dados.medicamentos[medicamento], 'microtendencia', geoMapData)
        },
        error: (err) => {
            console.log(err)
        }
    })
}
function consultarAPIMacro(medicamento) {
    const { palavrasChave } = dados.medicamentos[medicamento].macrotendencia;
    const { estados } = dados;
    geoMapData = null;
    const data = {
        palavrasChave: JSON.stringify(palavrasChave)
    }
    $.ajax({
        url: 'http://localhost:3333/macrotendencia',
        type: 'POST',
        data,
        success: (msg) => {
            geoMapData = msg.default
            gerarArrayMapa(dados.medicamentos[medicamento], 'microtendencia', geoMapData)
        },
        error: (err) => {
            console.log(err)
        }
    })
}
function buscaEstado(query) {
    let estados = dados.estados
    return estados.filter((v) => {
        return v.siglaGoogle == query;
    })
}
function gerarArrayMapa(medicamento, tendencia, geoMap) {
    const { palavrasChave } = medicamento[tendencia];
    const { estados } = dados
    const { geoMapData } = geoMap
    arrayMapa = []
    obj = {}
    for (let i = 0; i < palavrasChave.length; i++) {
        obj.type = 'densitymapbox'
        obj.lat = [];
        obj.lon = [];
        obj.z = []
        obj.radius = 60
        for (let j = 0; j < geoMapData.length; j++) {
            let { lat, lon } = buscaEstado(geoMapData[j].geoCode)[0]
            obj.lat.push(lat);
            obj.lon.push(lon);
            obj.z.push(geoMapData[j].value[i])
        }
        arrayMapa.push(obj);
        obj = {}
    }
    geraMapa(palavrasChave);
}

function geraMapa(palavrasChave) {
    Plotly.setPlotConfig({
        mapboxAccessToken: 'pk.eyJ1IjoibHVpendlYmVyIiwiYSI6ImNrMXNvbmVuZjBpODgzYmsxYXZzMmdjMTIifQ.ZmNaQfVpIAMguwthx34swA'
    })

    var layout = {
        width: 600,
        height: 400,
        mapbox: {
            style: 'stamen-terrain',
            center: { lat: -13, lon: -51 },
            zoom: 2.5
        }
    };
    $('#mapa').html('');
    for (let i = 0; i < arrayMapa.length; i++) {
        layout.title = null;
        div = document.createElement('div')
        div.setAttribute('id', 'mapa' + i)
        div.setAttribute('style', 'float: left;')
        document.getElementById('mapa').appendChild(div);
        obj = []
        obj.push(arrayMapa[i]);
        layout.title = { text: palavrasChave[i] }
        Plotly.newPlot('mapa' + i, obj, layout);
    }
}