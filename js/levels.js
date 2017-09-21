function randomnum(slideIndex) {
    if (slideIndex==1) {
    var notRandomNumbers = [2, 2, 2, 2, 2, 4, 8, 8, 8, 8];
    } else if (slideIndex==2) {
        var notRandomNumbers = [2, 2, 2, 2, 4, 4, 4, 8, 8, 8, 8];
    } else {
        var notRandomNumbers = [2, 2, 4, 4, 8, 8];
    }
    var idx = Math.floor(Math.random() * notRandomNumbers.length);
    return notRandomNumbers[idx];
 }