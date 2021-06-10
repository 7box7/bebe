import * as needs from './all_need_funcs.js'

var config = {

    // Фон
    background_color: "#2297B7",

    // Точкa
    point_color: "#ffffff",
    point_radius: 30,
    point_coordinates: [],
    
    // Прицел
    target_color: "#ff0000",
    target_radius: 10,
    target_coordinates: [],
    

    // Рандомные точки
    point: [],

    // Скорость точки и ускорение
    speed: 5,
    speeds: [0, 0],
    a: 0,
    as: [0, 0],
    time: 0,

    // Canvas and Object of canvas
    canvas: document.getElementById("canvas"),
    obCanvas: document.getElementById("canvas").getContext('2d'),
}









var first_click = true
var second_click = false
var id = 0
var collab = false
var collab_pont = 0
var checked = false
main()


// Нахождение скорости
function find_speed(x1, y1, x2, y2){
    let s = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
    let a = (config.speed ** 2 * -1) / (2 * s)
    let t = config.speed / a

    let ax = (2 * a ** 2 * (x2 - x1)) / (config.speed ** 2)
    let ay = (2 * a ** 2 * (y2 - y1)) / (config.speed ** 2)
    

    let speedx = -ax * t
    let speedy = -ay * t

    config.as = [ax, ay]
    config.speeds = [speedx, speedy]

}

// Нахождение скорости
function find_a(t){
    speedx = config.speeds[0]
    speedy = config.speeds[1]
    ax = speedx / t
    ay = speedy / t
    config.as = [ax, ay]
}

function draw_points(){
    needs.draw_point(config.obCanvas, config.point_coordinates[0], config.point_coordinates[1], config.point_color, config.point_radius)
    needs.draw_point(config.obCanvas, config.target_coordinates[0], config.target_coordinates[1], config.target_color, config.target_radius)
    let point = config.point
    needs.draw_point(config.obCanvas, point[0], point[1], config.point_color, config.point_radius)
}


function move(){
    let c = config.point_coordinates
    let speeds = config.speeds
    if (collab !== true){
        config.point_coordinates = [c[0] + speeds[0], c[1] + speeds[1]]
        let ax = speeds[0] - config.as[0]
        let ay = speeds[1] - config.as[1]
        config.speeds[0] = ax
        config.speeds[1] = ay
        if (Math.abs(speeds[0]) - Math.abs(config.as[0]) > 0.0){
            config.speeds[0] = ax
        } else{
            config.speeds[0] = 0
        }

        if (Math.abs(speeds[1]) - Math.abs(config.as[1]) > 0.0){
            config.speeds[1] = ay
        } else{
            config.speeds[1] = 0
        }
        if (config.speeds[0] == 0 && config.speeds[1] == 0){
            second_click = true
            clearInterval(id)
        }

        let coors = config.point_coordinates
        let point = config.point
        config.point = [point[0] + point[2], point[1] + point[3], point[2], point[3]]
        if (checked != true){
            if (Math.sqrt((coors[0] - point[0]) ** 2 + (coors[1] - point[1]) ** 2) < config.point_radius * 2){
                collab = true
                collab_pont = point
            }

        }
        
    } else {
        let delta_x = collab_pont[0] - c[0]
        let delta_y = collab_pont[1] - c[1]
        
        let alpha = ((delta_x * speeds[0]) + (delta_y * speeds[1])) / (
            Math.sqrt((delta_x ** 2) + (delta_y ** 2)) * Math.sqrt((speeds[0]) ** 2 + (speeds[1] ** 2))
            )
        
        
        
        let deg_speed = Math.abs(speeds[0]) / Math.sqrt((speeds[0] ** 2) + (speeds[1] ** 2))
        let y = Math.asin(deg_speed)
        let b = Math.asin(alpha)
        let v = Math.acos(alpha)
        console.log("-------------------")
        console.log(b * 180 / Math.PI, v * 180 / Math.PI)
        

        let new_y_speed = speeds[1] / 2
        let new_x_speed = speeds[0] / 2
        config.speeds = [new_x_speed * Math.cos(-b) - new_y_speed * Math.sin(-b), new_x_speed * Math.sin(-b) + new_y_speed * Math.cos(-b)]
        let point = config.point
        config.point = [point[0], point[1], new_x_speed * Math.cos(b) - new_y_speed * Math.sin(b), new_x_speed * Math.sin(b) + new_y_speed * Math.cos(b)]


        
        config.as = [config.as[0] / 2 * Math.cos(-b) - config.as[1] / 2 * Math.sin(-b), config.as[0] / 2 * Math.sin(-b) + config.as[1] / 2 * Math.cos(-b)]
        config.point_coordinates = [c[0] + config.speeds[0], c[1] + config.speeds[1]]
        
        if (Math.sqrt((c[0] + config.speeds[0] - point[0] - config.point[2]) ** 2 + (c[1] + config.speeds[1] - point[1] - config.point[3]) ** 2) < config.point_radius * 2){
            b = -b
            console.log("hi")
            config.speeds = [new_x_speed * Math.cos(-b) - new_y_speed * Math.sin(-b), new_x_speed * Math.sin(-b) + new_y_speed * Math.cos(-b)]
            config.point = [point[0], point[1], new_x_speed * Math.cos(b) - new_y_speed * Math.sin(b), new_x_speed * Math.sin(b) + new_y_speed * Math.cos(b)]
            config.as = [config.as[0] / 2 * Math.cos(-b) - config.as[1] / 2 * Math.sin(-b), config.as[0] / 2 * Math.sin(-b) + config.as[1] / 2 * Math.cos(-b)]
        }
        
        collab = false
        checked = true
    }
    
    
}


function random_point(){
    let x = needs.random_x_y(config.point_radius, config.canvas.width)
    let y = needs.random_x_y(config.point_radius, config.canvas.height)
    needs.draw_point(config.obCanvas, x, y, config.point_color, config.point_radius)
    config.point = [x, y, 0, 0]
}

function redraw(){
    needs.back_draw(config.obCanvas, config.background_color, config.canvas.width, config.canvas.height)
    move()
    draw_points()
    needs.draw_line(config.obCanvas, config.point[0], config.point[1], config.point_coordinates[0], config.point_coordinates[1], "#000000", 10)
    needs.draw_line(config.obCanvas, config.target_coordinates[0], config.target_coordinates[1], config.point_coordinates[0], config.point_coordinates[1], "#0000ff", 10)
}

function main(){
    needs.start_settings(config.canvas)
    
    
    needs.back_draw(config.obCanvas, config.background_color, config.canvas.width, config.canvas.height)
    random_point()

    function clicks(e){
        if(first_click == true){
            needs.draw_point(config.obCanvas, e.x, e.y, config.point_color, config.point_radius)
            second_click = true
            first_click = false
            config.point_coordinates = [e.x, e.y]
        } else if (second_click == true){
            clearInterval(id)
            needs.draw_point(config.obCanvas, e.x, e.y, config.target_color, config.target_radius)
            config.target_coordinates = [e.x, e.y]
            find_speed(config.point_coordinates[0], config.point_coordinates[1], e.x, e.y)
            id = setInterval(redraw, 10);
        }
        
        
    }
    window.addEventListener("mousedown", clicks)
}