/*
--- Day 5: Supply Stacks ---
The expedition can depart as soon as the final supplies have been unloaded from the ships. Supplies are stored in stacks of marked crates, but because the needed supplies are buried under many other crates, the crates need to be rearranged.

The ship has a giant cargo crane capable of moving crates between stacks. To ensure none of the crates get crushed or fall over, the crane operator will rearrange them in a series of carefully-planned steps. After the crates are rearranged, the desired crates will be at the top of each stack.

The Elves don't want to interrupt the crane operator during this delicate procedure, but they forgot to ask her which crate will end up where, and they want to be ready to unload them as soon as possible so they can embark.

They do, however, have a drawing of the starting stacks of crates and the rearrangement procedure (your puzzle input). For example:

    [D]
[N] [C]
[Z] [M] [P]
 1   2   3

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
In this example, there are three stacks of crates. Stack 1 contains two crates: crate Z is on the bottom, and crate N is on top. Stack 2 contains three crates; from bottom to top, they are crates M, C, and D. Finally, stack 3 contains a single crate, P.

Then, the rearrangement procedure is given. In each step of the procedure, a quantity of crates is moved from one stack to a different stack. In the first step of the above rearrangement procedure, one crate is moved from stack 2 to stack 1, resulting in this configuration:

[D]
[N] [C]
[Z] [M] [P]
 1   2   3
In the second step, three crates are moved from stack 1 to stack 3. Crates are moved one at a time, so the first crate to be moved (D) ends up below the second and third crates:

        [Z]
        [N]
    [C] [D]
    [M] [P]
 1   2   3
Then, both crates are moved from stack 2 to stack 1. Again, because crates are moved one at a time, crate C ends up below crate M:

        [Z]
        [N]
[M]     [D]
[C]     [P]
 1   2   3
Finally, one crate is moved from stack 1 to stack 2:

        [Z]
        [N]
        [D]
[C] [M] [P]
 1   2   3
The Elves just need to know which crate will end up on top of each stack; in this example, the top crates are C in stack 1, M in stack 2, and Z in stack 3, so you should combine these together and give the Elves the message CMZ.

After the rearrangement procedure completes, what crate ends up on top of each stack?


 */

const stackInputString = Deno.readTextFileSync("input.txt").split("\n\n").filter(line => line !== "")[0];
const rearrangementSteps = Deno.readTextFileSync("input.txt").split("\n\n").filter(line => line !== "")[1].split("\n").filter(line => line !== "");

// this function finds the largest number in a string
const largestNumber = (string: string) => {
    const numbers = string.split("").filter(char => !isNaN(Number(char))).map(char => Number(char));
    return Math.max(...numbers);
}

const stackLines = stackInputString.split("\n")
//create an array of empty arrays with the length of the biggest number found in the last line
const stackCount = largestNumber(stackLines[stackLines.length - 1])
const stacks = new Array(stackCount).fill("").map(() => new Array<string>());

// fill the stacks array with the letters
// by looping through the lines and adding the letters to the correct stack
// which is determined by the position of the letter in the line
stackLines.forEach(line => {
    const upperCaseLettersWithPositions: {letter: string, position: number}[] = []
    // loop through the line and find all uppercase letters and their position
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        //check if the character is an uppercase alphabet letter
        if (char.match(/[A-Z]/)) {
            upperCaseLettersWithPositions.push({
                letter: char,
                position: i -1 //so the position is 0, which will also return 0 when divided by 4 (4 is the distance between letters)
            })
        }
    }

    // loop through the upperCaseLettersWithPositions and add the letters to the correct stack
    upperCaseLettersWithPositions.forEach(letterWithPosition => {
        const stackNumber = Math.ceil(letterWithPosition.position / 4);
        stacks[stackNumber].unshift(letterWithPosition.letter);
    })
})

console.log("before", stacks);

function moveCrate(from: number, to: number) {
    const crate = stacks[from-1].pop();
    crate && stacks[to-1].push(crate);
}

// this function returns an array of numbers found in a string
const getNumbersFromString = (string: string): number[] => {
    //use a regex to find all numbers in the string
    const numbers = string.match(/\d+/g);
    return numbers ? numbers.map(number => Number(number)) : [];
}

rearrangementSteps.forEach(step => {
    const [numberOfCrates, from, to] = getNumbersFromString(step);
    console.log(numberOfCrates, from, to);
    for (let i = 0; i < numberOfCrates; i++) {
        moveCrate(from, to);
    }
})

console.log("after", stacks);

// combine the last letter of each stack in stacks array to a string
const topLetters = stacks.map(stack => stack[stack.length - 1]).join("");
console.log(topLetters);
