
/**
 * sers a vaérifier que toues les champs sont détectés et 
 * qu'il n'y a pas d'incohérences
 */
class CheckSumData {

    #cdata
    #requirements

    constructor(cdata){
        this.#cdata = cdata
        // on ajoute les valeurs qui peuvent changer pour les fields
        // dans les prérequis 
        // (car 6 fichier conforme avec le même structure sur les 11)
        this.#requirements = {
            detailed: {
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
            }, 
            compact: [
                "jour_de_tirage",
                "date_de_tirage",
                "boule_1",
                "boule_2",
                "boule_3",
                "boule_4",
                "boule_5",
                "boule_6",
                "numero_chance",
                "boule_complementaire"
            ]

        }
        // le nb de boules peut être entre 6 et 7
    }

    /**
     * renvoie si le fichier passe au scanner du check sum sinon 
     * on arrète tout changement de données suceptible de planter
     * notre système
     */
    get ok(){
        let cpt = 9 // nombre d'element possible qui nous interesse
        // comparaison de notre élément avec celui de crudata
        let column=0
        while (column<33 && cpt>-1){
            if(this.#cdata[0][column] in this.#requirements.compact)
                cpt--
            column++
        }
        return cpt === 0
    }


}

// end