//Array.remove() function
Array.prototype.remove = function (index) { return this.splice(index, 1); }
//Array.contains() function
Array.prototype.contains = function (item, strict) {
    var contained = false;
    createOwnedLoop(this, this, function (i) {
        if ((this[i] == item && !strict) || this[i] === item) {
            contained = true;
            return "exit loop";
        }
    });
    return contained;
}
//PointToward function
function pointToward(x1, y1, x2, y2) {
    if (x2 >= x1) return atan((y2 - y1) / (x2 - x1)) + (Math.PI * 0.5);
    else return atan((y2 - y1) / (x2 - x1)) + (Math.PI * 1.5);
}
//Loop function
function createOwnedLoop(owner, count, loop) {
    var counter;
    if (typeof count == 'number') counter = count;
    else if (count.constructor === Array) counter = count.length;
    else throw new Error("Unexpected count for createOwnedLoop().");
    if (typeof loop != 'function') throw new Error("Unexpected type for loop function in createOwnedLoop().");
    while (counter > 0) {
        counter--;
        var exit;
        if (typeof owner == 'object')
            exit = loop.call(owner, counter);
        else
            exit = loop(counter);
        if (exit == "exit" || exit == "exit loop" || exit == "break" || exit == "break;")
            break;
    }
}
function createLoop(count, loop) {
    var counter;
    if (typeof count == 'number') counter = count;
    else if (count.constructor === Array) counter = count.length;
    else throw new Error("Unexpected count for createLoop().");
    if (typeof loop != 'function') throw new Error("Unexpected type for loop function in createLoop().");
    while (counter > 0) {
        counter--;
        var exit = loop(counter);
        if (exit == "exit" || exit == "exit loop" || exit == "break" || exit == "break;")
            break;
    }
}
//displayText function
function displayText(txt) {
    push();
    fill("#FFFFFF");
    textSize(48);
    textFont(font);
    textAlign(CENTER);
    text(txt, 0, 0, width, 300);
    pop();
}

//cookies
function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}