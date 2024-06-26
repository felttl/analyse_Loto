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
      
        this.#crudeData.push(data)
        // on transforme l'entête (str) en tableau (lisiblité)
        this.#crudeData[this.#items][0][0] = ((this.#crudeData[this.#items][0][0])+"").split(";")
        this.#crudeData[this.#items].pop() // dernière ligne inutile
        // on rajoute un bloc de données utile(vide) avec la bonne structure (exploitable plus facilement)
        let tmp = this.#getDataSetup(title,color)
        tmp.nbtirages = this.#crudeData[this.#items][0].length
        this.#data.push(tmp)
        this.#items++   
    }

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

    /**
     * permet de calculer les fréquences d'un bloc a la fois 
     * ,sans paramètre par défaut il fera le dernier élément des
     * données brutes ajouté
     * @param {*} idx index de l'élément sur lequel calculer les fréquences
     */
    #calcFrequency(idx=null){
        if(idx >= this.#crudeData.length) 
            throw new Error(`${idx}>${this.#crudeData.length} out of range`)
        if(idx < 0)
            throw new Error(`${idx}<0 out of range!`)
        if(idx == 0 && this.#crudeData.length == 0)
            throw new Error(`index=${idx} but no elements in list(must load data before)`)
        const headtop = this.#crudeData[nbData][0][0] // "header" interdit comme nom de variable       
        if(headtop[4] ==! "boule_1" && headtop[9] ==! "numero_chance") // control d'integrite
            throw new Error("entête de fichier incorrect: "+ headtop)
        const pos = idx === null ? this.#crudeData.length-1 : idx
        for (let day = 0; day < this.#data[pos].nbtirages; day++) {
            for (let num = 4; num < 9; num++) {
                let freqPos = parseInt((this.#crudeData[pos][day][0]+"").split(";"))
                if(this.#sort)
                    this.#data[pos].normal.freq[freqPos[num]]++
            }
            if(this.#sort)
                this.#data[nbData].chance.freq[freqPos[num]+49]++            
        }
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
    #allFrequency(){
        for (let nbData=0;nbData<this.#items;nbData++ ){ // blocs de données
            this.#calcFrequency(nbData)
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
        const reuse = `allToMerge=${allToMerge}, tofinal=${toFinal}`
        if(typeof(toFinal) !== "int" && toFinal !== "null") 
            throw new Error(`${toFinal} must be int or null !`)        
        if(allToMerge.length < 2 && toFinal === null) 
            throw new Error(`${reuse} 2 elements required for merge at least !`)
        if(allToMerge.length < 1 && toFinal !== null)
            throw new Error(`${reuse} 2 elements required for merge at least !`)            
        // @WARNING !!!!!
        // pour le nb de tirages de l'objet suivant il faut faire la somme des nb de tirages des indexes présents
        // dans la liste prise en paramètre "allToMerge" !!!!
        if(toFinal === null){
            let finalElem = this.#getDataSetup("no title set", "#222222")
            finalElem.nbtirages = this.#crudeData[this.#crudeData.length-1][0].length
        } else {
            let finalElem = this.#getDataSetup(
                this.#data[toFinal].normal.title,
                this.#data[toFinal].normal.color
            )    
            // a calculer
            let allNbData = this.#crudeData[toFinal][0].length  
            // a coder ici (voir le précédent warning)
            finalElem.nbtirages = allNbData
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
        this.#allFrequency()
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