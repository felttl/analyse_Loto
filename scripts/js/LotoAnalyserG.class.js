
/**
 * classe qui s'occupe de la fonctionnalité de génération du html 
 * pour éviter de modifier le html a chaque fois que le code de la classe
 * "LotoAnalyser" change
 */
class LotoAnalyserG{

    #ctx = null
    #selectId = ""
    #elems = []
    /**
     * 
     * @param {*} ctxIdName nom de l'idientifiant contextuel (ctx)
     * @param {*} selectIdTagName nom de l'id du selecteur de balise "select"
     * @param {*} elems listes des éléments qui doivent se trouver dans le DOM partie "selec"
     * structure d'un elem de la liste :
     * {
     *      name: "name",
     *      txtDisplay: "sort by freq"
     *      
     * }
     */
    constructor(ctxIdName,selectIdTagName,elems){
        this.#ctx=document.getElementById(ctxIdName)
        this.#selectId=document.getElementById(selectIdTagName)
        this.#elems=elems
    }

    putOptions(){
        // set custom attr :
        //myElement.setAttribute('customAttr', 'Anything you want');
        let tmpOpt=null
        for (let i = 0; i < this.#elems.length; i++) {
            tmpOpt=document.createElement("option")
            tmpOpt.innerHTML = this.#elems[i].txtDisplay
            
        }
    }

}

function fa(){
    let a=document.createElement("p");
    let ctx=document.getElementById("p")
    a.innerHTML = "voici du texte"
    ctx.appendChild(a);
    }
    function rm(){
    let ctx=document.getElementById("p")
    ctx.lastChild.remove()
    }
    

// end page