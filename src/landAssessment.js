function randomArray(length, max) {
  return Array.apply(null, new Array(length)).map(function() {
    return Math.round(Math.random() * max);
  });
}
/* ↑ES5|ES6↓ */

// randomArray = (length, max) => [...new Array(length)]
// .map(() => Math.round(Math.random() * max));

// let stretchOfLand = randomArray(13, 11);
let stretchOfLand = [2,2,3,4,3,3,2,2,1,1,2,5];
// let stretchOfLand = [2];
// let stretchOfLand = [2,2,2];
// let stretchOfLand = [2,2];
// let stretchOfLand = [2,3,2];
// let stretchOfLand = [2,3,3];
// let stretchOfLand = [-3,-3];

let suitablePlace = [];

function landAssessment(arr) {
  let prevVal = undefined;
  let newVal = undefined;
  let difference = [];
  let prevDifference = undefined;
  let newDifference = undefined;

  for (let i = 0; i < arr.length; i++) {
    newVal = arr[i];

    if (prevVal) {
      let current = Math.sign(newVal - prevVal);

      // Such a silly bug on my part to not guard against 0, doh! :(
      // difference.push(Math.sign(newVal - prevVal));

      if (current !== 0) {
        difference.push(current);
      }
    } else {
      suitablePlace.push(newVal);
    }

    prevVal = newVal;
    if (!prevDifference) {
      prevDifference = newDifference;
    }
  }

  for (let i = 0; i <= difference.length; i++) {
    newDifference = difference[i];

    if (prevDifference && newDifference !== prevDifference) {
      suitablePlace.push(arr[i]);
    }

    prevDifference = newDifference;
  }

  return suitablePlace;
}

landAssessment(stretchOfLand);

console.log(`Aequilibrium current land ${stretchOfLand} allows for ${suitablePlace.length} castles in total to be build at these point ${suitablePlace}.`);
