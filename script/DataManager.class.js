import { json } from "stream/consumers"
import { isSet } from "util/types"

/**
 * gestion des données par fréquence (QTD)
 */
export class LotoAnalyser{

    #titles = [] // array
    #crudeData = [] // array
    #data = [] // freqs


    constructor (jsonData,title) {
        this.addData(jsonData,title)
        // initialisation des frequences
        for (let i = 1; i < 50; i++) {
            this.#data[i] = 0
        }
    }


    /**
     * autorise la supperposition avec une couleur différente
     * @param {*} data données a jouter
     * @param {*} title titre des données
     */
    addData(data,title){
        this.#crudeData.push(data)
        this.#titles.push(title)        
    }

    /**
     * renvoie une liste de fréquences pour les 49 chiffres
     */
    get frequency(){
        for (let i = 0; i < array.length; i++) {
            res.push(0)
            if(i == data_subnote_json[i])
                res[i]++    
        }
        return res
    }

    rendering(ctx){
        // use ChartJS
    }
}