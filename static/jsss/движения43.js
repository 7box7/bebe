import * as needs from './all_need_funcs.js'

var xhr = 0
let num = window.location.href.split("/")[4]
xhr = needs.get('/get_definitions/' + num, '', check_date)



function check_date(){
    if (xhr.readyState == 4) {
        let status = xhr.status;
        if (status == 200) {
            let cont = document.getElementsByClassName("opreds_ul")[0]
            let req = JSON.parse(xhr.responseText)
            
            for (let i = 0; i < req['defs'].length; i++){
                let d = req["defs"][i]
                cont.innerHTML += "<li><span id=\"cover\">" + d["name"] + '</span> - ' + d["text"] + "</li>"
                if (d["formuls"]){
                    for (let f = 0; f < d["formuls"].length; f++){
                        let frm = d["formuls"][f]
                        cont.innerHTML += "<div class='frm'>" + frm["frm"] + "</div>"
                    }
                }
            }

        }
    }
}


let c = document.getElementsByClassName("edits")[0]
c.addEventListener("mouseover", function () {
    document.getElementsByClassName("edits")[0].style.height = "80px"
    document.getElementById("c").style.transform = 'rotate(135deg)'
    document.getElementsByClassName("plus")[0].style.display = 'block'
})
c.addEventListener("mouseout", function () {
    document.getElementsByClassName("edits")[0].style.height = "0px"
    document.getElementById("c").style.transform = 'rotate(45deg)'
})