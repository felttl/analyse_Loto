
/**
 * classe qui s'occupe de la fonctionnalité de génération du html 
 * pour éviter de modifier le html a chaque fois que le code de la classe
 * "LotoAnalyser" change
 */
class LotoAnalyserDOM{

    #ctx = null
    #selectDOM = null
    #elems = []
    #opts = []
    /**
     * 
     * @param {*} selectIdTagName nom de l'id du selecteur de balise "select"
     * @param {*} elems listes des éléments qui doivent se trouver dans le DOM partie "selec"
     * structure d'un elem de la liste :
     * {
     *      name: "name",
     *      txtDisplay: "sort by freq"
     *      
     * }
     */
    constructor(selectIdTagName,elems){
        this.#selectDOM=document.getElementById(selectIdTagName)
        this.#elems=elems
        // ajout d'eun evenement pour refaire les calculs
        // et mettre a jours le graphique si le mode est changé
        // avec la liste déroulante
        this.#selectDOM.addEventListener("onmouseup", function(){
            //@WARNING a coder pour effecteur les mises a jour (raffraichissement)
            
        })
    }

    putOptions(){
        // set custom attr :
        //myElement.setAttribute('customAttr', 'Anything you want');
        let tmpOpt=null
        let tmpOptId=null
        for (let i = 0; i < this.#elems.length; i++) {
            tmpOpt=document.createElement("option")
            tmpOpt.innerHTML = this.#elems[i].txtDisplay
            tmpOptId = randi(1e5,1e6-1)
            tmpOpt.setAttribute('optId', tmpOptId);
            this.#selectDOM.appendChild(tmpOpt)
        }
    }
    /**
     * supprime toutes les options du select qui ont l'attribut "optId"
     */
    clearSelect(){
        let _DOMElems = this.#selectDOM.getElementsByTagName("*")
        for (let i = 0; i < _DOMElems.length; i++) {
            if(_DOMElems[i].getAttribute("optId")!==null)
                _DOMElems[i].remove()
        }      
        this.#elems = []  
    }

}
    

// end page