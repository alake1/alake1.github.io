function randomnum(slideIndex) {
    if (slideIndex==1) {
    var notRandomNumbers = [2];
    } else if (slideIndex==2) {
        var notRandomNumbers = [2, 8];
    } else {
        var notRandomNumbers = [2, 4, 8];
    }
    var idx = Math.floor(Math.random() * notRandomNumbers.length);
    return notRandomNumbers[idx];
 }