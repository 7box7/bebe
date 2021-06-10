
// ---------------------------------------Алгебраичсекие операции-----------------------------------------------------

// Сумма комплексных чисел
export function sum(first, second){
    let answer = {
        x: 0,
        i: 1,
        y: 0,
    }
    let f = normalize(first)
    let s = normalize(second)

    answer.x = f.x + s.x  
    answer.y = f.y + s.y  
    
    answer.i = (f.i == 1 || s.i == 1) ? 1 : 0

    return answer
}

// Произведение комплексных чисел
export function multiplication(first, second){
    let answer = {
        x: 0,
        i: 1,
        y: 0,
    }
    let f = normalize(first)
    let s = normalize(second)

    answer.x = f.x * s.x + (f.y * s.y * -1)
    answer.y = f.y * s.x + s.y * f.x  
    
    answer.i = (f.i == 1 || s.i == 1) ? 1 : 0

    return answer
}

// Нахождение модуля комплексного числа
export function abs(comp){
    let c = normalize(comp)

    let z = Math.sqrt(c.x ** 2 + c.i * (-1) * c.y)


    return z
}
















// Нормализация комплексного числа
function normalize(comp){
    let ost = comp.i % 2
    let zel = Math.floor(comp.i / 2)
    let answer = {
        x: comp.x,
        i: ost,
        y: comp.y,
    }
    
    if (ost == 1){
        answer.y = comp.y * ((-1) ** zel)
    } else {
        answer.i = 0
        answer.x += comp.y * ((-1) ** zel)
    }

    return answer
}



// Вывод в консоль комплексного числа
export function complex_console(comp){
    let c = normalize(comp)
    let i = c.i % 2 == 1 ? 'i' : ''
    if (c.y > 0){
        console.log(`z = ${c.x} +${c.y}${i}`)
    } else if (c.y < 0){
        console.log(`z = ${c.x} ${c.y}${i}`)
    } else {
        console.log(`z = ${c.x}`)
    }
}
