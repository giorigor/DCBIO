const config = {
    apiKey: "AIzaSyCWRZhM2RJQP03-fHs5kX1fcCWnOYwGpA0",
    authDomain: "dcbio-tis-4-1504461364829.firebaseapp.com",
    databaseURL: "https://dcbio-tis-4-1504461364829.firebaseio.com",
    projectId: "dcbio-tis-4-1504461364829",
    storageBucket: "dcbio-tis-4-1504461364829.appspot.com",
    messagingSenderId: "531061400550"
};
firebase.initializeApp(config);

const db = firebase.firestore();


    console.log('oi');

    let tableBody = document.getElementById('bodyTable');

    db.collection('campi').orderBy('nome').get().then(
      snap => {
          snap.forEach(
              docCampi => {
                  // Cria a linha na tabela
                  var tableRow = document.createElement('tr');

                  // Cria a 0º célula (id do campus)
                  var celulaId = document.createElement('td');
                  celulaId.appendChild(document.createTextNode(docCampi.id));

                  tableRow.appendChild(celulaId);

                  // Cria a 1ª célula (nome do campus)
                  var celulaNome = document.createElement('td');
                  celulaNome.appendChild(document.createElement('a').appendChild(document.createTextNode(docCampi.data().nome)));
                  celulaNome.setAttribute('class','text-primary');

                  tableRow.appendChild(celulaNome);

                  // Cria a 2ª célula (coordenadas do campus)
                  var celulaCoord = document.createElement('td');
                  celulaCoord.appendChild(document.createTextNode('Latitude = ' + docCampi.data().coord.lat));
                  celulaCoord.appendChild(document.createElement('br'));
                  celulaCoord.appendChild(document.createTextNode('Longitude = ' + docCampi.data().coord.lng));

                  tableRow.appendChild(celulaCoord);

                  // Cria a 3ª célula (data da inserção do campus)
                  var celulaTime = document.createElement('td');
                  celulaTime.appendChild(document.createTextNode(new Date(new Date().getTime() - docCampi.et.version.timestamp.nanos).toDateString('dd MMM yyyy')));

                  tableRow.appendChild(celulaTime);

                  // Cria a 4ª célula (ações para aquele campus)
                  var celulaAcoes = document.createElement('td');

                  var botao1 = document.createElement('div');
                  botao1.appendChild(document.createElement('a').appendChild(document.createTextNode("Excluir")));
                  botao1.setAttribute('onClick','deletar(\'' + docCampi.id + '\')');
                  botao1.setAttribute('class','text-danger');

                  // var botao2 = document.createElement('a');
                  // var icon2 = document.createElement('i').setAttribute('class','icon-close');
                  // botao2.appendChild(icon1);
                  // botao2.setAttribute('onClick','deletar(\'' + docCampi.id + '\')');

                  celulaAcoes.appendChild(botao1);
                  // celulaAcoes.appendChild(botao2);

                  tableRow.appendChild(celulaAcoes);

                  // <a href="tables.html"> <i class="icon-home"></i>Campi </a>

                  tableBody.appendChild(tableRow);
              }
          )
      }
    );

var inputBtn = document.getElementById('inputSubmit');
inputBtn.addEventListener('click', function () {
    var inputNome = document.getElementById('inputNome');
    var inputLat = document.getElementById('inputLatitude');
    var inputLng = document.getElementById('inputLongitude');

    let name = String(inputNome.value);
    let lati = Number(String(inputLat.value).replace(',','.'));
    let long = Number(String(inputLng.value).replace(',','.'));

    console.log(name + lati + long);

    db.collection('campi').add(
        {
            nome: name,
            coord: {
                lat: lati,
                lng: long
            },
            zoom: 17
        }
    ).then(
        docCampi => {
            alert('Campus ' + name + ' adicionado com sucesso no ID ' + docCampi.id + '.');
            window.location.reload(false);
        }
    ).catch(
        error => {
            alert(error);
        }
    );
});

function deletar(id){
    if (confirm('Tem certeza de que deseja excluir o campus de ID ' + id + '?')){
        db.collection('campi').doc(id).delete().then( function() {
            alert('Campus excluído com sucesso!');
            window.location.reload(false);
        }).catch( error => {
            alert(error);
            });
    }
}