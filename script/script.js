// The smaller boards are subboards. Their squares are subtics.
// The large board is bigboard. Its squares are bigtics.
//		//* denotes a console.log line (optional; used for debugging)

$(document).ready(function() {
// Uncomment to css test a completed subboard
	// $('table.1').html('o');
	// bigtics[1].classList.add("subWon");

//begin game from homepage
	$('#start').click( function() {
		$('#welcome').animate({
      	bottom: '-50%'
 		}, 100, function() {
 			$('#welcome').addClass("hide");
 			$('#boutcontainer').addClass("hide");
 			$('#aboutbutton').addClass("hide");
 			$('#game').removeClass("hide");
 		});
	});

//home instructions button
	$('#howto').click( function() {
		$('#welcome').transition({
      	x: '500px'
 		}, 700, 'ease', function() {
 			$('#welcome').addClass("hide");
 			$('#instructions1').removeClass("hide");
 			$('#aboutbutton').addClass("hide");
 			$('#boutcontainer').addClass("hide");
 		});
	});
//first instruction next button
	$('#next1').click( function() {
		$('#instructions1').transition({
      	opacity: 0
 		}, 100, function() {
 			$('#instructions1').addClass("hide");
 			$('#instructions2').removeClass("hide");
 		});
	});
//second instruciton next button
	$('#next2').click( function() {
		$('#instructions2').transition({
      	opacity: 0
 		}, 100, function() {
 			$('#instructions2').addClass("hide");
 			$('#instructions3').removeClass("hide");
 		});
	});
//good luck/start button
	$('#start2').click( function() {
		$('#instructions3').transition({
      	x: '-1000px'
 		}, 700, 'ease', function() {
			$('#instructions3').addClass("hide");
			$('#game').removeClass("hide");
		});
	});

//about triggers
$ab = $('#about');
	$('#aboutbutton').mouseenter( function() {
		$ab.toggleClass("hide");
		$('.abouttxtindiv').arctext({radius: 390});
	});

	$('#aboutbutton').mouseleave( function() {
		$('#boutcontainer').fadeOut('slow', function() {
			$ab.addClass("hide");
			$('#boutcontainer').fadeIn('fast');
		});
	});

//======================================
//				  GAME BEHAVIOR
//======================================
	$('.subtic').click( function() {

	//===CHECKS IF CLICK IS VALID===	
		//If the subtic hasn't yet been played
		if (!$(this).hasClass("complete")) {
		//tacNumber: the number ID of the active bigtic
		//Found by getting the first character in this' class list
			var tacNumber = parseInt(($(this).attr('class'))[0]);
		//If the active bigtic is valid for play
			if (!bigtics[tacNumber].classList.contains("invalid")) {

		//===CLICK IS GOOD===
		//Determines user and updates board inner html
				var user = null;
				if (isEven(turn)) {
					$(this).html("X");
					user = "x";
				} else {
					$(this).html("O");
					user = "o";
				}
			//Increments turn
				turn++;
			//Adds 'complete' class to the subtic
				$(this).addClass("complete");
			//ticNumber: the number ID of the clicked subtic
				var ticNumber = parseInt($(this).attr('id'));
			//tacString: the id of the active bigtic in string form
				var tacString = ($(this).attr('class'))[0];
				console.log("Subtic #: "+$(this).attr('id')); //*
				console.log("Bigtic #: "+tacNumber); //*
			//tacArray: the status array of the active subtable
				var tacArray = statusArrays[tacNumber];

			//Increments the subclick array item correlated with # times subboard has been played
			//Later used to determine when there is a subboard tie
				subclicks[tacNumber]++;
				console.log("Subtic played "+subclicks[tacNumber]+" times"); //*

		//====SUBBOARD UPDATERS AND CHECKERS=====
		//Update status array for the subboard
				tacArray[ticNumber] = user;
				console.log("Subtable status array: "+tacArray); //*
		//If the subboard has been won
				if (checkWin(tacArray)) {
					bigStatus[tacNumber]=user;
					$('table.'+tacString).html(user); //Adds large X or O to bigtic
					bigtics[tacNumber].classList.remove("invalid");
					bigtics[tacNumber].classList.add("subWon");
					completedSubs++; //increments completedSubs
					console.log("*User "+user+" has won subboard "+tacNumber); //*
					console.log("*Board status is now "+bigStatus); //*
					console.log("*Number of completed subboards is "+completedSubs); //*
				}
		//If the subboard has been tied
				if(subclicks[tacNumber] === 9) {
					$('table.'+tacString).html(":("); //Adds :( to bigtic
					bigtics[tacNumber].classList.remove("invalid");
					bigtics[tacNumber].classList.add("subWon");
					completedSubs++; //increments completedSubs
					console.log("*Subboard tie"); //*
					console.log("*Number of completed subboards is now "+completedSubs); //*
				}

		//====WIN/TIE CHECKERS====
			//If someone has won the whole game
				if (checkWin(bigStatus)) {
					console.log(user+" WINS!"); //*
			//If the whole game has been tied
				} else if (completedSubs === 9) {
					console.log("TIE GAME"); //*

		//====NEXT MOVE SETUP===
			//Else, update valid square to play in
				} else {
					console.log("...starting big win check/next move setup"); //*
					var thisSqClasses;
				//Adds "invalid" class to bigtics with an id that does not match
				//  the id of the subtic just played
				//Removes "invalid" class from the matching bigtic

					var c=0;
					var w =0;

					function delayedRemoveAdd() {
						bigtics[c].classList.remove("invalid");
						//bigtics[c].classList.remove("flash");
						if (++c > 8) { 
							delayedAdd();
							return; }
						window.setTimeout(delayedRemoveAdd, 20);
					}

					function delayedAdd() {
						if (w != ticNumber) { //if a bigtic id does not match that of the sq just played
							//bigtics[w].classList.add("flash");
							bigtics[w].classList.add("invalid"); //adds invalid
							bigtics[w].classList.remove("active"); //removes active
							
						} else {
							//bigtics[w].classList.add("flash");
							bigtics[w].classList.remove("invalid");
							bigtics[w].classList.add("active"); //adds invalid
							thisSqClasses = bigtics[w].classList; //classlist of the now-active bigtic
							console.log(thisSqClasses);
						}
						if (++w > 8) { 
							for (var z=0; z<thisSqClasses.length; z++) {
								console.log("...checking if class "+thisSqClasses[z]+" = subWon"); //*
								if (thisSqClasses[z] === "subWon") {
									console.log("...removing invalid class from all bigtics"); //*
									for (var u=0; u<bigtics.length; u++) {
										//bigtics[u].classList.add("flash");
										bigtics[u].classList.remove("invalid");
										bigtics[u].classList.add("active");
									}
								}
							}
							return; 
						}
						window.setTimeout(delayedAdd, 20);
					}
		
					if (turn === 1) {
						w=0;
						delayedAdd();
					} else {
						delayedRemoveAdd();
					}
					console.log(thisSqClasses);



					// for (var w=0; w<bigtics.length; w++) {
					// 	if (bigtics[w].id != ticNumber) { //if a bigtic id does not match that of the sq just played
					// 		bigtics[w].classList.add("invalid"); //adds invalid
					// 	} else {
					// 		bigtics[w].classList.remove("invalid");
					// 		thisSqClasses = bigtics[w].classList; //classlist of the now-active bigtic
					// 	}
					// 	sleep(1000);
					// }
				//Checks to see if the "valid" bigtic has already been won or tied
				//If so, removes the invalid class from all bigtics
					// for (var z=0; z<thisSqClasses.length; z++) {
					// 	console.log("...checking if class "+thisSqClasses[z]+" = subWon"); //*
					// 	if (thisSqClasses[z] === "subWon") {
					// 		console.log("...removing invalid class from all bigtics"); //*
					// 		for (var u=0; u<bigtics.length; u++) {
					// 			bigtics[u].classList.remove("invalid");
					// 		}
					// 	}
					// }
				}
			} //closes 'invalid' check
		} //closes 'if complete'  check
	}); //closes subtic click listener
var bigtics = $('.bigtic').toArray();

//      =====TRACKER SETUP=====
//statusArrays returns an array of arrays.
//Each array represents each of the subboards' trackers. 
//[0] is the upper left, [1] is the upper middle, etc.
//bigStatus is the tracker of the whole board.
	var statusArrays = []; //array of tracker arrays
	var subclicks = []; //array with # times subboards have been played
	var bigStatus = []; //tracker of bigboard
	for (var j=0; j<9; j++) {
		subclicks[j]=0; //array of 9 zeros
		bigStatus[j]=j; //tracker array for bigboard
	}
	for (var n=0; n<9; n++) {
		statusArrays[n]=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	} 
	var completedSubs = 0; //used to track # of subtables completed
	var turn = 0; //used to track who's turn it is


//======================================
//				   FUNCTIONS
//======================================
function isEven(num) {
	if (num%2 === 0) { return true; }
	else { return false; }
}

//Enter a tracker array. Returns true if there is a win.
	function checkWin(array) { 
		if (array[0] === array[1] && array[1] === array[2] //horiz a
			|| array[3] === array[4] && array[4] === array[5] //horiz b
			|| array[6] === array[7] && array[7] === array[8] //horiz c
			|| array[0] === array[3] && array[3] === array[6] //vert 1
			|| array[1] === array[4] && array[4] === array[7] //vert 2
			|| array[2] === array[5] && array[5] === array[8] //vert 3
			|| array[0] === array[4] && array[4] === array[8] //diag a
			|| array[6] === array[4] && array[4] === array[2]) //diag b
		{
			return true;
		} else {
			return false;
		}
	}


//======================================
//				     TRANSIT
//======================================




}); //CLOSE JQUERY


//Dryup opportunities
		//function that removes invalid class (used twice)
		//function that 

// //FUNCTION TO RESET THE SQUARES
// //any squares that have been clicked (and thus need to be reset) will have a "complete" and an
// //"x" or "o" class.
// //this function identifies these squares by measuring their classLists.
// //if a square's classList has more than 2 items, its superfluous classes are removed.
// 	function reset(arr) {
// 	for (var n=0; n<arr.length; n++) {
// 		if (arr[n].classList.length > 2) {
// 			if (arr[n].classList[2] == "x") {
// 				arr[n].classList.remove("x");
// 			}
// 			if (arr[n].classList[2] == "o") {
// 				arr[n].classList.remove("o");
// 			}
// 			if (arr[n].classList[1] == "complete") {
// 				arr[n].classList.remove("complete");
// 			}
// 			subtics[n].innerHTML = "";
// 		}
// 		console.log(arr[n].classList);
// 	}
// }


// });




