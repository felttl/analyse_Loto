
class CreateNumberFrequencyDataset extends DatasetManagerInterface {

    /**
     * créer el dataset et le datasert par défaut 
     * (presque vide si aucune paramètre)
     * @param {string} title of the dataset
     * @param {string} color format : "#ffffff"
     * @returns 
     */
    constructor(title, color){
        if (title == null) title = "default title"
        if (color == null) color = "#f1f1f1"
        // initialisation des frequences
        let tpmFreq = []
        // remplissage pour l'incrementatiuon avenir    
        for (var i = 1; i < 60; i++) {
            tpmFreq.push(0)
        }
        return {
            // 1,2,3,etc...49,1,2,...,10 (49x+10x)
            normal: {
                title: title,
                freq: tpmFreq,
                color: color
            },
            nbtirages: 0,
            analyseType: 0
        }
    }

    processDataset(...arg){

    }

}

// end