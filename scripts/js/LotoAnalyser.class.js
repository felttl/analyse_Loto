// creates [1,2,3,4] by example (arrayrange(1,4,1))
arrayRange=(a,b,c) => Array.from({length:(b-a)/c+1},(d,e)=>a+e*c)  
zfill = (str,n)=> typeof(str) === "string" ? str.length < n ? str+("0".repeat(n-str.length)) : str : new Error(`(${str}) is not string`)

// assombri une couleur
function darkener(colorHex){
	let res = "#"
	const tmp = colorHex.substr(1) // remove '#'
    for (let i=0;i<3;i++)
    	res += zfill(Math.round(parseInt("0x"+tmp.substr(i*2,2))*0.9).toString(16),2)
    return res
}

// donne une répartition de couleur selon les 400nm de longueur d'onde visible avec n divisions/nb de couleurs
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
        // remplissage du vide pour la supperposition        
        for (var i = 1; i < 50; i++){
            tpmFreq.push(0)
            tmpFreqC.push(null)
        }
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
     * #fonctionnalité supplémentaire :
     *  - OK trier par fréquence
     *  - trier par date
     *  - trier par jours (fréquences des tirages sortis du plus élevé au moins élevés (donc de 6 numero et du numero chance sortis))
     */
    #frequency(){
        for (let nbData=0;nbData<this.#items;nbData++ ){ // blocs de données
            const headtop = this.#crudeData[nbData][0][0] // "header" interdit comme nom de variable
            if(headtop[4] === "boule_1" && headtop[9] === "numero_chance"){ 
                let a = (this.#crudeData[1]+"").split(";")
                //console.log(`nb tirage : `+a)
                for (let day = 1; day < this.#data[nbData].nbtirages ; day++) {
                    //console.log("hey !!!")
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
     * fusionne les fréquences de plusieurs set de données déja ajoutés dans un nouveau ou déja existant
     * @param {Array} allToMerge 2 elements minimum (liste d'entiers des position des données 
     * dans le calcule des fréquences effectués par la classe, exemple : [1,4] prend la donné a la position 1 et 4, 2 éléments minimum dans la liste)
     * on peut metttre plusieurs foir la même nombre pour "dupliquer" les fréquences ou les "doubler"
     * @param {int|null} toFinal merge all to existing one or if null creating a new one
     */
    merge(allToMerge, toFinal){
<<<<<<< HEAD:script/LotoAnalyser.class.js
        if(allToMerge.length < 2) 
            throw new Error(`${allToMerge} lenght < 2 !`)
        if(typeof(toFinal) !== "int" && toFinal !== "null") 
            throw new Error(`${toFinal} must be int or null !`)
        // setup
        let tpmFreq = []
        let tmpFreqC = []
        for (var i = 1; i < 50; i++){
            tpmFreq.push(0)
            tmpFreqC.push(null)
        }
        for (; i < 60; i++){ 
            tpmFreq.push(null)
            tmpFreqC.push(0) 
        }  
        // @WARNING !!!!!
        // pour le nb de tirages de l'objet suivant il faut faire la somme des nb de tirages des indexes présents
        // dans la liste prise en paramètre "allToMerge" !!!!
        let finalElem = {
            normal: {
                titre: toFinal !== null ? this.#data[toFinal].normal.title : "no title set",
                freq: tpmFreq,
                color: toFinal !== null ? this.#data[toFinal].normal.color : "#222222"
            },
            // nul,null,null,etc...,1,2,3,4,etc...10
            chance: {
                titre: toFinal !== null ? this.#data[toFinal].chance.title : "no chance title set",
                freq: tmpFreqC,
                color: darkener(toFinal !== null ? this.#data[toFinal].chance.color : "#222222")
            },
            nbtirages: this.#crudeData[toFinal !== null ? toFinal : this.#crudeData.length-1][0].length
        }
        // pour tous les éléments a fusionner vers la destination
        for (let k = 0; k < allToMerge.length; k++) {
            // pour chaque bloc de données
            for (let i = 0; i < this.#data[k].normal.freq.length; i++) {
                if(this.#data[k].normal.freq[i] !== null)
                    finalElem.normal.freq[i]+=this.#data[k].normal.freq[i]
            }    
            for (;i<i+this.#data[k].chance.freq.length;i++) {
                if(this.#data[i].chance.freq[i] !== null)
                    finalElem.chance.freq[i]+=this.#data[k].chance.freq[i]
            }                     
        }
        // placement des données
        if(toFinal == null){
            this.#data.push(finalElem)
        } else {
            for (let i=0; i<this.#data[toFinal].normal.freq.length; i++) {
                if(finalElem.normal.freq[i] !== null)
                    this.#data[toFinal].normal.freq[toFinal]+=finalElem.normal.freq[i]
            }               
            for (;i<i+this.#data[toFinal].chance.freq.length;i++) {
                if(finalElem.chance.freq[i] !== null)
                    this.#data[toFinal].chance.freq[toFinal]+=finalElem.chance.freq[i]
            }               
        }
        //@WARNING a faire (★★☆☆☆ pas tres important)
        // suppression des sets fusionnés dans le tableau puis "tassage" vers l'index 0 de la liste
        this.#reorder()
        
    }

    #reorder(){
        //@WARNING a faire (★★☆☆☆ pas tres important)
        // suppression des sets fusionnés dans le tableau puis "tassage" vers l'index 0 de la liste
        // a faire
=======
        if(allToMerge.length < 2) throw new Error(`${allToMerge} lenght < 2 !`)
        if(typeof(toFinal) !== "int" | toFinal !== null) throw new Error(`${toFinal} must be int or null !`);
        if(this.dataNumber <= 1) throw new Error("nombre de donnée d'entrées insuffisantes minimum 2, ("+this.dataNumber+") trouvé(es)")
        // verifie que les indexes sont correctes
        for (let i = 0; i < allToMerge.length; i++) {
            if(allToMerge[i] < 0) throw new Error(`value not in range : allToMerge[${i}]<0||allToMerge[${i}]>${this.dataNumber}`)
            else if (allToMerge[i] >= this.dataNumber) throw new Error(`value out of range (${this.dataNumber})`)
        }
        if(toFinal < 0) throw new Error(`toFinal out of range (${toFinal}<0)`)
        // merge des frequences
        for (i = 0; i <allToMerge.length; i++) {
            
        }
>>>>>>> e91dd8f68d03a09fd68f725aa86f0f74899ba335:scripts/js/LotoAnalyser.class.js
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

    // renvoie le nomre de blocs de données pour calculer une courbe en fonction de chaque éléments
    get dataNumber(){
        return this.#data.length
    }

}