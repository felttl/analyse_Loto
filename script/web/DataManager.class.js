import { isSet } from "util/types"

/**
 * gestion des données par fréquence (QTD)
 */
export class LotoAnalyser{

    #titles = []
    #crudeData = []
    #data = []

    constructor (jsonData,title) {
        this.#crudeData.push(jsonData)
        this.#titles.push(title)
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
        this.constructor(data,title)
    }

    get frequency(){
        var res = []
        for (let i = 0; i < array.length; i++) {
            if(isSet(res[i]))
                res[i]++
            else
                res[i]=1
        }
        return res
    }

    rendering(ctx){
        // use ChartJS
    }
}