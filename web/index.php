<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>analyse Loto</title>
    <!-- our tooling -->
    <script src="../scripts/js/maths+/basics.js"></script>  
    <script src="../scripts/js/LotoAnalyser.class.js"></script>    
    <script src="../scripts/js/LotoAnalyserDOM.class.js"></script>    
    <!-- css rules -->
    <link type="text/css" rel="stylesheet" href="style.css">    
    <!-- external module(s) importing -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- <script src="https://cdn.tailwindcss.com"></script> -->
    <!-- <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp,container-queries"></script> -->

    <?php
    // importation des outils supplémentaires
    include_once "../scripts/php/fileManager/fileManager.php";
    ?>
</head>

<body>
    <header>
        <h1>analyse du loto et de l'Euromillion</h1>
    </header>    
    <main>
        <section id="graph" class="box-content">
            <h1 class="underlinedB">analyse du loto</h1>
            <p>par :
                <span class="box-content sesp">
                    <select name="lotoChange" title=" choix filtrage" class="lsclear"
                    id="typSortLoto">
                    </select>
                </span>                
            </p>
            <br>
            <canvas id="lotoGraph">
            </canvas>
            <br>
            <h1 class="underlinedB">analyse de l'Euromillion</h1>
            <p>par :
                <span class="change box-content sesp">
                    <select name="lotoChange" title="lsclear choix filtrage" class="lsclear"
                    id="typSortEuromi">
                    </select>
                </span>
            </p>
            <br>
            <canvas id="EroMilGraph">
            </canvas>    
            <span></span>
        </section>       
    </main>
</body>
<footer>
    fait par Félix TTL 6/2024
</footer>
<script type="text/javascript"> 
    const ctxLoto = document.getElementById("lotoGraph")
    const ctxEromio = document.getElementById("EroMilGraph")
    const typesSort = [
        {
            name: "type de trie",
            txtDisplay: "fréquence des numéros"
        },
        {
            name: "type de trie", 
            txtDisplay: "fréquence des combinaisons journalières"                       
        }          
    ]
    let lotoDOM = new LotoAnalyserDOM("typSortLoto",typesSort)
    lotoDOM.putOptions()
    lotoDOM.fixRefresh()
    let EuroMioDOM = new LotoAnalyserDOM("typSortEuromi",typesSort)
    EuroMioDOM.putOptions() 
    EuroMioDOM.fixRefresh() 
    
    // traitement des données    
    let crudeData = JSON.parse(<?php 
            // attention ! toutes les données se retrouyveront dans le script js et le code de la page html (les erreurs aussi !)
            // simplifie la méthode pour passer du csv vers le json (trés pénible/impossible en js)
            echo csv2Json('../donnees/grand_loto/1 grandnoel_dec2017-dec2018.csv');
        ?>        
    );
    let analyseLoto = new LotoAnalyser(
        crudeData,
        "grand dec2017-dec2018",
        "#5555ff"
    );
    crudeData = JSON.parse(<?php 
            echo csv2Json('../donnees/grand_loto/2 grand_dec2019-dec2023.csv');
        ?>        
    )
    analyseLoto.addData(
        crudeData,
        "grand dec2019-dec2023",
        "#7777ff"
    )
    analyseLoto.debug()


    // analyse pour l'euromillion
    // crudeData = JSON.parse(
    //     "something here (data)............",
    //     "something here (title)............",
    //     "something here (color)............"
    // )

    // let analyseEuromio = new LotoAnalyser(

    // )



    ////////////////////////////////////////////////////
    // const labels = [1,2,3,4,5,6,7]
    // const data = {
    //     labels: labels,
    //     datasets: [{
    //             label: 'normal',
    //             data: [65, 45, 35, 34, null, 4],
    //             fill: false,
    //             borderColor: 'rgb(75, 192, 192)',
    //             tension: 0.1,
    //             borderColor: "#cb41b9",
    //             backgroundColor: "grey"                
    //         },
    //         {   label: 'chance',
    //             data: [null, null, null,89, 32],
    //             fill: false,
    //             borderColor: 'rgb(75, 192, 192)',
    //             tension: 0.1,
    //             borderColor: "#414acb",
    //             backgroundColor: "grey"
    //         }
    //     ]
    // };
    // const config = {
    //     type: 'line',
    //     data: data
    // };
    ////////////////////////////////////////////////////
    const lotoChart = new Chart(ctxLoto, analyseLoto.config)
    //const euroMioChart = new Chart(ctxEromio, analyseEuroMio.config)

</script>    
</html>
