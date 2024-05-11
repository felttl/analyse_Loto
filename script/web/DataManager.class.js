import { isSet } from "util/types"

/**
 * gestion des données par fréquence (QTD)
 */
export class LotoDataAnalyse{

    #titles = []
    #data = []

    constructor (anyFormatData,title) {
        this.#data.push(anyFormatData)
        this.#titles.push(title)
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