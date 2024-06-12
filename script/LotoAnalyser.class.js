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
        for (; i < 60; i++){ 
            tpmFreq.push(null)
            tmpFreqC.push(0) 
        }        
        this.#crudeData.push(data)
        // on transforme l'entête (str) en tableau (lisiblité)
        this.#crudeData[this.#items][0][0] = ((this.#crudeData[this.#items][0][0])+"").split(";")
        this.#crudeData[this.#items].pop() // dernière ligne inutile
        this.#data.push(
            {
                // 1,2,3,etc...49,null,null,etc (10x)
                normal: {
                    titre: title,
                    freq: tpmFreq,
                    color: color
                },
                // nul,null,null,etc...,1,2,3,4,etc...10
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
    #frequency(){
        for (let nbData=0;nbData<this.#items;nbData++ ){ // blocs de données
            const headtop = this.#crudeData[nbData][0][0] // "header" interdit comme nom de variable
            if(headtop[4] === "boule_1" && headtop[9] === "numero_chance"){ 
                let a = (this.#crudeData[1]+"").split(";")
                console.log(`nb tirage : `+a)
                for (let day = 1; day < this.#data[nbData].nbtirages ; day++) {
                    console.log("hey !!!")
                    for (var num = 4; num < 8;num++) {
                        
                        if(this.#sort) // freq mode
                            this.#data[nbData].normal.freq[parseInt((this.#crudeData[nbData][day][0]+"").split(";"))[num]]++
                    }
                    if(this.#sort)
                        this.#data[nbData].chance.freq[parseInt((this.#crudeData[nbData][day][0]+"").split(";"))[num]+49]++
                    
                    console.log(`nbdata = ${nbData}, day= ${day}, num=${num}, crudebloc=${parseInt((this.#crudeData[nbData][day][0]+'').split(";"))+49}`)
                }                   
            } else {
                throw new Error("entête de fichier incorrect: "+ headtop)
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
    get config(){
        this.#frequency()
        let datasFinal = []   
        let loterylabels = []     
        for (var i = 1; i < 60; i++) {
            let elem = "freq"
            if(i>49)
                elem+=" chance de "+(i-49)
            else
                elem+=" de "+i
            loterylabels.push(elem)
        }
        for (i = 0; i < this.#data.length; i++) {
            datasFinal.push(
                {
                    label: this.#data[i].normal.titre,
                    data: this.#data[i].normal.freq,
                    fill: false,
                    borderColor: this.#data[i].normal.color,
                    tension: 0.1,
                    backgroundColor: "#bfbfbf"
                },
                {
                    label: this.#data[i].chance.titre,
                    data: this.#data[i].chance.freq,
                    fill: false,
                    borderColor: this.#data[i].chance.color,
                    tension: 0.1,
                    backgroundColor: "#bfbfbf"                    
                }
            )
        }
        return {
            type: 'line',
            data: {
                labels: loterylabels,
                datasets: datasFinal
            }
        }
    }

    /**
     * 
     * @param {*} index numero d'index du dataset pour lequel changer les couleurs
     * @param {*} color couleur hexa ou acronyme a changer
     */
    setColor(index, color){
        this.#data[index]=color
    }

    debug(){
        console.log(this.#crudeData)
    }

}