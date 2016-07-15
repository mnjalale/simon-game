$(document).ready(function(){
  var gameIsOn = false,strictModeIsOn=false;
  var controlButtons = [
    { 'position': 'topLeft','highlightColor':'#13FF7C','audioId':'topLeftAudio'},
    { 'position': 'topRight','highlightColor':'#FF4C4C','audioId':'topRightAudio'},
    { 'position': 'bottomLeft','highlightColor':'#FED93F','audioId':'bottomLeftAudio'},
    { 'position': 'bottomRight','highlightColor':'#1C8CFF','audioId':'bottomRightAudio'}
  ];
  var systemSequence = [], userSequence = [];
  var gameCount = 0,userCount = 0,counter =0;
  var timeInterval=null;
  var context;
  var bufferLoader;
  var audio=null;
  var warningSound= {'audioId':'warningAudio'};
  var completionSound= {'audioId':'completionAudio'}
  var wrongButtonPress = false;
  var soundSource = null;

  function playSound(audioId){
    audio = document.getElementById(audioId);
    audio.play();
  }

  function stopSound(){
    if(audio!==null){
      audio.pause();
    }
  }

  $('#displayOutput').css('color','#430710');

  $('.toggle-button').click(function() {
    $(this).toggleClass('toggle-button-selected');
    gameIsOn = !gameIsOn;
    if(gameIsOn===true){
      $('#displayOutput').removeAttr('style');
    }else{
      switchOffGame();
    }

  });

  $('#startButton').click(function(){
    startGame();
  });

  $('#strictButton').on('click',function(){
    if(gameIsOn===true){
      strictModeIsOn = !strictModeIsOn;
      if(strictModeIsOn===true){
        $('#strictButtonState').css('background-color','red');
      }else{
        $('#strictButtonState').removeAttr('style');
      }
    }
  });

  $('#topLeft')
    .click(function(){
    processUserClick('topLeft');
  })
    .mousedown(function(){
    highlightButton('topLeft');
  })
    .mouseup(function(){
    unhighlightButton('topLeft')
  });

  $('#topRight')
    .click(function(){
    processUserClick('topRight');
  })
    .mousedown(function(){
    highlightButton('topRight');
  })
    .mouseup(function(){
    unhighlightButton('topRight');
  });

  $('#bottomLeft')
    .click(function(){
    processUserClick('bottomLeft');
  })
    .mousedown(function(){
    highlightButton('bottomLeft');
  })
    .mouseup(function(){
    unhighlightButton('bottomLeft');
  });

  $('#bottomRight')
    .click(function(){
    processUserClick('bottomRight');
  })
    .mousedown(function(){
    highlightButton('bottomRight');
  })
    .mouseup(function(){
    unhighlightButton('bottomRight');
  });

  function startGame(){
    if(gameIsOn){
      systemSequence = [];
      gameCount=0;
      $('#displayOutput').html('--');
      $('#displayOutput').addClass('blink');
      setTimeout(function(){
        $('#displayOutput').removeClass('blink');
        pickNextItem();
        runGameSequence();

      },2000);

    }
  }

  function processUserClick(id){
    if(userCount<gameCount){
      userCount++;
      clearInterval(timeInterval);
      if(systemSequence[userCount-1].position===id){
        if(userCount===gameCount){
          if(userCount===20){
            //End game
            gameIsWon();
          }else{
            //Start another sequence
            setTimeout(function(){
              userCount=0;
              pickNextItem();
              runGameSequence()
            },1000);
          }
        }else{
          startCounter();
        }
      }else{
        //reset and rerun sequence
        resetGame();
      }
    }else{
      userCount=0;
    }
  }

  function pickNextItem(){
    gameCount++;
    var displayOutput = gameCount<=9?'0' + gameCount:gameCount;
    $('#displayOutput').html(displayOutput);

    var position = Math.floor(Math.random()*4+1);
    systemSequence.push(controlButtons[position-1]);
  }

  function startCounter(){
    counter=5;
    timeInterval=setInterval(function() {
      counter--;
      if (counter === 0) {
        clearInterval(timeInterval);
        resetGame();
      }
    }, 1000);
  }

  function highlightButton(id){
    var index=0;
    switch(id){
      case 'topLeft':
        index=0;
        break;
      case 'topRight':
        index=1;
        break;
      case 'bottomLeft':
        index=2;
        break;
      case 'bottomRight':
        index=3;
        break;
    }

    $('#' + controlButtons[index].position).css('background-color',controlButtons[index].highlightColor);

    var sound=null;
    if(wrongButtonPress===true){
      sound=warningSound.audioId;
    }else{
      sound=controlButtons[index].audioId
    }
    if(sound!==null){
      playSound(controlButtons[index].audioId);
    }
  }

  function unhighlightButton(id){
    var index=0;
    switch(id){
      case 'topLeft':
        index=0;
        break;
      case 'topRight':
        index=1;
        break;
      case 'bottomLeft':
        index=2;
        break;
      case 'bottomRight':
        index=3;
        break;
    }

    $('#' + controlButtons[index].position).removeAttr('style');
  }

  function runGameSequence(){
    //Change the cursors for the buttons
    $('#topLeft').addClass('game-button-pointer');
    $('#topRight').addClass('game-button-pointer');
    $('#bottomLeft').addClass('game-button-pointer');
    $('#bottomRight').addClass('game-button-pointer');

    runSequence(0);
    function runSequence(index){
      if(systemSequence.length>index){
        highlightButton(systemSequence[index].position);

        setTimeout(function(){
          $('#' + systemSequence[index].position).removeAttr('style');
          index++;
          setTimeout(function(){
            runSequence(index);
          },100);

        },1000);
      }else{
        startCounter();
      }
    }

  }

  function resetGame(){
    userCount =0;
    playSound(warningSound.audioId);
    $('#displayOutput').html('!!');
    $('#displayOutput').addClass('blink');
    setTimeout(function(){
      stopSound();
      $('#displayOutput').removeClass('blink');

      if(strictModeIsOn===true){
        startGame();
      }else{
        var displayOutput = gameCount<=9?'0' + gameCount:gameCount;
        $('#displayOutput').html(displayOutput);
        runGameSequence();
      }
    },3000);
  }

  function gameIsWon(){
    if(timeInterval!==null){
      clearInterval(timeInterval);
    }

    systemSequence=[];
    userSequence=[];
    gameCount=0;
    userCount=0;
    counter=0;
    playSound(completionSound.audioId);
    $('#displayOutput').html('**');
    $('#displayOutput').addClass('blink');

    setTimeout(function(){
      stopSound();
      $('#displayOutput').removeClass('blink');

    },5000);

  }

  function switchOffGame(){
    strictModeIsOn=false;
    if(timeInterval!==null){
      clearInterval(timeInterval);
    }

    systemSequence=[];
    userSequence=[];
    gameCount=0;
    userCount=0;
    counter=0;
    $('#strictButtonState').removeAttr('style');
    $('#displayOutput').css('color','#430710');
    $('#displayOutput').html('--');

    $('#topLeft').removeAttr('style');
    $('#topRight').removeAttr('style');
    $('#bottomLeft').removeAttr('style');
    $('#bottomRight').removeAttr('style');
  }

});