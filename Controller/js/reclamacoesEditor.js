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

    db.collection('campi').orderBy('nome').get().then(
        colCampus => {

            var inputDosCampi = document.getElementById('inputCampus');
            
            var optionVazia = document.createElement('option');
            optionVazia.appendChild(document.createTextNode(" "));
            optionVazia.selected = true;
            optionVazia.hidden = true;
            optionVazia.disabled = true;
            inputDosCampi.appendChild(optionVazia);

            colCampus.forEach(
                docCampus => {


                    var inputOpcaoCampus = document.createElement('option');
                    inputOpcaoCampus.appendChild(document.createTextNode(docCampus.data().nome));
                    inputOpcaoCampus.setAttribute('value',docCampus.id);
                    inputDosCampi.appendChild(inputOpcaoCampus);
                    lastCampus = docCampus.id;

              }
          );
      }
    );

function deletar(idCampus, idPredio, idReclamacao){
    if (confirm('Tem certeza de que deseja excluir a reclamação selecionada?')){
        db.collection('campi').doc(idCampus).collection('predios').doc(idPredio).collection('reclamacoes').doc(idReclamacao).delete().then( function() {
            alert('Reclamação excluída com sucesso!');
            window.location.reload(false);
        }).catch( error => {
            alert(error);
            });
    }
}

function trocaCampi(idCampus){
    var inputDosPredios = document.getElementById('inputPredio');
    var tableBody = document.getElementById('bodyTable');    

    while (inputDosPredios.firstChild){
        inputDosPredios.removeChild(inputDosPredios.firstChild);
    }
    while (tableBody.firstChild){
        tableBody.removeChild(tableBody.firstChild);
    }

    var optionVazia = document.createElement('option');
    optionVazia.appendChild(document.createTextNode(" "));
    optionVazia.selected = true;
    optionVazia.hidden = true;
    optionVazia.disabled = true;
    inputDosPredios.appendChild(optionVazia);

    db.collection('campi').doc(idCampus).collection('predios').orderBy('nome').get().then(
        colPredios => {
            colPredios.forEach(
                docPredio => {

                // CRIA AS OPÇÕES PRO SELECT DE PREDIO

                    var inputOpcaoPredio = document.createElement('option');
                    inputOpcaoPredio.appendChild(document.createTextNode(docPredio.data().nome));
                    inputOpcaoPredio.setAttribute('value',docPredio.id);
                    inputDosPredios.appendChild(inputOpcaoPredio);

                }
            )
        }
    );

};

function trocaPredio(idPredio){

    var idCampus = document.getElementById("inputCampus").value;

    var tableBody = document.getElementById('bodyTable');    
    
    while (tableBody.firstChild){
        tableBody.removeChild(tableBody.firstChild);
    }

    // CRIA AS ROWS DA TABELA

    db.collection('campi').doc(idCampus).collection('predios').doc(idPredio).collection('reclamacoes').get().then(
        colReclamacoes => {
            colReclamacoes.forEach(
                docReclamacao => {

                    // Cria a linha na tabela
                    var tableRow = document.createElement('tr');  
                    
                    // <th>Título</th>
                    // <th>Descrição</th>
                    // <th>Autor</th>
                    // <th>Data Criação</th>
                    // <th>Ações</th>

                    // Cria a 1ª célula (título da reclamação)
                    var celulaTitulo = document.createElement('td');
                    celulaTitulo.appendChild(document.createTextNode(docReclamacao.data().titulo));                
                    tableRow.appendChild(celulaTitulo);
                    
                    // Cria a 2ª célula (descricao)
                    var celulaDescricao = document.createElement('td');
                    celulaDescricao.appendChild(document.createTextNode(docReclamacao.data().desc));                        
                    celulaDescricao.setAttribute('class','text-primary');

                    tableRow.appendChild(celulaDescricao);
                    
                    // Cria a 3ª célula (autor)
                    var celulaAutor = document.createElement('td');
                    celulaAutor.appendChild(document.createTextNode(docReclamacao.data().nome));   
                    celulaAutor.appendChild(document.createElement("br"));   
                    celulaAutor.appendChild(document.createTextNode(docReclamacao.data().email));   
                    celulaAutor.setAttribute('class','text-primary');

                    tableRow.appendChild(celulaAutor);                                    

                    // Cria a 5ª célula (data da inserção da reclamacao)
                    var celulaTime = document.createElement('td');
                    celulaTime.appendChild(document.createTextNode(new Date(new Date().getTime() - docReclamacao.et.version.timestamp.nanos).toDateString()));
                    celulaTime.setAttribute('class','text-primary');

                    tableRow.appendChild(celulaTime);

                    // Cria a 7ª célula (ações para aquele campus)
                    var celulaAcoes = document.createElement('td');

                    var botao1 = document.createElement('div');
                    botao1.appendChild(document.createElement('a').appendChild(document.createTextNode("Excluir")));
                    botao1.setAttribute('onClick','deletar(\'' + idCampus + '\',\'' + idPredio + '\',\'' + docReclamacao.id + '\')');
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
            );
        }
    ).catch(
        error => {
            console.log(error);
        }
    );

}