

/**
 * permet d'adapter le nombre de champs renseigné dans un fichier
 * a un l'analyse faite par le système (qui n'a normalement pas
 * de champs différents a chaque appel)
 */
class LenFieldAdapter {

    #structure
    #crudeData

    constructor(crudeData){
        this.#crudeData = crudeData
        this.#structure = {
            nbboules: 6,
            jour: "jour_de_tirage",
            date: "date_de_tirage",
            tirage: [
                "boule_1",
                "boule_2",
                "boule_3",
                "boule_4",
                "boule_5",
                "boule_6",
                {
                    0: "numero_chance",
                    1: "boule_complementaire"
                }
            ]
        }        
    }

    /**
     * renvoie le nombre de champs en sortie
     * (les "pos" indique l'index  a laquel el champs est positionné
     * de manière horizontale dans le fichier CSV, )
     */
    get inform(){
        let infos = {
            datePos: 0,

        }
        return infos
    }


}