import * as needs from './all_need_funcs.js'



var config = {

    // Фон
    background_color: "#2297B7",

    // Точки сетки
    points_color: "#74E2FF",
    points_radius: 4,
    
    // Оси координат
    axises_color: "#ffffff",

    // Сетка
    cells_color: "#74E2FF",
    cells_line_width: 2,


    // Canvas and Object of canvas
    canvas: document.getElementById("canvas"),
    obCanvas: document.getElementById("canvas").getContext('2d'),


    // Функция графика
    graffic_func: "",
    draw_graffic_func: "",
    parametrs: []
}

// Пренастройки
needs.start_settings(config.canvas, document.getElementsByClassName("container")[0])
var cellGlob = 100
var now_coordinates = [0, 0]
var mouse_x_fix = 0;
var mouse_y_fix = 0;
var central_point = [];
var buffer_dots = []
var now_font = 20
var buffer = false


// Основная сборка
export function main(func, params, cell=100, buff=false, disabled_move=false) {
    
    
    // Задний фон
    needs.back_draw(config.obCanvas, config.background_color, config.canvas.width, config.canvas.height);
	
    config.graffic_func = func
    config.parametrs = params
    cellGlob = cell
    buffer = buff
    
    
    // Точки координат
    let points = cells_draw();

    if (disabled_move == false){
        // Перемещение полотна
        function moving(event){
            now_coordinates[0] += (event.x - mouse_x_fix)
            now_coordinates[1] += (event.y - mouse_y_fix)
            mouse_y_fix = event.y
            mouse_x_fix = event.x
            redraw()
        }

        config.canvas.addEventListener("mousedown", function(event) {
            mouse_x_fix = event.x;
            mouse_y_fix = event.y;
            config.canvas.addEventListener("mousemove", moving);
        })

        config.canvas.addEventListener("click", function() {
            config.canvas.removeEventListener("mousemove", moving);
        })
    }
    

    // График
    draw_axis_ox_oy(points)
   
}



export function screencoors_from_indexes(x, y){
    let x_scr = now_coordinates[0] - (x / now_axis_coordinates[0]) * cellGlob + central_point.begincoors[0]
    let y_scr = now_coordinates[1] - (y / now_axis_coordinates[1]) * cellGlob + central_point.begincoors[1]
    return [x_scr, y_scr]
}


// Рисование линий
export function draw_lines(points, color, linewidth, a, b, c){
    if (points.length > 0){
        config.obCanvas.beginPath()
        config.obCanvas.moveTo(points[0][0], points[0][1])
        for (let i = 0; i < points.length - 1; i++){
            for (let j = 0; j < 25; j++){
                let point = screencoors_from_indexes(points[i][2] + 0.04 * j * now_axis_coordinates[0], get_y_ax2_bx_c(a, b, c, points[i][2] + 0.04 * j * now_axis_coordinates[0]))
                config.obCanvas.lineTo(point[0], point[1])
            }
        }
        config.obCanvas.lineWidth = linewidth;
        config.obCanvas.strokeStyle = color;
        config.obCanvas.stroke();
        config.obCanvas.closePath();
    }
    
}



// Нахождение размера клеточки
export function find_cell_height(height, cell){
    let h = Math.floor(height / 10) * 10;
    for (let i = 1; i < Math.floor(h / 2); i++){
        if (h % i > cell){
            return h % i;
        }
    }

    return 0;

}


// Клетка на фоне
export function cells_draw(){

    // Точки
    let points = []
    
    for (let i = 0; i <= Math.floor(config.canvas.height / cellGlob) + 1; i++){
        let i_cell = cellGlob * i;
        let nc_remain_zero = now_coordinates[0] % cellGlob;
        let nc_remain_one = now_coordinates[1] % cellGlob;
       
        needs.draw_line(config.obCanvas, 0, i_cell + nc_remain_one, config.canvas.width, i_cell + nc_remain_one, config.cells_color, config.cells_line_width)
        
        // Ряд точек
        let l = [];
        for (let j = 0; j <= Math.floor(config.canvas.width / cellGlob) + 1; j++){
            let j_cell = cellGlob * j;


            let point = {
                indexes:  [
                            i, j
                            ],
                begincoors: [   j_cell, 
                                i_cell
                            ],
                screencoors: [  j_cell + nc_remain_zero, 
                                i_cell + nc_remain_one
                            ],

                globalcoors: [  now_coordinates[0] - j_cell - nc_remain_zero, 
                                now_coordinates[1] - i_cell - nc_remain_one
                            ]
            }
            l.push(point)

            if (i == 0){
                needs.draw_line(config.obCanvas, j_cell + nc_remain_zero, 0, j_cell + nc_remain_zero, config.canvas.height, config.cells_color, config.cells_line_width)
            }
        }
        points.push(l)
    }

    let v = Math.floor((points.length - 1) / 2)
    central_point = points[v][Math.floor(points[v].length / 2) - 1]
    return points
}


export function change_config_parametrs(key, value) {
    config.parametrs[key] = value
}
// Оси координат
export function draw_axis_ox_oy(points){

    let b_zero = central_point.begincoors[0] + now_coordinates[0]
    let b_one = central_point.begincoors[1] + now_coordinates[1]
    // Точки сетки
    for (let i = 0; i < points.length; i++){
        for (let j = 0; j < points[i].length; j++){
            let point = points[i][j]
            //draw_point(point.screencoors[0], point.screencoors[1], config.points_color)
            
            let first = (point.globalcoors[0] + central_point.begincoors[0]) / cellGlob;
            let second = (-central_point.begincoors[1]  - point.globalcoors[1]) / cellGlob;
            if (point.screencoors[0] == b_zero ||  point.screencoors[1] == b_one){
                needs.draw_text(config.obCanvas, point.screencoors[0] - 20, point.screencoors[1] + 20, "" + (-first -second), config.axises_color, now_font + "px Verdana")
            }
            
        
        } 
    }
    if (buffer_dots.length > 0){
        for (let i = 0; i < buffer_dots.length; i++){
            let point = buffer_dots[i]
            needs.draw_point(config.obCanvas, point[0] + now_coordinates[0], point[1] + now_coordinates[1], "red", 2)
        }
    } else {
        for (let i = 0; i < config.canvas.width; i++){
            let points = config.graffic_func(config.obCanvas, config.parametrs, i, "red", config.points_radius, cellGlob, central_point.begincoors, now_coordinates[0], now_coordinates[1])
            if (buffer){
                buffer_dots = buffer_dots.concat(points)
            }
        
        }
        
    }

    

   
    
    // Центральная точка
    needs.draw_point(config.obCanvas, b_zero, b_one, config.axises_color, config.points_radius)

    needs.draw_line(config.obCanvas, b_zero, 0, b_zero, config.canvas.height, config.axises_color, config.points_radius)
    needs.draw_line(config.obCanvas, 0, b_one, config.canvas.width, b_one, config.axises_color, config.points_radius)
}








// Квадратичная фенкция
export function ax2_bx_c(a, b, c, x, y) {
    if (y == -0){
        y = 0
    }
    if (y == (a * (x ** 2) + (b * x) + c)){
        return true
    }
    return false
}


// Квадратичная фенкция
export function get_y_ax2_bx_c(a, b, c, x) {
    return a * (x ** 2) + b * x + c
}


// Рисование графика
export function draw_square_graffic(points, color, linewidth, a, b, c){
    let final_points = []
    let old = 0;
    for (let i = 0; i < points.length - 1; i++){
        for (let j = 0; j < points.length - 1; j++){
            if (points[j][2] > points[j + 1][2]){
                old = points[j]
                points[j] = points[j + 1]
                points[j + 1] = old
            }
        }
    }
    if (points.length > 0){
        let point_one = points[0]
        let point_one_scr = screencoors_from_indexes(point_one[2], point_one[3])
        final_points.push([point_one_scr[0], point_one_scr[1], point_one[2], point_one[3]])
        for (let i = 1; i < points.length; i++){
            let point_one = points[i]
            let point_one_scr = screencoors_from_indexes(point_one[2], point_one[3])
            if(final_points[final_points.length - 1][1] == point_one_scr[1]){
                
                point_two_scr = screencoors_from_indexes(-point_one[2] + 1 * now_axis_coordinates[0], get_y_ax2_bx_c(a, b, c, point_one[2] - 1 * now_axis_coordinates[0]))
                final_points.push([point_two_scr[0], point_two_scr[1], -point_one[2] + 1 * now_axis_coordinates[0], get_y_ax2_bx_c(a, b, c, point_one[2] - 1 * now_axis_coordinates[0])])
                
                point_two_scr = screencoors_from_indexes(point_one[2] - 1 * now_axis_coordinates[0], get_y_ax2_bx_c(a, b, c, point_one[2] - 1 * now_axis_coordinates[0]))
                final_points.push([point_two_scr[0], point_two_scr[1], point_one[2] - 1 * now_axis_coordinates[0], get_y_ax2_bx_c(a, b, c, point_one[2] - 1 * now_axis_coordinates[0])])

                
            }
            final_points.push([point_one_scr[0], point_one_scr[1], point_one[2], point_one[3]])
            
        }
        
        let v = points.length - 1
        let point_two_scr = screencoors_from_indexes(points[v][2] + 1 * now_axis_coordinates[0], get_y_ax2_bx_c(a, b, c, points[v][2] + 1 * now_axis_coordinates[0]))
        final_points.push([point_two_scr[0], point_two_scr[1], points[v][2] + 1 * now_axis_coordinates[0], get_y_ax2_bx_c(a, b, c, points[v][2] + 1 * now_axis_coordinates[0])])
        point_two_scr = screencoors_from_indexes(points[0][2] - 1 * now_axis_coordinates[0], get_y_ax2_bx_c(a, b, c, points[0][2] - 1 * now_axis_coordinates[0]))
        final_points.unshift([point_two_scr[0], point_two_scr[1], points[0][2] - 1 * now_axis_coordinates[0], get_y_ax2_bx_c(a, b, c, points[0][2] - 1 * now_axis_coordinates[0])])
    }

    draw_lines(final_points, color, linewidth, a, b, c)
}



// Перерисовка сцены
export function redraw(){
    needs.back_draw(config.obCanvas, config.background_color, config.canvas.width, config.canvas.height);
    let points = cells_draw();
    draw_axis_ox_oy(points)
}