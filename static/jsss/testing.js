import * as needs from './all_need_funcs.js'
const module = await import('./granim.js');

var xhr = 0
let num = window.location.href.split("/")[4]
console.log(num)
xhr = needs.get('/get_definitions/' + num, '', check_date)

// function sendRequest(url, method = 'GET', async = false, ready_func=()=>{}, loading_func=()=>{}, needs_full_req=false, responseType="", body={}) {
//     /*
//     *
//     *
//     *
//     * */
//     let xhr = new XMLHttpRequest();
//     xhr.open(method, url, async);
//
//     if (async) {
//         xhr.onreadystatechange = function () { // (3)
//             //alert('a')
//             console.log(xhr)
//             if (xhr.readyState !== 4) return;
//             if (xhr.status !== 200) {
//                 ready_func(false)
//             } else {
//                 if(needs_full_req)
//                     ready_func(xhr)
//                 else
//                     ready_func(xhr.responseText)
//             }
//
//         }
//
//     }
//     if(async)
//         xhr.responseType=responseType
//     if(method==='POST'){
//         xhr.send(JSON.stringify(body))
//     }else {
//         xhr.send();
//     }
//
//     if(async){
//         loading_func()
//     }else{
//         if (xhr.status !== 200) {
//             return false
//         }       else {
//             return xhr.responseText
//         }
//     }
//
// }

var granimInstance = new Granim({
    element: '#canvas-basic',
    direction: 'left-right',
    isPausedWhenNotInView: true,
    states : {
        "default-state": {
            gradients: [
                ['#ff9966', '#ff5e62'],
                ['#00F260', '#0575E6'],
                ['#e1eec3', '#f05053']
            ]
        }
    }
});


function checking_strings(checking_string, main_string){
    let main = main_string.replace(",", "").replace("-", "").replace("  ", " ").split(" ")
    let check = checking_string.replace(",", "").replace("-", "").replace("  ", " ").split(" ")
    let len_check = check.length
    
    let words_main_len = 0
    let words_check_len = 0
    for (let i = 0; i < main.length; i++){

        let main_word = main[i]
        for (let b = 0; b < main_word.length; b++){
            words_main_len += 1
            if (i < len_check){
                if (main_word[b] == check[i][b]){
                    words_check_len += 1
                }
            }
            
        }
    }
    
    return Math.round(words_check_len / words_main_len * 100)
}

window.pr=(element)=> {
    location.href = '/information/33'
}


function check_date(){
    if (xhr.readyState == 4) {
        let status = xhr.status;
        if (status == 200) {
            let cont = document.getElementsByClassName("about")[0]
            let req = JSON.parse(xhr.responseText)
            console.log(req)
            let a = document.getElementById('name_date')

            a.innerHTML = `<label for="big_text" id="top">${req['defs'][0]['name']}</label>
                    <textarea id="big_text" name="big_text"></textarea>`
            let all_answers = []

            let i = 0
            let check = true
            let but = document.getElementById('bt')
            window.prov=(element)=> {
                if (i < req['defs'].length) {
                    let sl = {}
                    let text_area = document.getElementById('big_text')
                    let opr = text_area.value
                    let term = document.getElementById('top').innerText
                    sl['name'] = term
                    sl['text'] = opr
                    all_answers.push(sl)
                    let a = document.getElementById('name_date')
                    a.style.flexDirection = 'row'
                    a.innerHTML = `
                                        <label for="big_text" id="top">${req['defs'][i]['name']}</label>
                                   
                                   <textarea id="big_text" name="big_text"></textarea>`
                    i += 1
                    if (i === req['defs'].length) {
                        let but = document.getElementById('bt')
                        but.value = 'Отправить'
                    }
                }
                else {
                    if (check){
                        let all = document.getElementById('ab-t')
                        all.style.marginTop = '20px'
                        a.style.flexDirection = 'column'
                        a.style.width = '90%'
                        a.innerHTML = ""
                        let but = document.getElementById('bt')
                        a.innerHTML += `<div class="wew-container" style="background-color: #1c7590; align-items: center; font-size: 20px"><div class="pers" style="color: white">Процент правильности</div><div class="main">Верный ответ</div><div class="wew">Ваш ответ</div></div>`
                        for (let b = 0; b < all_answers.length; b ++){
                            let define = all_answers[b]
                            let prov_otpr = define['text']
                            let prov_main = req['defs'][b]['text']
                            let pers = checking_strings(prov_otpr, prov_main)
                            a.innerHTML += `<div class="wew-container"><div class="pers" style="color: rgb(${255 * (100 - pers) / 100}, ${255 * pers / 100}, 0)">${pers}%</div><div class="main">${prov_main}</div><div class="wew" style="background-color: rgb(47, 47, 47);">${prov_otpr}</div></div>`

                        }
                        but.value = 'Вернуться к терминам'

                    }
                    else {
                        but.onclick = pr()
                    }

                    check = false

                }
            }

        }
    }
}
