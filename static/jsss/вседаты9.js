import * as needs from './all_need_funcs.js'

var xhr = 0
xhr = needs.get('/get_dates/', '', check_date)




function check_date(){
    if (xhr.readyState == 4) {
        let status = xhr.status;
        if (status == 200) {
            let t = document.getElementsByClassName("all_dates")[0];
            let req = JSON.parse(xhr.responseText)
            
            for (let i = 0; i < req["dates"].length; i++){
                let r = req["dates"][i]
                t.innerHTML += r.name + ' ' + needs.delete_zeros(r.date) + ' ' + r.period + '<br>'
                
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