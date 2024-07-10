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
    // warn si jamais on veut merger des données qui ont déja 
    // étés analysé mais avec un mode de frequencage différent de celui actuel
    #wasAnalysed = false

    constructor (jsonData,title,color) {
        this.addData(jsonData,title,color)    
    }


    /**
     * autorise la supperposition avec une couleur différente
     * @param {*} data données a jouter
     * @param {*} title titre des données
     */
    addData(data,title,color){
        this.#crudeData.push(data)
        // on transforme l'entête (str) en tableau (lisiblité)
        this.#crudeData[this.#items][0][0] = ((this.#crudeData[this.#items][0][0])+"").split(";")
        this.#crudeData[this.#items].pop() // dernière ligne inutile
        // on rajoute un bloc de données utile(vide) avec la bonne structure (exploitable plus facilement)
        let tmp = this.#getDataSetup(title,color)
        tmp.nbtirages = this.#crudeData[this.#items][0].length
        this.#data.push(tmp)
        this.calcFrequency(this.#items)
        this.#items++  
    }


    /**
     * permet de calculer les fréquences d'un bloc a la fois 
     * ,sans paramètre par défaut il fera le dernier élément des
     * données brutes ajouté
     * @param {*} idx index de l'élément sur lequel calculer les fréquences
     */
    calcFrequency(idx=null){
        this.#wasAnalysed=true
        if(idx >= this.#crudeData.length) 
            throw new Error(`${idx}>${this.#crudeData.length} out of range`)
        if(idx < 0)
            throw new Error(`${idx}<0 out of range!`)
        if(idx == 0 && this.#crudeData.length == 0)
            throw new Error(`index=${idx} but no elements in list(must load data before)`)
        if(idx===null)
            idx=this.#crudeData.length-1
        const headtop = this.#crudeData[idx][0] // "header" interdit comme nom de variable       
        if(headtop[4] ==! "boule_1" && headtop[9] ==! "numero_chance") // control d'integrite
            throw new Error("entête de fichier incorrect: "+ headtop)
        const pos = idx === null ? this.#crudeData.length-1 : idx
        switch (this.#sort) {
            case 0:
                this.#freqByNum(pos)
                break;
            case 1:
                
                break;   
            case 2:
                
                break;                   
            case 3:
                
                break;   
            default:
                throw new Error(`invalid sorting identifier : id=(${this.#sort})<0 or >max`);
        }

    }


    /**
     * O pour le tri numéro par numéro par fréquence d'apparation sans distinction
     * 1 pour le tri par fréquence des combinaisons journalières des numéro 1 a 5 inclu (pas num chance)
     * 2 pareil que pour le 1 mais le n°chance est compris dedans
     * 3 par fréquence des jours de la semaine des tirages (freq de lun a dim) 
     * 
     * 
     */

    /**
     * fait le tri selon la fréquence des nombre et rien d'autre !
     * @param {unsigned int} dataBloc fais les calcul sur un bloc de données spécifique
     * @param {boolean} luckyIn false frequence des nombres chance non calculés, true il sont inclus
     * 
     */
    #freqByNum(dataBloc,luckyIn=false){
        for (let day = 0; day < this.#data[dataBloc].nbtirages; day++) {
            for (var num = 4; num < 9; num++) {
                var freqPos = parseInt((this.#crudeData[dataBloc][day]+"").split(";"))
                this.#data[dataBloc].normal.freq[freqPos[num]]++
            }
            // num chance
            this.#data[dataBloc].chance.freq[freqPos[num]+49]++            
        }        
    }
    /**
     * fait le tri selon la fréquence des nombre et rien d'autre !
     */
    #freqByDailyCombination(dataBloc){
        for (let day = 0; day < this.#data[pos].nbtirages; day++) {
            // a coder
        }        
    }

    // rajoute les valeur clefs (moy, mid, diff, granddiff, eqtype, QTS)

    /**
     * calcule toutes les fréquence pour tous les blocs de données
     */
    #allFrequency(){
        // blocs de données
        if(this.#wasAnalysed)
            console.warn("be carefull data was already analysed and it can overwrite the analysis")
        for (let nbData=0;nbData<this.#items;nbData++){ 
            this.calcFrequency(nbData)
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
        if(this.#wasAnalysed)
            console.warn("in: LotoAnalyser->merge()\n\tWarning:\t don't merge with different analyse mode, it can produce weird analysis")
        const reuse = `allToMerge=${allToMerge}, tofinal=${toFinal}`
        if(typeof(toFinal) !== "int" && toFinal !== "null") 
            throw new Error(`${toFinal} must be int or null !`)        
        if(allToMerge.length < 2 && toFinal === null) 
            throw new Error(`${reuse} 2 elements required for merge at least !`)
        if(allToMerge.length < 1 && toFinal !== null)
            throw new Error(`${reuse} 2 elements required for merge at least !`)            

        if(toFinal === null){
            let finalElem = this.#getDataSetup("no title set", "#222222")
            finalElem.nbtirages = this.#crudeData[this.#crudeData.length-1][0].length
        } else {
            let finalElem = this.#getDataSetup(
                this.#data[toFinal].normal.title,
                this.#data[toFinal].normal.color
            )    
            let allNbData = this.#crudeData[toFinal][0].length  
            // calcule de la somme du nombre de données (nb de jours)
            for (let j = 0; j < allToMerge.length; j++) {
                allNbData += this.#crudeData[allToMerge[j]][0].length   
            }
            finalElem.nbtirages = allNbData
        }
        // pour tous les éléments a fusionner vers la destination
        for (let k = 0; k < allToMerge.length; k++) {
            // pour chaque bloc de données
            for (let i = 0; i < 50; i++) {
                if(this.#data[k].normal.freq[i] !== null)
                    finalElem.normal.freq[i]+=this.#data[k].normal.freq[i]
            }    
            for (;i<60;i++) {
                if(this.#data[i].chance.freq[i] !== null)
                    finalElem.chance.freq[i]+=this.#data[k].chance.freq[i]
            }                     
        }
        // placement des données
        if(toFinal == null){
            this.#data.push(finalElem)
        } else {
            for (let i=0; i<50; i++) {
                if(finalElem.normal.freq[i] !== null)
                    this.#data[toFinal].normal.freq[toFinal]+=finalElem.normal.freq[i]
            }               
            for (;i<60;i++) {
                if(finalElem.chance.freq[i] !== null)
                    this.#data[toFinal].chance.freq[toFinal]+=finalElem.chance.freq[i]
            }               
        }
        this.#reorder(allToMerge)
        
    }
    /**
     * permet de supprimer les éléments fusionnés une fois les données fusionnées
     * @param {[int]} useless liste des indexes dont les données ont étés fusionnées
     * @param {int} toDest destination des données (index)
     */
    #reorder(useless,toDest){
        if(useless.length < 2) 
            throw new Error(`${useless} lenght < 2 !`)
        if(typeof(toDest) !== "int" | toDest !== null) 
            throw new Error(`${toDest} must be int or null !`);
        if(this.dataNumber <= 1) 
            throw new Error("nombre de donnée d'entrées insuffisantes minimum 2, ("+this.dataNumber+") trouvé(es)")
        // verifie que les indexes sont correctes
        for (let i = 0; i < useless.length; i++) {
            if(useless[i] < 0) 
                throw new Error(`value not in range : useless[${i}]<0||allToMerge[${i}]>${this.dataNumber}`)
            else if (allToMerge[i] >= this.dataNumber) 
                throw new Error(`value out of range (${this.dataNumber})`)
        }
        if(toDest < 0) 
            throw new Error(`toDest out of range (${toDest}<0)`)
        for (let i = 0; i < useless; i++) {
            if(useless[i] !== toDest) // on supprime pas la destination si elle se trouve dans les "useless"
                this.#data.splice(useless[i],1)
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

    /////////////// GETTERS ///////////

    // renvoie un setup vide
    #getDataSetup(title,color){
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
        return {
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
                nbtirages: 0
        }
    }

    get isSortedByFreq(){
        return this.#sort
    }


    /**
     * renvoie une configuration pour un rendu Chart.js
     */
    get config(){
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

    ////////////////////////////// SETTERS ///////////////////////////
    /**
     * 
     * @param {*} index numero d'index du dataset pour lequel changer les couleurs
     * @param {*} color couleur hexa ou acronyme a changer
     */
    setColor(index, color){
        this.#data[index]=color
    }

    /**
     * permet de faire l'analyse de fréquence selon certains critères
     * @param {int} id (défaut 0):
     * O pour le tri numéro par numéro par fréquence d'apparation sans distinction
     * 1 pour le tri par fréquence des combinaisons journalières des numéro 1 a 5 inclu (pas num chance)
     * 2 pareil que pour le 1 mais le n°chance est compris dedqns
     * 3 par fréquence des jours de la semaine des tirages (freq de lun a dim) 
     * 
     * 
     */
    setSortType(id=0){
        if(typeof(id)!=="number" && Math.floor(id)!==id)
            throw new Error(`id (${id}) is not an integer`)
        this.#sort=id
    }


    debug(){
        console.log(this.#crudeData)
        console.log("partie frequence : ")
        console.log(this.config)
    }

    // renvoie le nomre de blocs de données pour calculer une courbe en fonction de chaque éléments
    get dataNumber(){
        return this.#data.length
    }

}