
/**
 * créer et traire un dataset pour calculer les frequences d'apparition des
 * numéros unique sans autres paramètre intégré
 */
class CreateNumberFrequencyDataset extends DatasetManagerInterface {

    /**
     * créer le dataset pour les frequence des numeros
     * (presque vide si aucune paramètre)
     * @param {string} title of the dataset
     * @param {string} color format : "#ffffff"
     * @param {object} crudeData object of crude data
     * 1.0.1 (problème car pas de nbtirages ni analyse type dans le _jsoonrepr...)
     */
    constructor(title, color, crudeData){
        super()
        this._jsonRepresentation.crudeData = crudeData
        // @WARNING checksum needed (if data format not respected)
        if (title == null) title = "default title"
        if (color == null) color = "#f1f1f1"
        // initialisation des frequences
        let tpmFreq = []
        // remplissage pour l'incrementatiuon avenir    
        for (var i = 1; i < 60; i++) {
            tpmFreq.push(0)
        }
        this._jsonRepresentation.data = {
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

    get dataset(){
        return this._jsonRepresentation["data"]
    }

    /**
     * fait le calcul de la fréquence des nombre tirés a chaque
     * tirage et rien d'autre !
     */
    processDataset(){
        const myInput = this._jsonRepresentation
        for (let day = 1; day <= myInput.nbtirages; day++) {
            for (var num = 4; num < 9; num++) {
                var freqPos = myInput.crudeData[day]
                myInput.data.normal.freq[parseInt(freqPos[num])-1]++
            }
            // num chance
            myInput.data.normal.freq[parseInt(freqPos[9])+48]++  
        }        
        return myInput["data"]
    }

}

// end