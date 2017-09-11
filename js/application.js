// Wait till the browser is ready to render the game (avoids glitches)
//window.requestAnimationFrame(function () {
//  new GameManager(4, 0, KeyboardInputManager, HTMLActuator, LocalStorageManager);
//});

window.requestAnimationFrame(function () {
  new GameManager(4, 0, KeyboardInputManager, HTMLActuator, LocalStorageManager);
});

