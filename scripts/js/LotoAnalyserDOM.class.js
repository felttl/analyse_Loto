
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
     * @param {str} selectIdTagName nom de l'id du selecteur de balise "select"
     * @param {[object]} elems listes des éléments qui doivent se trouver dans le DOM partie "selec"
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
            //@WARNING a coder pour effecteur les mises a jour 
            // (raffraichissement)
            
            // mise a jour de la taille de l'option en fonction
            // de la taille du contenu
            this.#selectDOM.style.width = this.#selectDOM.firstChild.style.width
        })
    }



    putOptions(){
        // qjoute les options pour les retrouver
        let tmpOpt=null
        let tmpOptId=null
        for (let i = 0; i < this.#elems.length; i++) {
            tmpOpt=document.createElement("option")
            console.log("put options "+this.#elems[i].txtDisplay)
            tmpOpt.innerHTML = this.#elems[i].txtDisplay
            tmpOptId = Math.trunc(randi(1e5,1e6-1))+1e-1*i
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