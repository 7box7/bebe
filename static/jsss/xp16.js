import * as mainObj from './main_src.js'
import * as needs from './all_need_funcs.js'



// Пренастройки
needs.start_settings(canvas, document.getElementsByClassName("container")[0])


// Линейная фенкция
function xp(obCanvas, params, x1, color, linewidth, cell, center, now1, now2) {
    let xglob = (x1 - center[0] - now1) / cell
    let yglob = xglob ** params[0]
    needs.draw_point(obCanvas, x1, -yglob * cell + center[1] + now2, color, linewidth / 2)
}


mainObj.main(xp, [1])

needs.set_slider("pslid", "p", mainObj, 0)
