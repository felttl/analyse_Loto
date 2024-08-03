
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
     *      value: 0
     *      
     * }
     * value est opptionnel est sera l'indice de l'élément par defaut
     * (sauf précisé)
     */
    constructor(selectIdTagName,elems){
        this.#selectDOM=document.getElementById(selectIdTagName)
        if(this.#selectDOM == null) 
            throw new Error(`error: selectIdTagName: (${selectIdTagName}) does not exist`)
        this.#elems=elems

    }

    /**
     * fixe les évènements liés aux rafraichissement 
     * (lors du clique utilisateur, et autres interactions)
     * @warning : toujours faire la méthode putOptions() avant de faire fixRefresh()
     * car l'élément select serait vide sinon et les évènement seraient inutilisables
     */
    fixRefresh(){
        // refais les calculs
        // et mettre a jours le graphique si le mode est changé
        // avec la liste déroulante
        const localselect =  this.#selectDOM
        this.#selectDOM.addEventListener("change", function(){
            //@WARNING a coder pour effecteur les mises a jour 
            // (raffraichissement)
            // mise a jour de la taille de l'option en fonction de la taille du contenu
            const selectedOption = localselect.options[localselect.selectedIndex]
            localselect.style.clientWidth = selectedOption.value
        })        
    }

    ////////////// GETTERS ////////////////////
    get selectDOMwidth(){
        return this.#selectDOM.style.width 
    }

    get selectDOMchildWidth(){
        return this.#selectDOM.firstChild.style.width
    }
    ////////////// SETTERS ////////////////////
    setSelectDOMwidth(elem){
        this.#selectDOM.style.width = elem
    }


    /**
     * ajoute toutes les options dans la balise "select" 
     */
    putOptions(){
        let tmpOpt=null
        let tmpOptId=null
        for (let i = 0; i < this.#elems.length; i++) {
            tmpOpt=document.createElement("option")
            tmpOpt.innerHTML = this.#elems[i].txtDisplay
            tmpOptId = Math.trunc(randi(1e5,1e6-1))+1e-2*i
            tmpOpt.setAttribute('optId', tmpOptId);
            this.#selectDOM.appendChild(tmpOpt)
        }
        // this.#selectDOM.firstChild.checked = true // first prior    
    }

    /**
     * supprime toutes les options du select qui ont l'attribut "optId"
     */
    clearSelect(){
        let _DOMElems = this.#selectDOM.getElementsByTagName("*")
        for (let i = 0; i < _DOMElems.length; i++) {
            if(_DOMElems[i].getAttribute("optId")!=null)
                _DOMElems[i].remove()
        }      
        this.#elems = []  
        // 1 élément reste obligatoire
        this.#selectDOM[0].innerHTML="none"
    }
    

}
    

// end page