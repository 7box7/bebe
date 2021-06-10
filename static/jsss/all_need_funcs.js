// Растягивание канваса
export function start_settings(canvas, element){
    canvas.width = element.offsetWidth;
    canvas.height = element.offsetHeight;
}


// Рисование точки
export function draw_point(obCanvas, x, y, color, radius){
    obCanvas.beginPath()
    obCanvas.arc(x, y, radius, 0, Math.PI * 2)
    obCanvas.fillStyle = color;
    obCanvas.fill();
    obCanvas.closePath()
}


// Рисование текста
export function draw_text(obCanvas, x, y, text, color, font){
    obCanvas.beginPath()
    obCanvas.fillText(text, x, y);
    obCanvas.font = font;
    obCanvas.fillStyle = color;
    obCanvas.closePath()
}


// Рисование линии
export function draw_line(obCanvas, x1, y1, x2, y2, color, linewidth){
    obCanvas.beginPath()
    obCanvas.moveTo(x1, y1)
    obCanvas.lineTo(x2, y2)
    obCanvas.lineWidth = linewidth;
	obCanvas.strokeStyle = color;
    obCanvas.stroke();
    obCanvas.closePath();
}


// Задний фон
export function back_draw(obCanvas, color, width, height){
    obCanvas.beginPath();
	obCanvas.fillStyle = color;
    obCanvas.fillRect(0, 0, width, height);
    obCanvas.closePath();
}


// Рандомное число в интервале от x до y
export function random_x_y(x, y){
    return Math.random() * (y - x) + x
}


// Установка слайдера
export function set_slider(slid_id, text_id, main, num_param){
    let slider = document.getElementById(slid_id)
    let slider_text = document.getElementById(text_id)
    let first_text = slider_text.innerHTML
    slider_text.innerHTML = first_text + slider.value
    console.log(slider.value)
    slider.oninput = function (){
        slider_text.innerHTML = first_text + this.value
        main.change_config_parametrs(num_param, Number(this.value))
        main.redraw()
    }
}


// Повтор строки
export function repeat(str, int){
    let ans = ''
    for (let i = 0; i < int; i++){
        ans += str
    }
    return ans
}


// Get запрос
export function get(href, params, func) {
    let xhr = new XMLHttpRequest();
    
    xhr.open("GET", href + params, true);

    xhr.onreadystatechange = func;
        
    xhr.send();

    return xhr
}


export function delete_zeros(str) {
    let s = ""
    let i = 0
    while (str[i] == "0"){
        i++
    }
    
    for (i; i < str.length; i++){
        s += str[i]
    }

    return s
}