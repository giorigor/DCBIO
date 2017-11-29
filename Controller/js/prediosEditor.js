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
                var inputDosCampi = document.getElementById('inputCheckbox');
            
                var optionVazia = document.createElement('option');
                optionVazia.appendChild(document.createTextNode(" "));
                optionVazia.selected = true;
                optionVazia.hidden = true;
                optionVazia.disabled = true;
                inputDosCampi.appendChild(optionVazia);

                // <div class="form-check form-check-inline">
                // <label class="form-check-label">
                // <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1"> 1
                // </label>
                // </div>

                var inputOpcao = document.createElement('option');
                inputOpcao.appendChild(document.createTextNode(docCampi.data().nome));
                inputOpcao.setAttribute('value',docCampi.id);
                inputDosCampi.appendChild(inputOpcao);
            }
        )
    }
);

var inputBtn = document.getElementById('inputSubmit');
inputBtn.addEventListener('click', function () {
    console.log('salvando');
    var inputNome = document.getElementById('inputNome');
    var inputLbl = document.getElementById('inputRotulo');
    var inputLat = document.getElementById('inputLatitude');
    var inputLng = document.getElementById('inputLongitude');
    var inputCamp = document.getElementById('inputCheckbox');

    let name = String(inputNome.value);
    let labe = String(inputLbl.value);
    let lati = Number(String(inputLat.value).replace(',','.'));
    let long = Number(String(inputLng.value).replace(',','.'));
    let campu = String(inputCamp.value);

    db.collection('campi').doc(campu).collection('predios').add(
        {
            nome: name,
            coord: {
                lat: lati,
                lng: long
            },
            rotulo: labe
        }
    ).then(
        docCampi => {
            alert('Prédio ' + name + ' adicionado com sucesso no ID ' + docCampi.id + '.');
            window.location.reload(false);
        }
    ).catch(
        error => {
            alert(error);
        }
    );
});

function deletar(idCampus, idPredio){
    if (confirm('Tem certeza de que deseja excluir o prédio de ID ' + idPredio + '?')){
        db.collection('campi').doc(idCampus).collection('predios').doc(idPredio).delete().then( function() {
            alert('Prédio excluído com sucesso!');
            window.location.reload(false);
        }).catch( error => {
            alert(error);
            });
    }
}

function trocaCampi(idCampus){
    var tableBody = document.getElementById('bodyTable'); 

    while (tableBody.firstChild){
        tableBody.removeChild(tableBody.firstChild);
    }
    
    db.collection('campi').doc(idCampus).get().then(
        docCampi => {
            db.collection('campi').doc(docCampi.id).collection('predios').orderBy('nome').get().then(
                snap2 => {
                    snap2.forEach(
                        docPredio => {
        
                            // Cria a linha na tabela
                            var tableRow = document.createElement('tr');
        
                            // // Cria a 0º célula (id do predio)
                            // var celulaId = document.createElement('td');
                            // celulaId.appendChild(document.createTextNode(docPredio.id));
                            // 
                            // tableRow.appendChild(celulaId);
        
                            // Cria a 1ª célula (nome do campus do predio)
                            var celulaCampus = document.createElement('td');
                            celulaCampus.appendChild(document.createTextNode(docCampi.data().nome));
        
                            tableRow.appendChild(celulaCampus);
        
                            // Cria a 2ª célula (nome do prédio)
                            var celulaNome = document.createElement('td');
                            celulaNome.appendChild(document.createElement('a').appendChild(document.createTextNode(docPredio.data().nome)));
                            celulaNome.setAttribute('class','text-primary');
        
                            tableRow.appendChild(celulaNome);
        
                            // Cria a 3ª célula (coordenadas do campus)
                            var celulaCoord = document.createElement('td');
                            celulaCoord.appendChild(document.createTextNode('Latitude = ' + docPredio.data().coord.lat));
                            celulaCoord.appendChild(document.createElement('br'));
                            celulaCoord.appendChild(document.createTextNode('Longitude = ' + docPredio.data().coord.lng));
        
                            tableRow.appendChild(celulaCoord);
        
                            // Cria a 4ª célula (data da inserção do campus)
                            var celulaTime = document.createElement('td');
                            celulaTime.appendChild(document.createTextNode(new Date(new Date().getTime() - docPredio.et.version.timestamp.nanos).toDateString()));
        
                            tableRow.appendChild(celulaTime);
        
                            // Cria a 5ª célula (ações para aquele campus)
                            var celulaAcoes = document.createElement('td');
        
                            var botao1 = document.createElement('div');
                            botao1.appendChild(document.createElement('a').appendChild(document.createTextNode("Excluir")));
                            botao1.setAttribute('onClick','deletar(\'' + docCampi.id + '\',\'' + docPredio.id + '\')');
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
        }
    );



};