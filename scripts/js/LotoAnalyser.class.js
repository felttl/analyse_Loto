// creates [1,2,3,4] by example (arrayrange(1,4,1))
arrayRange=(a,b,c) => Array.from({length:(b-a)/c+1},(d,e)=>a+e*c)  
zfill = (str,n)=> typeof(str) === "string" ? str.length < n ? str+("0".repeat(n-str.length)) : str : new Error(`(${str}) is not string`)

/**
 * assombri une couleur
 * @param {*} colorHex couleur hexadécimale format : #rrvvbb exemple : #67b09f
 * @param {*} ratio entre 0 et 1
 */
function darkener(colorHex,ratio=0.9){
	let res = "#"
    ratio %= 1 // securité
	const tmp = colorHex.substr(1) // remove '#'
    for (let i=0;i<3;i++)
    	res += zfill(Math.round(parseInt("0x"+tmp.substr(i*2,2))*ratio).toString(16),2)
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
 * 
 * O pour le tri numéro par numéro par fréquence d'apparation sans distinction
 * 1 pour le tri par fréquence des combinaisons journalières des numéro 1 a 5 inclus
 * 3 par fréquence des jours de la semaine des tirages (freq de lun a dim) 
 * @version 1.0.0
 */
class LotoAnalyser{

    #crudeData = [] // matrix (arrays)
    #data = []
    #items = 0 // nb d'éléments dans data
    #sort = 0 // par ferquence des numbres tirés (pour chaque nombres, par defaut c'est 0)
    #wasAnalysed = false
    #areAllLoaded = false

    /**
     * 
     * @param {*} jsonData 
     * @param {*} title 
     * @param {*} color 
     * @warning : il faut que tous les datasets soient chargés avant de faire tous les calculs
     * car si l'utilisateur insère uniquement 1 dataset et faire un calcul de frequence dessus
     * (par exemple) et que sur un autre qu'il vient d'ajouter il change de mode de synthétiseur
     * de donnée on aura deux dataserts "data" non compatibles provenant de "crude data" 
     * ou alors on doit 
     * 
     * @version 2.0.0 (OK)
     */
    constructor (jsonData,title,color) {
        if(!this.#areAllLoaded)
            this.addData(jsonData,title,color)
        else
            throw new Error("datas have already been loaded you can't add data, it's time to analyse now");
    }

    /**
     * indique que l'on a fini de charger les données 
     * ATTENTION on ne peut pas revenir en arrière
     * @version 2.0.0 (OK)
     */
    setAllLoaded(){
        this.#areAllLoaded = true
        this.#allFrequency()
        var tabNB = [1,45,2]
        
        var nouveauTab = tabNB.map(function(item){
            return item * 2
        })
        console.log(nouveauTab) // renvoie un nouveau tableau 


        // troisième façon de créer des objet, méthode avec un objet littéral
        var objV = {
            immat: "ED 9824 VQ",
            marque: "Renault",
            couleur: "rouge"
        }

        var objVoiture = new Object()
        objVoiture.marque = "Cio"
        objVoiture.marque = "clio"
        objVoiture.immat = "ED 1234 VQ"
        objVoiture.toString = function() {
            return `voiture immatriculée ${this.immat} de marque ${this.marque}`
        }
        console.log(objVoiture.toString())

    }


    /**
     * autorise la supperposition avec une couleur différente
     * @param {*} data données a jouter
     * @param {*} title titre des données
     * @version 2.0.0 (OK)
     */
    addData(data,title,color){
        this.#crudeData.push(data)
        // nettoyage des imperfections
        this.#crudeData[this.#items][0][0] = this.#crudeData[this.#items][0][0][0]
        // on rajoute un bloc de données utile(vide) avec la bonne structure (exploitable plus facilement)
        tmp.nbtirages = this.#crudeData[this.#items].length-1
        this.#setupAllDatasets(title,color,this.#items)
        this.#items++
    }


    /**
     * synthétise des information a partir des modes disponibles 
     * d'un bloc a la fois, sans paramètre par défaut il fera le dernier élément des
     * données brutes ajouté
     * @param {*} idx index de l'élément sur lequel calculer les fréquences
     * 
     * @version 2.0.0 (OK)
     */
    #setupAllDatasets(title, color, idx=null){
        if(idx >= this.#crudeData.length) 
            throw new Error(`${idx}>${this.#crudeData.length} out of range`)
        if(idx < 0)
            throw new Error(`${idx}<0 out of range!`)
        if(idx == 0 && this.#crudeData.length == 0)
            throw new Error(`index=${idx} but no elements in list(must load data before)`)
        if(idx===null)
            idx=this.#crudeData.length-1
        const headtop = this.#crudeData[idx][0] // "header" interdit comme nom de variable       
        console.log(`voici le headtop n°${this.#items}: ${headtop[4]} 
            === 'boule_1' (normalement) && ${headtop[9]} === 'numero_chance'` )
        // attention la condition ne marche pas bien (le throw ne s'effectue pas correctement alors que toutes les conditions sont respectées)
        if(headtop[4] ==! "boule_1" && headtop[9] ==! "numero_chance") // control d'integrite
            throw new Error("file weft incorrect: "+ headtop)
        if(this.#wasAnalysed)
            console.warn("Warning: data produced for analysis will be deleted and made again when continuing\nin:\tLotoAnalyser->#setupAllDatasets()")
        const pos = idx === null ? this.#crudeData.length-1 : idx
        switch (this.#sort) {
            case 0: // synthetise la frequence des numeros tombes
                this.#data[pos] = CreateNumberFrequencyDataset(
                    title, color, this.#crudeData[pos]
                )
                break
            case 1:
                // a coder

                break
            case 2:
                // a coder
                
                break
            case 3:
                // a coder

                break 
            default:
                throw new Error(`invalid sort identifier : id=(${this.#sort})<0 or >max`)
                break
        }
        this.#wasAnalysed=true        
    }




    /**
     * calcule toutes les fréquence pour tous les blocs de données
     * @version 2.0.0 (OK)
     */
    #allFrequency(){
        // blocs de données
        if(!this.#areAllLoaded)
            throw new Error("All data haven't been all loaded yet");
        if(this.#wasAnalysed)
            console.warn("be carefull data was already analysed and it can overwrite the analysis")
        for (let nbData=0;nbData<this.#items;nbData++){ 
            this.#data[nbData] = this.#data[nbData].processDataset()
        }
    }

    /**
     * fusionne les fréquences de plusieurs set de données déja ajoutés dans un nouveau ou déja existant
     * @param {Array} allToMerge 2 elements minimum (liste d'entiers des position des données 
     * dans le calcule des fréquences effectués par la classe, exemple : [1,4] prend la donné a la position 1 et 4, 2 éléments minimum dans la liste)
     * on peut metttre plusieurs foir la même nombre pour "dupliquer" les fréquences ou les "doubler"
     * @param {int|null} tofinal types possibles : 
     * - null créer une nouvelle analyse pour l'ajouter a la liste des analyses
     * - number [0-n] position de l'élément ou ajouter les autres données (fusion finale)
     * @param {bool} rmMerged si true supprime les datasets qui ont étés utilisé pour fuionner les données
     * false sinon on ne supprime rien (true par defaut)
     * @version 1.0.0
     */
    merge(allToMerge, toFinal, rename=" ", rmMerged=true){
        if(this.#wasAnalysed)
            console.warn("in: LotoAnalyser->merge()\n\tWarning:\t don't merge with different analyse mode, it can produce weird analysis")
        const reuse = `allToMerge=${allToMerge}, tofinal=${toFinal}`
        if(typeof(toFinal) !== "number" && toFinal !== "null") 
            throw new Error(`${toFinal} must be integer/number or null !`)        
        if(allToMerge.length < 2 && toFinal === null) 
            throw new Error(`${reuse} 2 elements required for merge at least !`)
        if(allToMerge.length < 1 && toFinal !== null)
            throw new Error(`${reuse} 2 elements required for merge at least !`) 
        // verification que tous les sets de données ont le même type d'analyse
        const tofinalType = this.#data[toFinal].analyseType
        let currentAnalysTyp = null
        for (let i = 0; i < allToMerge.length; i++) {
            currentAnalysTyp = this.#data[allToMerge[i]].analyseType
            if(tofinalType !== currentAnalysTyp)
                throw new Error(`Analysis type is different: tofinal analysis 
                type is : ${tofinalType}\n allToMerge[${i}] (=${allToMerge[i]}) 
                type is: ${currentAnalysTyp}`)
        }
        let finalElem = null
        if(toFinal === null){
            switch (this.#sort) {
                case 0:
                    finalElem = this.data.dataset
                    break
                case 1:

                break

                case 2:

                break

                case 3:

                break

                case 4:

                break

                default:
                    throw new Error(`Sort type not found (${this.#sort})`);
                    break;
            }
            // a modifier
            finalElem = CreateNumberFrequencyDataset("no title set", "#222222").dataset()
            finalElem.nbtirages = this.#crudeData[this.#crudeData.length-1][0].length
        } else {
            finalElem = this.#data[toFinal]
        }
        // pour tous les éléments a fusionner vers la destination
        for (let k = 0; k < allToMerge.length; k++) {
            // pour chaque numéros tirés
            for (let i = 0; i < 60; i++) {
                finalElem.normal.freq[i]+=this.#data[allToMerge[k]].normal.freq[i]
            }                    
        }
        finalElem.normal.title=rename
        // placement des données
        if(toFinal === null){
            this.#data.push(finalElem)
        } else {
            this.#data[toFinal] = finalElem
        }
        if(rmMerged)
            this.#reorder(allToMerge)
        
        
    }

    /**
     * permet de supprimer les éléments qui ont servi a la fusion après que celles-ci soient fusionnées
     * @param {[int]} useless liste des indexes des données à supprimer
     * @param {bool} isRmIntoCrude si true supprimera aussi les données 
     * présentes dans les données brutes (false par défaut)
     * 
     */
    #reorder(useless, isRmIntoCrude=false){
        for (let i = 0; i < useless.length; i++) {
            this.#data.splice(useless[i],1)
            this.#items--
            if(isRmIntoCrude)
                this.#crudeData.splice(useless[i],1)
        }
    }


    /////////////// GETTERS ///////////


    get isSortedByFreq(){
        return this.#sort
    }

    /**
     * permet de recupérer les valeurs clefs de la/les série(s) de donné(es):
     * 
     * @param {*} numSerie numério de a série a analser (si c'est null ou sans paramètre
     * c'est considéré sur l'ensemble des données)
     * @returns {object} objet contenant tous les attributs clef (clef-valeur)
     *  
     * - max ("")
     * - min ("")
     * - moyenne (avg)
     * - somme totale (sum)
     * - etendue (stretch)
     * - variance (var)
     * - quartile (Q1,Q3,IQR)
     * - esperance (exp for expectation)
     * - niveau de confiance 95% (trustL95)
     * - kurtosis (kur)
     * - erreur type (pour l'nalyse des intervalles de confiance) (errType)
     * 
     * @warning :
     *      dans chaque type de valeurs clefs les données seront produite 
     *      uniquement si c'est possible !
     */
    getKeyValues(numSerie=null){
        let tmp = 0
        let res = {
            min: 0,
            max: 0,
            avg: 0,
            sum: 0,
            stretch: 0,
            var: 0,
            q1: 0,
            q3: 0,
            iqr: this.q3-this.q1,
            exp: 0,
            trustL95: 0,
            kur: 0,
            errTyp: 0
        }
        //@acoder #acoder #a_coder #aCoder @aCoder a coder
        // parcours des données et remplisage de "res" ligne par ligne
        // a calculer après le boucle si nécessaire (pour la moyenne par exemple)
        return res

    }

    /**
     * renvoie le nomre de blocs de données pour calculer une courbe en fonction 
     * de chaque éléments
     * 
     */
    get dataNumber(){
        return this.#data.length
    }

    /**
     * renvoie une configuration pour un rendu Chart.js
     */
    get config(){
        let datasFinal = []   
        let loterylabels = []          
        switch (this.#sort) {
            case 0:
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
                            label: this.#data[i].normal.title,
                            data: this.#data[i].normal.freq,
                            fill: false,
                            borderColor: this.#data[i].normal.color,
                            tension: 0.1,
                            backgroundColor: "#bfbfbf"
                        }
                    )
                }                
                break;
            case 1:
                // a coder
                break;
            default:
                throw new Error("sort code is unknown ("+this.#sort+")")
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
        if(!this.#areAllLoaded)
            throw new Error("all datasets must be loaded before sort or change sort type")
        // coherence test
        if(typeof(id)!=="number" && Math.floor(id)!==id)
            throw new Error(`id (${id}) is not an integer/number`)
        if(id < 0)
            throw new Error(`id ${id} out of range (id<0)`)
        this.#sort=id
    }


    debug(){
        // coloration pour le repérage (couleur titre + couleur aténuée pour le contenu)
        const zomgreenh1 = (...txt)=>console.log(`%c${txt}`,'color: #22ff22; font-weight: bold; background-color: #114411')
        const zomgreenh2 = (...txt)=>console.log(`%c${txt}`,'color: #11ff11; font-weight: bold; text-decoration: underline 1px #00ff00; text-underline-offset: 3px;')
        const zomgreenp = (...txt)=>console.log(`%c${txt}`,'color: #11ff11')
        zomgreenh1('------- debugg mode! -------')
        zomgreenh2("sets de données (brute)")
        console.log(this.#crudeData)
        zomgreenh2("sets de données (traitées)")
        console.log(this.#data)
        zomgreenh2("setup :")
        console.log(this.config)
        zomgreenh2("------------------------------")
        
    }



}