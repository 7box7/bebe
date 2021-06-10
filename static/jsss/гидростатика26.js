import * as mainObj from './main_src.js'
import * as needs from './all_need_funcs.js'



// Пренастройки
needs.start_settings(canvas, document.getElementsByClassName("container")[0])


// Линейная фенкция
function kx_b(obCanvas, params, x1, color, linewidth, cell, center, now1, now2) {
    let xglob = (x1 - center[0] - now1) / cell
    let yglob = params[0] * (xglob) + params[1]
    needs.draw_point(obCanvas, x1, -yglob * cell + center[1] + now2, color, linewidth / 2)
}


mainObj.main(kx_b, [1, 0])


needs.set_slider("kslid", "k", mainObj, 0)