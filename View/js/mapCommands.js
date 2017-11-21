// Initialize Firebase
const config = {
    apiKey: "AIzaSyCWRZhM2RJQP03-fHs5kX1fcCWnOYwGpA0",
    authDomain: "dcbio-tis-4-1504461364829.firebaseapp.com",
    databaseURL: "https://dcbio-tis-4-1504461364829.firebaseio.com",
    projectId: "dcbio-tis-4-1504461364829",
    storageBucket: "dcbio-tis-4-1504461364829.appspot.com",
    messagingSenderId: "531061400550"
};
firebase.initializeApp(config);
const rootRef = firebase.database().ref();




map;
icon = 'Z';
campiSelecionado = {};
listaCampi = '';



function acessarDatabase() {
    const campiRef = rootRef.child('campi');
    campiRef.off();

    listaCampi = campiRef.once('value').then(function (snapshot) {
        campiSelecionado = snapshot.val()[1];
        initMap();
        return snapshot.val();
    });

    console.log(listaCampi)

// Declara o mapa e infowindow pra ser acessado por everybody (global)
}

function initMap() {

    /// Cria o mapa direitinho
    map = new google.maps.Map(document.getElementById('map'), {
        center: campiSelecionado.coord,
        zoom: campiSelecionado.zoom,
        gestureHandling: 'none'
    });

    /// Cria um estilo de mapa que fique marromzinho
    var styledMapType = new google.maps.StyledMapType(
        [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#ebe3cd"
                    }
                ]
            },
            {
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#523735"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#f5f1e6"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#c9b2a6"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#dcd2be"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#ae9e90"
                    }
                ]
            },
            {
                "featureType": "administrative.neighborhood",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "landscape.natural",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dfd2ae"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dfd2ae"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#93817c"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#a5b076"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#447530"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f5f1e6"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#fdfcf8"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#f8c967"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#e9bc62"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#e98d58"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#db8555"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#806b63"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dfd2ae"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#8f7d77"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#ebe3cd"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#dfd2ae"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#b9d3c2"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#92998d"
                    }
                ]
            }
        ],
        {name: 'Styled Map'});

    // Popula uma variável "coordPredios" com as informaçoes dos predios
    var predios = getBuildingData();

    // Cria a infoWindow propriamente dita
    var infoWindow = new google.maps.InfoWindow({});

    // Se fechar a infoWindow, retornar à origem
    infoWindow.addListener('closeclick', function () {
        infoWindow.close();
        map.panTo(coordCampus);
        map.setZoom(zoomCampus);
    });

    // Centraliza o mapa quando clica fora da infoWindow
    google.maps.event.addListener(map, 'click', function () {
        infoWindow.close();
        map.panTo(coordCampus);
        map.setZoom(zoomCampus);
    });


    // 'For' importante que gerencia tudo dos Markers no mapa
    for (predio in predios) {
        populateMarkers(predio, infoWindow);
    }

    // var marker1 = new google.maps.Marker({
    //     position: {lat: -19.924619, lng: -43.9932171},
    //     map: map,
    //     // icon: icon
    // });
    // var marker2 = new google.maps.Marker({
    //     position: {lat: -19.920809, lng: -43.993201},
    //     map: map,
    //     // icon: icon
    // });
    // var marker3 = new google.maps.Marker({
    //     position: {lat: -19.9220128, lng: -43.9897775},
    //     map: map,
    //     // icon: icon
    // });


    // Converte o mapa criado pro tipo estilizado marromzinho
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');

}


function populateMarkers(pos, infoWindow){
    var predio = getBuildingData()[pos];


    var contentString =
        '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h3 id="firstHeading" >' + predio.titulo + '</h3>'+
        '<div id="bodyContent">'+
        '<p class="text-warning">Último consumo energético: ' + predio.elec + ' KWH</p>'+
        '<p class="text-primary">Último consumo hídrico: ' + predio.hidro + ' KL</p>'+
        '<button type="button" id="button" class="btn btn-light" onClick="invocaModal()">Mais Informações</button>' +
        '</div>'+
        '</div>';

    var iconElec = getCircle(predio.elec, 'orange');
    var iconHidro = getCircle(predio.hidro, 'blue');

    var marker;
    if (icon=='H'){
        marker = new google.maps.Marker({
            position: predio.coord,
            map: map,
            icon: iconHidro,
            label: predio.num,
            contentString: contentString
        });
        console.log("Entrou em H");
    }
    else if (icon=='E')
    {
        marker = new google.maps.Marker({
            position: predio.coord,
            map: map,
            icon: iconElec,
            label: predio.num,
            contentString: contentString
        });
        console.log("Entrou em E");
    }
    else{
        marker = new google.maps.Marker({
            position: predio.coord,
            map: map,
            label: predio.num,
            contentString: contentString
        });
        console.log("Entrou em Z");
    }



    marker.addListener('click', function() {
        infoWindow.close();
        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);
        $("#marker_title").text(predio.titulo);
        $("#marker_hidro").text(500);
        $("#marker_elec").text(500);
        $("FormControlSelectCampus").val(2);
        $("FormControlSelectPredio").val(predio.titulo);


    });


    console.log(infoWindow);
}

function getBuildingData() {
    const prediosRef = rootRef.child('predios').orderByChild('campus').equalTo(campiSelecionado.ident);
    prediosRef.off();

    var vetPredios =  prediosRef.once('value').then(function(snapshot) {
        return snapshot.val()
    });

    return vetPredios;

    // return [
    //     {titulo: 'Prédio 15', num: '15', hidro: 250, elec: 300, coord: {lat: -19.924619, lng: -43.9932171}},
    //     {titulo: 'Biblioteca', num: 'B', hidro: 450, elec: 250, coord: {lat: -19.920809, lng: -43.993201}},
    //     {titulo: 'Museu', num: 'M', hidro: 500, elec: 350, coord: {lat: -19.9220128, lng: -43.9897775}}
    // ];
};

function toggleMarkerTypes(ch){
    icon = ch;
    initMap();
}

function getCircle(magnitude, color) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: .3,
        scale: magnitude/15,
        strokeColor: 'white',
        strokeWeight: .7
    };
}

function invocaModalReportarProblema() {

    $('#myModal').modal('hide');
    $('#ModalReportarProblema').modal('show');
}

function invocaModal () {

    $('#myModal').modal('show');

    // grafico para recursos hidricos
    var ctx = document.getElementById('canvas').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho"],
            datasets: [{
                label: "Recursos Hidricos",
                backgroundColor: 'transparent',
                borderColor: '#317abe',
                data: [200, 240, 300, 100, 200, 100, 98],
            }]
        },

        // Configuration options go here
        options: {}
    });

    // grafico para recursos energeticos
    ctx = document.getElementById('canvas2').getContext('2d');
    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho"],
            datasets: [{
                label: "Recursos Energéticos",
                backgroundColor: 'transparent',
                borderColor: '#bd2130',
                data: [200, 240, 300, 100, 200, 100, 98],
            }]
        },


    });




}