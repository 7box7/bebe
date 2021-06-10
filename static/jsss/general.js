import * as needs from './all_need_funcs.js'

var config = {
    background_color: 'rgb(39, 94, 109)',
    points_color_old: "rgba(255, 255, 255, ",
    points_color: "rgba(255, 255, 255, ",
    change_color: "rgba(255, 203, 138, ",
    change_color_old: "rgba(255, 203, 138, ",
    min_speed: -0.9,
    max_speed: 0.9,

    min_radius: 10,
    max_radius: 60,
    dots: 200,

    
    
    // Canvas and Object of canvas
    canvas: document.getElementById("canvas"),
    obCanvas: document.getElementById("canvas").getContext('2d'),
    

}

var coordinates_dots = []


function generate_speed(){
    let speed = random_x_y(config.min_speed, config.max_speed)
    while (speed == 0){
        speed = random_x_y(config.min_speed, config.max_speed)
    }
    return speed
}

function generate_radius(){
    let radius = random_x_y(config.min_radius, config.max_radius)
    while (radius == 0){
        radius = random_x_y(config.min_radius, config.max_radius)
    }
    return radius
}

// Рандомное число в интервале от x до y
function random_x_y(x, y){
    return Math.random() * (y - x) + x
}



// Рисование точки
function draw_dot(x, y, radius, color){
    config.obCanvas.beginPath()
    config.obCanvas.arc(    x, 
                            y,
                            radius,
                            0, 
                            Math.PI * 2)
                        ;
    config.obCanvas.fillStyle = color;
    config.obCanvas.fill();
    config.obCanvas.closePath();
}


// Рисует рандомно точки
function random_dots() {
    let alpha = random_x_y(0, 1)
    let radius = generate_radius()
    let x = random_x_y(radius + 1, config.canvas.width - 1 - radius)
    let y = random_x_y(radius + 1, config.canvas.height - 1 - radius)
    let speed_x = generate_speed()
    let speed_y = generate_speed()
    
    coordinates_dots.push([x, y, [speed_x, speed_y], radius, alpha + ")"])
}

// Задний фон
function back(){
    config.obCanvas.beginPath()
    config.obCanvas.rect(0, 0, config.canvas.width, config.canvas.height);
    config.obCanvas.fillStyle = config.background_color;
    config.obCanvas.fill();
    config.obCanvas.closePath();
}


// Отрисовка всех тчоек
function draw_all_dots(){
    let b = coordinates_dots
    for (let i = 0; i < config.dots; i++){
        let xy = b[i]
        draw_dot(xy[0], xy[1], xy[3], config.points_color + xy[4])
    }
}

// Перерисовка
function redraw(){
    back()
    move()
    draw_all_dots()
}

// Движение точек
function move(){
    let choice = 0
    let point = 0
    for (let i = 0; i < config.dots; i++){
        let point = coordinates_dots[i]
        choice = [-parseInt(random_x_y(0, 1)), parseInt(random_x_y(0, 1))]
        point[2][0] += choice[parseInt(random_x_y(0, 2))]
        point[2][1] += choice[parseInt(random_x_y(0, 2))]
        point[0] += point[2][0] 
        point[1] += point[2][1]
        

        if (point[0] > config.canvas.width + point[3]){
            point[0] = -point[3]
            let speed_x = generate_speed()
            point[2][0] = speed_x
        }
        else if (point[0] < 0 - point[3]){
            point[0] = config.canvas.width + point[3]
            let speed_x = generate_speed()
            point[2][0] = speed_x
        }


        if (point[1] > config.canvas.height + point[3]){
            point[1] = -point[3]
            let speed_y = generate_speed()
            point[2][1] = speed_y
        }
        else if (point[1] < 0 - point[3]){
            point[1] = config.canvas.height + point[3]
            let speed_y = generate_speed()
            point[2][1] = speed_y
        }


    }
}


function show_buttons(req){
    let ans = ''
    let first_ans = ''
    for (let i = 0; i < req.topics.length; i++){
        let id = ''
                    
        if (req.topics[i].importance == 2){
            id = 'id="red"'
        }
                    
        if (req.topics[i].redirect == 0){
            if (req.topics[i].importance == 2){
                id = 'id="red"'
                first_ans +=`<div ${id} class='block' onclick="location.href='#${req.topics[i].id}'"><p id='${req.topics[i].id}:${req.topics[i].lvl}'>${req.topics[i].name}</p><img src="/static/${req.topics[i].photo}" /></div>`
            } else {
                ans +=  `<div ${id} class='block' onclick="location.href='#${req.topics[i].id}'"><p id='${req.topics[i].id}:${req.topics[i].lvl}'>${req.topics[i].name}</p><img src="/static/${req.topics[i].photo}" /></div>`
            }
                        
        } else {
            if (req.topics[i].importance == 2){
                id = 'id="red"'
                first_ans += `<div ${id} class='block' onclick="location.href='/${req.topics[i].redirect}'"><p id='${req.topics[i].id}:${req.topics[i].lvl}'>${req.topics[i].name}</p><img src="/static/${req.topics[i].photo}" /></div>`
            } else {
                ans +=  `<div ${id} class='block' onclick="location.href='/${req.topics[i].redirect}'"><p id='${req.topics[i].id}:${req.topics[i].lvl}'>${req.topics[i].name}</p><img src="/static/${req.topics[i].photo}" /></div>`
            }         
        }     
    }
    
    return [ans, first_ans]
}

var xhr = 0
function check_json(){
    if (xhr.readyState == 4) {
        var status = xhr.status;
        if (status == 200) {
            let t = document.getElementById("blocks");
            let req = JSON.parse(xhr.responseText)
            let ans = show_buttons(req)

            t.innerHTML = ans[1] + ans[0]
            t = document.getElementsByClassName("allin")[0];

            config.canvas.width = t.offsetWidth ;
            config.canvas.height = t.offsetHeight;
        }
    }
}

function new_blocks(hash){   
    
    xhr = needs.get('/get_topics/', hash, check_json)
    
}

function get_hash(){
    let hash = location.hash.split("#")[1]
    if (hash){
        new_blocks(hash)
    } else {
        new_blocks(0)
    }
}

window.addEventListener('hashchange', function(e) {
    get_hash()
});


// Наяальные настрйоки на сайте
function start_settings(){
    let t = document.getElementsByClassName("allin")[0];

    config.canvas.width = t.offsetWidth ;
    config.canvas.height = t.offsetHeight;

    back()
    for (let i = 0; i < config.dots; i++){
        random_dots()
        draw_dot(coordinates_dots[i][0], coordinates_dots[i][1], coordinates_dots[i][3], config.points_color + coordinates_dots[i][4])
    }
    

    setInterval(redraw, 10);
}

function main() {
    get_hash()
    start_settings()
}
window.onload = main

window.onresize = function() {
    let t = document.getElementsByClassName("allin")[0];

    config.canvas.width = t.offsetWidth ;
    config.canvas.height = t.offsetHeight;
};


document.getElementById("topic_name_input").oninput = function () {
    if (this.value){
        xhr = needs.get('/get_topic_by_name/?topic=', this.value, check_exp)

    } else {
        new_blocks(0)
    }

}




function check_exp(){
    if (xhr.readyState == 4) {
        var status = xhr.status;
        if (status == 200) {
            let t = document.getElementById("blocks");
            let req = JSON.parse(xhr.responseText)
            let ans, first_ans = show_buttons(req)
            
            t.innerHTML = first_ans + ans
            t = document.getElementsByClassName("allin")[0];

            config.canvas.width = t.offsetWidth ;
            config.canvas.height = t.offsetHeight;
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

