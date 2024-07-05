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
        <section id="graph">
            <h1>analyse du loto</h1>
            
            <h3>par: <span class="change">
                    <select name="lotoChange" id="typSortLoto">
                    </select>
                </span>
            </h3>
            <canvas id="lotoGraph">
            </canvas>
            <br>
            <h1>analyse de l'Euromillion</h1>
            <h3>par fréquence des nombres tirés</h3>
            <canvas id="EruMilGraph">
            </canvas>    
            <span></span>
        </section>       
        <input type="button">  
    </main>
</body>

<script type="text/javascript"> 
    const ctx = document.getElementById("lotoGraph")
    const optsGeneration = new LotoAnalyserDOM(
        "typSortLoto",
        {
            name: "type de trie",
            txtDisplay: "sort by number frequency"
        },
        {
            name: "type de trie", 
            txtDisplay: "sort by daily combination frequency"                       
        }

    )
    optsGeneration.putOptions()
    // traitement des données    
    let crudeData = JSON.parse(<?php 
            // attention ! toutes les données se retrouyveront dans le script js et le code de la page html (les erreurs aussi !)
            // simplifie la méthode pour passer du csv vers le json (trés pénible/impossible en js)
            echo csv2Json('../donnees/grand_loto/1 grandnoel_dec2017-dec2018.csv');
        ?>        
    );
    let analyse = new LotoAnalyser(
        crudeData,
        "grand dec2017-dec2018",
        "#5555ff"
    );
    crudeData = JSON.parse(<?php 
            echo csv2Json('../donnees/grand_loto/2 grand_dec2019-dec2023.csv');
        ?>        
    )
    analyse.addData(
        crudeData,
        "grand dec2019-dec2023",
        "#7777ff"
    )
    analyse.debug()


    // tests de lecture /////////////////////

    // function readfXHR(filepath){
    //     fetch(filepath)
    //         .then(res => res.text())
    //         .then(data => {
    //             return data.text()
    //         })     
    //     return fetch   
    // }


    // console.log("yeap") 
    // fetch('../donnees/grand_loto/2 grand_dec2019-dec2023.csv')
    //     .then(r=>r.text())
    //     .then(text => {
    //         lines = text.split("\n")
    //     })
    //readf('../donnees/grand_loto/2 grand_dec2019-dec2023.csv')

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
    const chart = new Chart(ctx, analyse.config)

</script>    
</html>
