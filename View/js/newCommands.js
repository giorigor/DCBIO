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
      snap => {

          let listaBotoesCampus = document.getElementById('insiraCampusAqui');

          snap.forEach(
              docCampi => {
                  let inputOpcao = document.createElement('option');
                  inputOpcao.appendChild(document.createTextNode(docCampi.data().nome));
                  inputOpcao.setAttribute('value',docCampi.id);
                  inputOpcao.addEventListener('click', function() {
                      initMap(listaBotoesCampus.value);
                  });
                  listaBotoesCampus.appendChild(inputOpcao);
              }
          )
      }
    );

    var infoWindow;

    // Primeiro startup, começar no Coreu
    function initMapZero() {

        // Cria a infowindow, pra facilitar o abre-fecha danado
        infoWindow = new google.maps.InfoWindow({});

        initMap('qtds0mTkE16JhcEQxAch');
    }

    // Recarrega o mapa pra um campus selecionado aí
    function initMap(idCampus) {

        // Encontra o Campus selecionado pelo user
        db.collection("campi").doc(idCampus).get().then((docCampus) => {

                /// Cria o mapa direitinho, focado no campus
                map = new google.maps.Map(document.getElementById('map'), {
                    center: docCampus.data().coord,
                    // zoom: docCampus.data().zoom+2,
                    zoom: 18,
                    mapTypeId: "satellite"
                });
                map.setTilt(45);

                // Cria os marcadores dos prédios daquele campus
                db.collection('campi').doc(docCampus.id).collection('predios').get().then(
                    snap2 => {
                        snap2.forEach(
                            docPredio => {

                                // Cria o marcador em si
                                let marker = new google.maps.Marker({
                                    position: docPredio.data().coord,
                                    map: map,
                                    label: docPredio.data().rotulo,
                                    contentString: contentString(docCampus, docPredio)
                                });

                                // Faz a infowindow brotar em cima dele
                                marker.addListener('click', function() {
                                    infoWindow.close();
                                    infoWindow.setContent(marker.contentString);
                                    infoWindow.open(map, marker);
                                    // $("#marker_title").text(doc2.data().nome);
                                    // $("#marker_hidro").text(500);
                                    // $("#marker_elec").text(500);
                                    // $("FormControlSelectCampus").val(2);
                                    // $("FormControlSelectPredio").val(predio.titulo);
                                });
                            }
                        )
                    }
                );
        });


    }

    function contentString(docCampus, docPredio){

        // Retorna um código, com os valores da infowindow
        // Perceba no button que são enviados os id's como parâmetro pro método invocaModal
        return ('<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h3 id="firstHeading" >' + docPredio.data().nome + '</h3>'+
            '<div id="bodyContent">'+
            '<button type="button" id="button" class="btn btn-light" onClick="invocaModalSobrePredio(\'' +
            docCampus.id +
            '\',\'' +
            docPredio.id +
            '\')">Mais Informações</button>' +
            '</div>'+
            '</div>');
    }

    function invocaModalSobrePredio(idCampus, idPredio) {

        $('#modalSobrePredio').modal('show');

        // Encontra novamente no banco os dados daquele prédio
        db.collection('campi').doc(idCampus).collection('predios').doc(idPredio).get().then(
            function (docPredio) {

                var titulo = document.getElementById('tituloSobrePredio');
                titulo.innerText = docPredio.data().nome;
                titulo.setAttribute("value", idPredio);

                // reclamacoes.appendChild(document.createTextNode(doc.data().nome));
                let listaReclama = document.getElementById('reclamacoesSobrePredio');

                // Remove os itens da barra lateral, até não sobrar nada!
                while (listaReclama.firstChild) {
                    listaReclama.removeChild(listaReclama.firstChild);
                }

                db.collection('campi').doc(idCampus).collection('predios').doc(idPredio).collection('reclamacoes').limit(5).get().then(
                    snap => {
                        snap.forEach (
                            docReclamacao => {

                                // Cria a mensagem de reclamação
                                let itemLista = document.createElement('li');
                                itemLista.setAttribute('class', 'list-group-item');
                                itemLista.appendChild(document.createTextNode(
                                    docReclamacao.data().desc
                                ));
                                itemLista.appendChild(document.createElement('br'));
                                itemLista.appendChild(document.createTextNode(
                                    'Publicado em ' + docReclamacao.data().diamesano
                                ));

                                // Adiciona ao "feed de notícias"
                                listaReclama.appendChild(itemLista);
                            }
                        )
                    }
                );

                // POPULA O GRAFICO DE CONTAS HIDRICAS
                db.collection('campi').doc(idCampus).collection('predios').doc(idPredio).collection('contas').orderBy('mesRef').limit(12).get().then(
                    colContas => {
                        var vetorContaHid = [];
                        var vetorContaElec = [];
                        colContas.forEach(
                            docConta => {
                                switch (docConta.data().tipo){
                                    case "Elétrica":
                                        vetorContaElec.push(docConta.data().consumo);
                                    break;
                                    case "Hídrica":
                                        vetorContaHid.push(docConta.data().consumo);
                                    break;

                                }
                            }
                        );


                        // Grafico para recursos hidricos
                        ctx = document.getElementById('canvas').getContext('2d');
                        chart = new Chart(ctx, {
                            // The type of chart we want to create
                            type: 'line',

                            // The data for our dataset
                            data: {
                                datasets: [{
                                    label: "Recursos Hídricos",
                                    backgroundColor: 'transparent',
                                    borderColor: '#007fff',
                                    data: vetorContaHid
                                }]
                            }
                        });


                        // Grafico para recursos energeticos
                        ctx = document.getElementById('canvas2').getContext('2d');
                        chart = new Chart(ctx, {
                            // The type of chart we want to create
                            type: 'line',

                            // The data for our dataset
                            data: {
                                datasets: [{
                                    label: "Recursos Energéticos",
                                    backgroundColor: 'transparent',
                                    borderColor: '#ff7f00',
                                    data: vetorContaElec
                                }]
                            }
                        });
                        
                    }
                );

                // btnReportaProblema = document.getElementById('buttonReportar');
                // btnReportaProblema.removeEventListener('click', invocaModalReportarProblema(idCampus, idPredio) );
                //  btnReportaProblema.addEventListener('click', invocaModalReportarProblema(idCampus, idPredio));

                // Edita o botão de reportar, passando o predio atual como parâmetro
                let botaoReportar = document.getElementById('buttonReportar');
                let botaoReportarMapa = document.getElementById('buttonReportarMapa');
                
                botaoReportar.setAttribute('onClick','invocaModalReportarProblema(\'' + idCampus + '\')');
                botaoReportarMapa.setAttribute('onClick','invocaModalReportarProblema(\'' + idCampus + '\')');
                

                // \'' + idCampus + '\',\'' + idPredio + '\'

                

                // Após tudo estar pronto, faz o modal aparecer
               // $('#modalSobrePredio').modal('show');


            }
        );

    }

    function invocaModalReportarProblema(idCampus) {

        $('#ModalReportarProblema').modal('show');

        // Pega o Select e remove os filhos dele
        let reclamacaoSelectCampus = document.getElementById('reclamacaoSelectCampus');

        while (reclamacaoSelectCampus.firstChild) {
            reclamacaoSelectCampus.removeChild(reclamacaoSelectCampus.firstChild);
        }

        var optionVazia = document.createElement('option');
        optionVazia.appendChild(document.createTextNode(" "));
        optionVazia.selected = true;
        optionVazia.hidden = true;
        optionVazia.disabled = true;
        reclamacaoSelectCampus.appendChild(optionVazia);

        db.collection('campi').get().then(
            colCampi => {
                colCampi.forEach(
                    docCampus => {
                
                    // CRIA AS OPÇÕES PRO SELECT DE CAMPUS
    
                        var inputOpcaoCampus = document.createElement('option');
                        inputOpcaoCampus.appendChild(document.createTextNode(docCampus.data().nome));
                        inputOpcaoCampus.setAttribute('value',docCampus.id);
                        reclamacaoSelectCampus.appendChild(inputOpcaoCampus);
    
                    }
                );
            }
        );

        // reclamacaoSelectPredio.selectIndex = 1;

        trocaCampi(idCampus);


        // Após tudo emstar pronto, faz o modal 'Sobre' esconder e o 'Reportar' aparecer
        // $('#modalSobrePredio').modal('hide');
        // $('#ModalReportarProblema').modal('show');
    }

    function trocaCampi(idCampus){        
        
        let reclamacaoSelectPredio = document.getElementById('reclamacaoSelectPredio');
        while (reclamacaoSelectPredio.firstChild) {
            reclamacaoSelectPredio.removeChild(reclamacaoSelectPredio.firstChild);
        }
        var optionVazia = document.createElement('option');
        optionVazia.appendChild(document.createTextNode(" "));
        optionVazia.selected = true;
        optionVazia.hidden = true;
        optionVazia.disabled = true;
        reclamacaoSelectPredio.appendChild(optionVazia);
    
        db.collection('campi').doc(idCampus).collection('predios').orderBy('nome').get().then(
            colPredios => {
                colPredios.forEach(
                    docPredio => {
    
                    // CRIA AS OPÇÕES PRO SELECT DE PREDIO
    
                        var inputOpcaoPredio = document.createElement('option');
                        inputOpcaoPredio.appendChild(document.createTextNode(docPredio.data().nome));
                        inputOpcaoPredio.setAttribute('value',docPredio.id);
                        reclamacaoSelectPredio.appendChild(inputOpcaoPredio);
    
                    }
                )
            }
        );    
    };

    function registrarProblema(){
        let idCampus = document.getElementById('reclamacaoSelectCampus').value;
        let idPredio = document.getElementById('reclamacaoSelectPredio').value;
        let titulo = document.getElementById('FormControlInputTitulo').value;
        let descricao = document.getElementById('FormControlTextareaDesc').value;
        let nome = document.getElementById('FormControlInputNome').value;
        let email = document.getElementById('FormControlInputEmail').value;

        if (idCampus && idPredio && titulo && descricao && nome && email){
            db.collection('campi').doc(idCampus).collection('predios').doc(idPredio).collection('reclamacoes').add(
                {
                    titulo: titulo,
                    desc: descricao,
                    nome: nome,
                    email: email
                }
            ).then(
                docCampi => {
                    alert('Reclamação registrada com sucesso!');
                    window.location.reload(false);
                }
            ).catch(
                error => {
                    alert(error);
                }
            );
        } else {
            alert("Por favor, preencha todos os campos corretamente!");
        }
    }