function initMap() {

    /// Cria um estilo de mapa que fique marromzinho
    var styledMapType = new google.maps.StyledMapType([
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
    ], {name: 'Styled Map'});

    /// Cria o mapa direitinho
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -19.923203, lng: -43.992865},
        zoom: 17,
        gestureHandling: 'none'
    });

    // Popula uma variável "coordPredios" com as informaçoes dos predios
    var coordPredios = function populateMarkers() {
        return [
            {titulo: 'Predio 15', num: '15', coord: {lat: -19.924619, lng: -43.9932171}},
            {titulo: 'Biblioteca', num: 'B', coord: {lat: -19.920809, lng: -43.993201}},
            {titulo: 'Museu', num: 'M', coord: {lat: -19.9220128, lng: -43.9897775}}
        ];
    };

    // Seta o icone dos markers
    var icon = './images/pin.png';

    // Cria a infoWindow
    var infoWindow = new google.maps.InfoWindow({});
    infoWindow.addListener('closeclick', function(){
        infoWindow.close();
        map.panTo({lat: -19.923203, lng: -43.992865});
    });

    // Centraliza o mapa quando clica fora da infoWindow
    google.maps.event.addListener(map, 'click', function(){
        infoWindow.close();
        map.panTo({lat: -19.923203, lng: -43.992865});
    });

    // 'For' importante que gerencia tudo dos Markers no mapa
    for( var predio in coordPredios()) {
        populateMarkers(predio);
    }

    function populateMarkers(predio){

        var contentString =
            '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h3 id="firstHeading" >' + coordPredios()[predio].titulo + '</h3>'+
            '<div id="bodyContent">'+
            '<p class="text-warning">Último consumo energético: 340 KWH</p>'+
            '<p class="text-primary">Último consumo hídrico: 200 KL</p>'+
            '<button type="button" class="btn btn-light">Mais Informações</button>' +
        '</div>'+
        '</div>';

        var marker = new google.maps.Marker({
            position: coordPredios()[predio].coord,
            map: map,
            // icon: icon,
            label: coordPredios()[predio].num,
            contentString: contentString
        });

        marker.addListener('click', function() {
            infoWindow.close();
            infoWindow.setContent(contentString)
            infoWindow.open(map, marker);
        });



        console.log(infoWindow);
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