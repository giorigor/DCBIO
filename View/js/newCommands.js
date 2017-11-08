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
          console.log(snap);

          let listaBotoesCampus = document.getElementById('insiraCampusAqui');

          snap.forEach(
              docCampi => {
                  console.log(docCampi);
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
                    zoom: 20,
                    mapTypeId: "satellite"
                });
                map.setTilt(0);

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
            '<p class="text-warning">Último consumo energético: ' + 10 + ' KWH</p>'+
            '<p class="text-primary">Último consumo hídrico: ' + 20 + ' KL</p>'+
            '<button type="button" id="button" class="btn btn-light" onClick="invocaModalSobrePredio(\'' +
            docCampus.id +
            '\',\'' +
            docPredio.id +
            '\')">Mais Informações</button>' +
            '</div>'+
            '</div>');
    }

    function invocaModalSobrePredio(idCampus, idPredio) {

        // Encontra novamente no banco os dados daquele prédio
        db.collection('campi').doc(idCampus).collection('predios').doc(idPredio).get().then(
            function (docPredio) {

                var titulo = document.getElementById('tituloSobrePredio');
                titulo.innerText = docPredio.data().nome;

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

                btnReportaProblema = document.getElementById('buttonReportar');
                btnReportaProblema.removeEventListener('click', invocaModalReportarProblema(idCampus, idPredio) );
                btnReportaProblema.addEventListener('click', invocaModalReportarProblema(idCampus, idPredio))

                // Edita o botão de reportar, passando o predio atual como parâmetro
                let botaoReportar = document.getElementById('buttonReportar');
                botaoReportar.setAttribute('onClick','invocaModalReportarProblema(\'' +
                        idCampus + '\',\'' + idPredio
                    + '\')');


                // Grafico para recursos hidricos
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

                // Grafico para recursos energeticos
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

                // Após tudo estar pronto, faz o modal aparecer
                $('#modalSobrePredio').modal('show');


            }
        );

    }

    function invocaModalReportarProblema(idCampus, idPredio) {

        db.collection('campi').get().orderBy('nome').then(
            snap => {
                // Pega o Select e remove os filhos dele
                let reclamacaoSelectCampi = document.getElementById('reclamacaoSelectCampi');
                while (reclamacaoSelectCampi.firstChild) {
                    reclamacaoSelectCampi.removeChild(reclamacaoSelectCampi.firstChild);
                }

                snap.forEach(
                    doc => {
                        // Adiciona as opções do Select
                        let optionSelect = document.createElement('option');
                        optionSelect.appendChild(document.createTextNode(
                            doc.data().nome
                        ));
                        optionSelect.setAttribute('value',doc.id);
                        reclamacaoSelectCampi.appendChild(optionSelect);
                    }
                )
            }
        );

        if (idCampus!=null && idPredio!=null){

        } else{

        }



        // Após tudo emstar pronto, faz o modal 'Sobre' esconder e o 'Reportar' aparecer
        $('#modalSobrePredio').modal('hide');
        $('#ModalReportarProblema').modal('show');
    }