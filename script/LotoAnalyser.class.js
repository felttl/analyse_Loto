// creates [1,2,3,4] by example (arrayrange(1,4,1))
arrayRange=(a,b,c) => Array.from({length:(b-a)/c+1},(d,e)=>a+e*c)  
zfill = (str,n)=> typeof(str) === "string" ? str.length < n ? str+("0".repeat(n-str.length)) : str : new Error(`(${str}) is not string`)

function darkener(colorHex){
	let res = "#"
	const tmp = colorHex.substr(1) // remove '#'
    for (let i=0;i<3;i++)
    	res += zfill(Math.round(parseInt("0x"+tmp.substr(i*2,2))*0.9).toString(16),2)
    return res
}

function getColorParts(partsNb){
    let res = []    
    if(partsNb > 0){
        let parts = 0xffffff/partsNb
        for (let i = 1; i < partsNb+1; i++) {
            if(parts*i > 0x00ffff)
                elem = ((((parts*i))%0x00ffff)*0x100).toString(16)
            else
                elem = parts*i
            res.push("#"+zfill(elem,6))
        }        
    } else {
        throw new Error(`number must be unsigned (x>0): input is ${partsNb}`)
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
    #sort = true // true by frequency else by order of draw

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
        let tmpFreqC = []
        for (var i = 1; i < 50; i++){
            tpmFreq.push(0)
            tmpFreqC.push(null)
        }
        // remplissage du vide pour la supperposition
        for (var i = 1; i < 11; i++){ 
            tpmFreq.push(null)
            tmpFreqC.push(0) 
        }        
        this.#crudeData.push(data)
        // on transforme l'entête (str) en tableau (lisiblité)
        this.#crudeData[this.#items][0][0] = ((this.#crudeData[this.#items][0][0])+"").split(";")
        this.#crudeData[this.#items].pop() // dernière ligne inutile
        this.#data.push(
            {
                normal: {
                    titre: title,
                    freq: tpmFreq,
                    color: color
                },
                chance: {
                    titre: title+"(n°chance)",
                    freq: tmpFreqC,
                    color: darkener(color)
                },
                nbtirages: this.#crudeData[this.#items][0].length
            }
        )
        this.#items++   
    }

    /**
     * calcule toutes les fréquences d'apparition des numéros de 1 a 49 (inclus)
     * des 6 numéros tirés a chaque jours (par jeux de données)
     * en plus du numéro chance valant entre 1 et 9 (inclus)
     */
    get #frequency(){
        for (let nbData=0;nbData<this.#items;nbData++ ){ // blocs de données
            let entete = this.#crudeData[this.#items][0][0]
            // si entête correcte
            if(entete[4] === "boule_1" && entete[9] === "numero_chance"){ 
                for (let day = 0; day < this.#data[nbData].nbtirages ; day++) {
                    for (let num = 4; num < 8;num++) {
                        if(this.#sort) // freq mode
                            this.#data[nbData].normal.freq[this.#crudeData[nbData][day][num]]++
                    }
                    if(this.#sort)
                        this.#data[nbData].chance.freq[this.#crudeData[nbData][day][num]]++
                }                   
            } else {
                throw new Error("entête de fichier incorrect: "+ entete)
            }
        }
    }

    /**
     * switch :
     *  - by order of draw
     *  - by number frequency
     */
    toggleSort(){
        this.#sort = !this.#sort
    }

    get isSortedByFreq(){
        return this.#sort
    }

    /**
     * renvoie une configuration pour un rendu Chart.js
     */
    get renderConf(){

        // datasets: [{
        //     label: 'normal',
        //     data: [65, 45, 35, 34, null, 4],
        //     fill: false,
        //     borderColor: 'rgb(75, 192, 192)',
        //     tension: 0.1,
        //     backgroundColor: "grey"                
        // },


        const titlePatternStart = "freq de "
        let loterylabels = arrayRange(1,49,1)
        for (let i = 0; i < loterylabels.length; i++) {
            loterylabels[i] = titlePatternStart+loterylabels[i]
        }        
        let dataset = []
        for (i = 0; i < this.#data.length; i++) {
            let current = this.#data[i]
            tmpDataset.push(
                {
                    label: current.normal.titre,
                    data: current.normal.freq,
                    fill: false,
                    borderColor: current.normal.color,
                    tension: 0.1,
                    backgroundColor: "#bfbfbf"
                },
                {
                    label
                }
            )
            
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
        this.#data[index]
    }


    debugg(){
        // console.log(    (this.#crudeData[1][1]+"").split(";")   )
        console.log(    this.#crudeData[1][1][0])//(this.#crudeData[1][2]+"").split(";")   )
        console.log(    this.#crudeData[1][2][0])//(this.#crudeData[1][2]+"").split(";")   )
    }
}