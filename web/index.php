<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>analyse Loto</title>
    <!-- our tooling -->
    <script src="../script/LotoAnalyser.class.js">
    </script>    
    <!-- css rules -->
    <link type="text/css" rel="stylesheet" href="style.css">    
    <!-- external module(s) importing -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>

<body>
    <header>
        <h1>analyse de loto</h1>
    </header>    
    <main>
        <section id="graph">
            <h3>frequences des nombres tirés :</h3>
            <canvas id="vizualgraph">
            </canvas>
        </section>    
        <section id="sLoto">
            <h3>debugg zone</h3>
            <div id="debug">
                <!-- eaziest way to convert csv to json  -->

            </div>
        </section>        
    </main>
</body>

<script type="text/javascript"> 
    let crudeData = JSON.parse(<?php 
            $csvFileContent= file_get_contents('../donnees/grand_loto/1 grandnoel_dec2017-dec2018.csv');
            $csvLineArray = explode("\n", $csvFileContent);
            $result = array_map("str_getcsv", $csvLineArray);
            echo "'".json_encode($result)."'";
        ?>        
    );
    // traitement des données
    let analyse = new LotoAnalyser(
        crudeData,
        "grand noel dec2017-dec2018",
        "#3333ff"
    );
    crudeData = JSON.parse(<?php 
            $csvFileContent= file_get_contents('../donnees/grand_loto/2 grand_dec2019-dec2023.csv');
            $csvLineArray = explode("\n", $csvFileContent);
            $result = array_map("str_getcsv", $csvLineArray);
            echo "'".json_encode($result)."'";
        ?>        
    );
    analyse.addData(
        crudeData,
        "grand dec2019-dec2023",
        "#33ff33"
    )
    console.log(crudeData)    
    analyse.debugg()
    const ctx = document.getElementById("vizualgraph")
    ////////////////////////////////////////////////////
    const labels = [1,2,3,4,5,6,7]
    const data = {
        labels: labels,
        datasets: [{
                label: '1er dataset',
                data: [65, 59, 80, 81, 56, 55, null],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                borderColor: "#cb41b9",
                backgroundColor: "grey"                
            },
            {   label: '2e dataset',
                data: [10, 23, 32, 43, 1, 4, 6],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                borderColor: "#414acb",
                backgroundColor: "grey"
            }
        ]
    };
    const config = {
        type: 'line',
        data: data
    };
    ////////////////////////////////////////////////////
    const chart = new Chart(ctx, config)

</script>    
</html>