// creates [1,2,3,4] by example (arrayrange(1,4,1))
arrayRange=(a,b,c) => Array.from({length:(b-a)/c+1},(d,e)=>a+e*c)  
zfill = (str,n)=>str.length < n ? str+("0".repeat(str.length-n)) : str

function darkener(colorHex){
	let res = "#"
	let tmp = colorHex.substr(1) // remove '#'
    for (let i=0;i<3;i++)
    	res += Math.round(parseInt("0x"+tmp.substr(i*2,2))*0.9).toString(16)
    return res
}

function getColorParts(partsNb){
    let parts = 0xffffff/partsNb
    let res = []
    for (let i = 1; i < partsNb+1; i++) {
        if(parts*i > 0x00ffff)
            elem = ((((parts*i))%0x00ffff)*0x100).toString(16)
        else
            elem = parts*i
        res.push("#"+zfill(elem,6))
    }
    return res
}

/**
 * gestion des données par fréquence (QTD)
 */
class LotoAnalyser{

    #crudeData = [] // matrix (arrays)
    #data = []
    #items = 0


    constructor (jsonData,title,color) {
        this.addData(jsonData,title,color)    
    }


    /**
     * autorise la supperposition avec une couleur différente
     * @param {*} data données a jouter
     * @param {*} title titre des données
     */
    addData(data,title,color){
        // initialisation des frequences
        let tpmFreq = []
        for (let i = 1; i < 50; i++) 
            tpmFreq.push(0)
        this.#crudeData.push(data)
        // on transforme l'entête (str) en tableau
        this.#crudeData[this.#items][0][0] = ((this.#crudeData[this.#items][0][0])+"").split(";")
        this.#crudeData[this.#items].pop() // dernière ligne inutile
        const darkColor = parseInt()
        this.#data.push(
            [
                {
                    titre: title,
                    freq: tpmFreq,
                    freqchance: [0,0,0,0,0,0,0,0,0,0],
                    nbtirages: this.#crudeData[this.#items][0].length,
                    color: color
                },
                {
                    titre: title+"(n°chance)",
                    freq: [0,0,0,0,0,0,0,0,0,0]
                }              
            ]

        )  
        this.#items++   
    }

    /**
     * renvoie une liste de fréquences pour les 49 chiffres
     * calcule les frequences pour toutes les données brutes d'entrée
     */
    get #frequency(){
        const entete = this.#crudeData[0][0][0]
        for (let nbData=0;nbData<this.#items;nbData++ ){
            // si entête correcte
            //(this.#crudeData[0][2][0]+"").split(";")[5]
            if(entete[4] == "boule_1" && entete[9] == "numero_chance"){
                for (let i = 0; i < this.#data[nbData].nbtirages ; i++) {
                    for (let j = 5; j < 12;j++) {
                        (this.#crudeData[0][1][0]+"").split(";")
                        this.#crudeData[nbData][0][1][0]
                    }
                }                   
            } else {
                throw new Error("entête de fichier incorrect: "+ entete)
            }
         
        }
    }

    /**
     * renvoie une configuration pour un rendu Chart.js
     */
    get renderConf(){
        const titlePatternStart = "freq de "
        let loterylabels = arrayRange(1,49,1)
        for (let i = 0; i < numlabels.length; i++) {
            numlabels[i] = titlePatternStart+numlabels[i]
        }        
        let tmpDataset = []
        for (i = 0; i < array.length; i++) {
            tmpDataset.push({
                label: "nb normaux",
            })
            
        }
        let datasets = []
        // remplire le dataset avec les frequenceetc.. faire 2 dataset 
        // pour chaque crudeData (1 freq normal et un freq chances)
        return {
            type: 'line',
            data: {
                labels: loterylabels,
                datasets: [{
                        label: '1er dataset',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                        borderColor: "#cb41b9",
                        backgroundColor: "grey"                
                    },
                    {   label: '2e dataset',
                        data: [10, 23, 32, 43, 1, 4, 6],
                        fill: "auto",
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1,
                        borderColor: "#414acb",
                        backgroundColor: "grey"
                    }
                ]
            }
        }
    }

    /**
     * 
     * @param {*} index numero d'index du dataset pour lequel changer les couleurs
     * @param {*} color couleur hexa ou acronyme a changer
     */
    setColor(index, color){
        
    }


    debugg(){
        console.log(
            (this.#crudeData[0][2][0]+"").split(";")[9]
            
        )
    }
}