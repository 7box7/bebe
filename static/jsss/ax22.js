import * as mainObj from './main_src.js'
import * as needs from './all_need_funcs.js'



// Пренастройки
needs.start_settings(canvas, document.getElementsByClassName("container")[0])


// Линейная фенкция
function ax(obCanvas, params, x1, color, linewidth, cell, center, now1, now2) {
    let xglob = (x1 - center[0] - now1) / cell
    let yglob = params[0] ** xglob
    needs.draw_point(obCanvas, x1, -yglob * cell + center[1] + now2, color, linewidth / 2)
}


mainObj.main(ax, [1])

needs.set_slider("aslid", "a", mainObj, 0)
