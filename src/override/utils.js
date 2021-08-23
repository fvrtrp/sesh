export function createElement(id, className, parent) {
    let el = document.createElement("div")
    el.id = id || ""
    el.className = className || ""
    if(parent)
        document.querySelector(parent).appendChild(el)
    return el
}