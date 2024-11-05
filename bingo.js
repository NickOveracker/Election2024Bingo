let stateResults = [
    ["Blarizona", false],
    ["Bleorgia", false],
    ["Blichigan", false],
    ["Blevada", false],
    ["Blorth Blarolina", false],
    ["Blennsylvania", false],
    ["Blisconsin", false],
    ["Blexas", false],
    ["Bliowa", false],
    ["Rarizona", false],
    ["Reorgia", false],
    ["Richigan", false],
    ["Revada", false],
    ["Rorth Rarolina", false],
    ["Rennsylvania", false],
    ["Risconsin", false],
    ["Rexas", false],
    ["Riowa", false],
    ["Ted Cruz go Bye-Bye", false],
];
let otherEvents = [
    ['"STOP THE STEAL!" chant', false],
    ['"COUNT THE VOTE!" chant', false],
    ['Violence at polling stations', false],
    ['Roger Stone is suddenly important again', false],
    ['January 6 Redux', false],
    ['Inauguration riot', false],
    ['Pipe bomb discovered', false],
    ['Fascist gang rallies', false],
    ["Trump team argues in court that Harris's nomination was illegal", false],
    ["Trump declares victory before all mail-in ballots are counted", false],
    ["A state legislature considers rejecting popular vote results", false],
    ["A state legislature officially rejects popular vote results", false],
    ["Cable news airs footage of empty ballot drop boxes", false],
    ["Conspiracy theory about 'watermarked' ballots goes viral", false],
    ["Riot at a state capitol building", false],
    ["Trump team sues to stop vote counts in any state", false],
    ["Riot erupts outside a major ballot-counting center", false],
    ["A Trump-aligned state official calls to 'audit' every county", false],
    ["Supreme Court hears emergency election case", false],
    ["County election official goes viral for a press conference", false],
    ["Voting machine company files defamation lawsuit", false],
    ["Riot at a courthouse", false],
    ["'Only LEGAL votes should count!' statement released", false],
    ["A swing state governor defies their state legislature", false],
    ["Trump threatens retribution over the count", false],
    ["Multiple counties delay certification of results", false],
    ["A recount is demanded in at least two states", false],
    ["Fox, Newsmax, or OANN project Trump as winner on first night", false],
    ["Election integrity hotline is flooded with prank calls", false],
    ["National Guard deployed to oversee ballot counts", false],
    ["Judge dismisses election lawsuit with a one-liner", false],
    ["Polling error becomes the story of the night", false],
    ["'Dominion' or 'Smartmatic' trends on Twitter", false],
    ["Anonymous election worker becomes a meme", false],
    ["Trump team challenges voter eligibility in key county", false],
    ["An official calls the election 'illegitimate' on air", false],
    ["State attorney general files election fraud suit", false],
    ["X the Everything App artificially boosts election-related misinformation", false],
    ["A mysterious 'white van' spotted near ballot center", false],
    ["Ballot 'audit' livestream gets tens of thousands of views", false],
    ["Election night map errors lead to wild theories", false],
    ["Third-party candidate briefly trends as the 'spoiler'", false],
    ["Some precincts run out of ballots, sparking outrage", false],
    ["Counting center closed early due to 'security concerns'", false],
    ["Someone suggests military 'intervention' on live TV", false],
];

// Map Twitter usernames to unique numbers. They are limited to 15 characters, so we can do this with multiples of the first 15 primes.
// This one's a Nick Overacker Original (tm) and it's why I make the big bucks in some alternate timeline
nameToInt = function(name) {
    retval = 0;

    primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

    for (let ii = 0; ii < name.length && ii < primes.length; ii++) {
        retval += primes[ii] * name.charCodeAt(ii);
    }

    return retval;
};

// Use this function to generate pseudo-random numbers based on an input seed
// This allows us to generate the same Bingo card every time for a given username
// thx to https://stackoverflow.com/a/29450606/2535523
Math.seed = function(s) {
    let mask = 0xffffffff;
    let m_w = (123456789 + s) & mask;
    let m_z = (987654321 - s) & mask;

    return function() {
        m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
        m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;

        let result = ((m_z << 16) + (m_w & 65535)) >>> 0;
        result /= 4294967296;
        return result;
    }
};

// Shuffle the bingo statements using our new Math.seed function
// thx to https://stackoverflow.com/a/2450976/2535523
let shuffle = function(randomFunc, inputArr) {
    let currentIndex = inputArr.length;
    let randomIndex;
    let arr = [... inputArr];
    
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(randomFunc() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [arr[currentIndex], arr[randomIndex]] = [
            arr[randomIndex], arr[currentIndex]
        ];
    }
    
    return arr;
};

// A pseudo-unique pseudo-randomly generated card for every username
let generateCard = function(name, interesting = false) {
    name = name.replace("@", "");
    name = name.toLowerCase();
    
    let nameCode = nameToInt(name);
    let seededRandom = Math.seed(nameCode);
    let retArr;
    
    if(interesting) {
        // Half infections, half other events
        let arr1 = shuffle(seededRandom, stateResults);
        let arr2 = shuffle(seededRandom, otherEvents);
        retArr  = arr1.slice(0,12).concat(arr2.slice(0,12));
        retArr = shuffle(seededRandom, retArr);
    }
    else {
        // No constraints on number of each category
        // (i.e., usually almost all boring country + infection entries)
        retArr = stateResults.concat(otherEvents);
        retArr = shuffle(seededRandom, retArr);
        retArr = retArr.slice(0, 24);
    }

    retArr.splice(12, 0, ["FREE SPACE", true, "http://www.nyan.cat/index.php?cat=gb"]);
    return retArr;
};

// found the beef for you, @wendys
// Generate a bingo card and display it
let updateCard = function() {
    // Actual card generation step
    card = generateCard(document.getElementById("username-input").value, document.getElementById("interesting-mode-input").checked);

    let tbl = document.getElementById("bingotable");

    // Remove any existing elements (in case a card has already been generated)
    if (tbl.children.length > 0) {
        tbl.children[0].remove();
    }

    // Populate the table
    let tbdy = document.createElement('tbody');

    // Row loop
    for (let ii = 0; ii < 5; ii++) {
        let tr = document.createElement('tr');

        // Column loop
        for (let jj = 0; jj < 5; jj++) {
            let td = document.createElement('td');
            let txt = document.createTextNode(card[ii * 5 + jj][0]);
            
            // Add the bingo cell text
            td.appendChild(txt);

            // Linkify the cell
            if(card[ii * 5 + jj][1]) {
                // Checked-off cells (things that have happened and been verified)
                td.onclick = ((iii, jjj) => {
                    return () => {
                        // Link to news source
                        window.open(card[iii * 5 + jjj][2], '_blank').focus();
                    }
                })(ii, jj);
                td.className = "checked-off";
            } else {
                // Unchecked cells (not yet happened/verified)
                td.onclick = ((iii, jjj) => {
                    return () => {
                        // Link to google search
                        window.open("https://www.google.com/search?q=" + encodeURIComponent(card[iii * 5 + jjj][0]), '_blank').focus();
                    }
                })(ii, jj);
            }
            tr.appendChild(td)
        }
        tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
};
