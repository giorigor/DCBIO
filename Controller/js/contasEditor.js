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


var inputBtn = document.getElementById('inputSubmit');
inputBtn.addEventListener('click', function () {
    var inputCodigo = document.getElementById('inputCodigo');
    var inputMes = document.getElementById('inputMes');
    var inputConsumo = document.getElementById('inputConsumo');
    var inputTipo = document.getElementById('inputTipo');
    var inputCampus = document.getElementById('inputCampus');
    var inputPredio = document.getElementById('inputPredio');

    let codi = String(inputCodigo.value);
    let mes = Number(Date.parse(String(inputMes.value)));
    let cons = Number(inputConsumo.value);
    let tip = String(inputTipo.value);
    let campu = inputCampus.value;
    let predi = inputPredio.value;

    console.log(codi, mes, cons, tip, campu, predi);

    if (codi && mes && cons && tip && campu && predi){

        db.collection('campi').doc(campu).collection('predios').doc(predi).collection('contas').where("codigo", "==", codi).get().then(
            colContas => {
                console.log(true,colContas,colContas[0]);
                if (colContas.firstChild){
                    db.collection('campi').doc(campu).collection('predios').doc(predi).collection('contas').doc(colContas[0].id).update(
                        {
                            codigo: codi,
                            mesRef: mes,
                            consumo: cons,
                            tipo: tip
                        }
                    ).then(
                        docConta => {
                            alert('Conta' + codi + ' editada com sucesso!');
                            window.location.reload(false);
                        }
                    ).catch(
                        error => {
                            alert(error);
                        }
                    );
                }
                else{
                    db.collection('campi').doc(campu).collection('predios').doc(predi).collection('contas').add(
                        {
                            codigo: codi,
                            mesRef: mes,
                            consumo: cons,
                            tipo: tip
                        }
                    ).then(
                        docCampi => {
                            alert('Conta ' + codi + ' adicionada com sucesso!');
                            window.location.reload(false);
                        }
                    ).catch(
                        error => {
                            alert(error);
                        }
                    );
                }
            }
        );
        
    }else{
        alert("Por favor, preencha todos os campos!");
    }

    
});

function deletar(idCampus, idPredio, idConta){
    if (confirm('Tem certeza de que deseja excluir a conta selecionada?')){
        db.collection('campi').doc(idCampus).collection('predios').doc(idPredio).collection('contas').doc(idConta).delete().then( function() {
            alert('Conta excluída com sucesso!');
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

    db.collection('campi').doc(idCampus).collection('predios').doc(idPredio).collection('contas').orderBy('mesRef').get().then(
        colContas => {
            colContas.forEach(
                docConta => {
                    
                    var stringDesc;
                    var classeCor;

                    switch (docConta.data().tipo){
                        case 'Elétrica':
                            stringDesc = "KWH";
                            classeCor = "text-warning";
                        break;
                        case 'Hídrica':
                            stringDesc = "L";
                            classeCor = "text-primary";
                        break;
                        default:
                        break;
                    }


                    // Cria a linha na tabela
                    var tableRow = document.createElement('tr');                          
        
                    
                    // <th>Campus</th>
                    // <th>Predio</th>
                    // <th>Código</th>
                    // <th>Mês Referência</th>
                    // <th>Data Criação</th>
                    // <th>Tipo</th>
                    // <th>Ações</th>

                    // Cria a 1ª célula (codigo da conta)
                    var celulaCodigo = document.createElement('td');
                    celulaCodigo.appendChild(document.createTextNode(docConta.data().codigo));                
                    tableRow.appendChild(celulaCodigo);
                    
                    // Cria a 2ª célula (consumo)
                    var celulaPredio = document.createElement('td');
                    celulaPredio.appendChild(document.createTextNode(docConta.data().consumo + " " + stringDesc));                        
                    celulaPredio.setAttribute('class',classeCor);

                    tableRow.appendChild(celulaPredio);                                

                    // tableRow.appendChild(celulaCampus);
                    
                    // Cria a 4ª célula (mes de referência)
                    var celulaMesRef = document.createElement('td');
                    celulaMesRef.appendChild(document.createTextNode(new Date(docConta.data().mesRef + 100000000).getMonth() + "/" +
                                                                    new Date(docConta.data().mesRef + 100000000).getFullYear() ));
                    celulaMesRef.setAttribute('class',classeCor);

                    tableRow.appendChild(celulaMesRef);

                    // Cria a 5ª célula (data da inserção da conta)
                    var celulaTime = document.createElement('td');
                    celulaTime.appendChild(document.createTextNode(new Date(new Date().getTime() - docConta.et.version.timestamp.nanos).toDateString()));
                    celulaTime.setAttribute('class',classeCor);

                    tableRow.appendChild(celulaTime);
                    
                    // Cria a 6ª célula (tipo da conta)
                    var celulaTipoConta = document.createElement('td');
                    celulaTipoConta.appendChild(document.createTextNode(docConta.data().tipo));
                    celulaTipoConta.setAttribute('class',classeCor);

                    tableRow.appendChild(celulaTipoConta);

                    // Cria a 7ª célula (ações para aquele campus)
                    var celulaAcoes = document.createElement('td');

                    var botao1 = document.createElement('div');
                    botao1.appendChild(document.createElement('a').appendChild(document.createTextNode("Excluir")));
                    botao1.setAttribute('onClick','deletar(\'' + idCampus + '\',\'' + idPredio + '\',\'' + docConta.id + '\')');
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