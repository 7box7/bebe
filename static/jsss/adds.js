import * as needs from './all_need_funcs.js'

var xhr = 0
let num = window.location.href.split("/")[4]
xhr = needs.get('/get_form_info/' + num, '', check_date)

var count_dats = 0
function build_form(num, type, name, dt){
    let a = ""
    if (type == "t"){
        a = '<div class="duo" id="name_date"> \
            <label for="topic_name" id="top">' + name + '</label> \
            <input id="topic_name" type="text" name="name' + num + '"> \
        </div>'
    } else if (type == "r"){
        a = '<div class="duo" id="name_date"> \
            <label for="topic_name" id="top">' + name + '</label> \
            <input type="radio" name="without_md' + num + '" id="rad"></input> \
        </div>'
    } else if (type == "d"){
        a = '<div class="duo" id="name_date"> \
            <label for="topic_name" id="top">' + name + '</label> \
            <input id="parent_input" name="country' + num + '" list="names' + num + '" /> \
            <datalist id="names' + num + '">'
            for (let i = 0; i < dt.length; i++){
                a += '<option value="' + dt[i] + '" />'
            }
            a += "</datalist></div>"
        count_dats++
    } else if (type == "h"){
        a = '<div class="duo" id="name_date"> \
            <label for="big_text" id="top">' + name + '</label> \
            <textarea id="big_text" name="big_text' + num + '"></textarea> \
        </div>'
    } else if (type == "c"){
        a = '<div class="duo" id="name_date"> \
            <label for="topic_name" id="top">' + name + '</label> \
            <input id="check" type="text" name="check"' + num + '> \
        </div>'
    } else {
        a = ""
    }
    return a
}



function check_date(){
    if (xhr.readyState == 4) {
        let status = xhr.status;
        if (status == 200) {
            let req = JSON.parse(xhr.responseText)
            req = req["answer"]
            let a = document.getElementsByTagName("form")[0]
            a.action = '/post_info/' + req["name"]
            let f = req["fields"]
            let n = req["names"].split(";")
            let dt = req["datalists"]
            for (let i = 0; i < f.length; i++){
                a.innerHTML += build_form(i, f[i], n[i], dt[count_dats])
            }
            a.innerHTML += '<div class="duo" id="submit"><input type="submit" value="OK" id="ok"></div></form>'
        }
    }
}