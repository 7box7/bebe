import * as mainObj from './main_src.js'
import * as needs from './all_need_funcs.js'
import * as comp from './complex.js'



// Пренастройки
needs.start_settings(canvas, document.getElementsByClassName("container")[0])

var k = 200
var infinity_border = 200
var check = true


function m_blot(obCanvas, params, x1, color, linewidth, cell, center, now1, now2) {
    let xglob = (x1 - center[0] - now1) / cell
    let yglob = 0
    let points = []
    for (let i = 0; i < document.getElementById("canvas").height; i++){
        yglob = (center[1] - now1 - i) / cell

        let c = {
            x: xglob,
            i: 1,
            y: yglob
        }

        let z = {
            x: 0,
            i: 0,
            y: 0
        }

        check = true
        for (let b = 0; b < k; b++){
            z = comp.sum(comp.multiplication(z, z), c)
            if (comp.abs(z) > infinity_border){
                check = false
                break
            }
                
        }
        if (check){
            needs.draw_point(obCanvas, x1, -yglob * cell + center[1] + now2, color, linewidth / 2)
            points.push([xglob * cell + center[0], -yglob * cell + center[1]])
        }
                
    }
    return points
    
}
    

mainObj.main(m_blot, [1], 300, true, true)
