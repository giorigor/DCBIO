var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -19.923203, lng: -43.992865},
        zoom: 17
    });
}