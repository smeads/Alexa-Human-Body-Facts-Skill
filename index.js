/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
        http://aws.amazon.com/apache2.0/
    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Space Geek for a space fact"
 *  Alexa: "Here's your space fact: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Array containing space facts.
 */
var FACTS = [
    "Nerve impulses to and from the brain travel as fast as 170 miles per hour.",
    "The brain operates on the same amount of power as a 10-watt light bulb.",
    "The human brain cell can hold 5 times as much information as the Encyclopedia Britannica.",
    "Your brain uses 20% of the oxygen that enters your bloodstream.",
    "The brain is much more active at night than during the day.",
    "Scientists say the higher your I.Q. the more you dream.",
    "Neurons continue to grow throughout human life",
    "Information travels at different speeds within defferent types of neurons.",
    "The brain itself cannot feel pain.",
    "80% of the brain is water.",
    "Facial hair grows faster than any other hair on the body.",
    "Every day the average person loses 60-100 strands of hair.",
    "Women's hair is about half the diameter of men's hair.",
    "One human hair can support 3.5 ounces.",
    "The fastest growing nail is on the middle finger.",
    "There are as many hairs per square inch on your body as a chimpanzee.",
    "Blondes have more hair.",
    "Fingernails grow nearly 4 times faster than toenails."<
    "The lifespan of a human hair is 3 to 7 years on average.",
    "You must lose over 50% of your scalp hairs before it is apparent to anyone.",
    "Human hair is virtually indestructible, aside from it's fammability.",
    "The largest internal organ is the small intestine.",
    "The human heart creates enough pressure to squirt blood 30 feet.",
    "The acid in your stomach is strong enough to dissolve razorblades.",
    "The human body is estimated to have 60,000 miles of blood vessels.",
    "You get a new stomach lining every three to four days.",
    "The surface area of a human lung is equal to a tennis court.",
    "Women's hearts beat faster than men's.",
    "Scientists have counted over 500 different liver functions.",
    "The aorta is nearly the diameter of a garden hose.",
    "Your left lung is smaller than your right lung to make room for your heart.",
    "You could remove a large part of your internal organs and surive.",
    "The adrenal glands change size throughout life.",
    "Sneezes regulary exceed 100 mph.",
    "Coughs clock in at about 60 mph.",
    "Women blink twice as many times as men do.",
    "A full bladder is roughly the size of a soft ball.",
    "Approximately 75% of human waste is made of water.",
    "Feet have 500,000 sweat glands and can prduce more than a pint of sweat a day.",
    "During your lifetime, you will produce enough saliva to fill two swimming pools.",
    "The average person expels flatulence 14 times each day.",
    "Earwax production is necessary for good ear health.",
    "The largest cell in the human body is the female egg and the smallest is the male sperm.",
    "Your teeth start growing 6 months before you are born.",
    "One out of every 2,000 newborn infants has a tooth when they are born.",
    "A fetus acquires fingerprints at the age of three months.",
    "Every human spent about half an hour as a single cell.",
    "After eating too much, your hearing is less sharp.",
    "About one thrid of the human race has 20-20 vision.",
    "If saliva cannot dissolve something, you cannot taste it.",
    "Women are born better smellers than men and remain better smellers over life.",
    "Your nose can remember 50,000 different scents.",
    "Even small noises cause the pupils of the eyes to dilate.",
    "Everyone has a unique smell, except for identical twins.",
    "The ashes of a cremated person average about 9 pounds.",
    "By the age of 60, most people will have lost about half their tast buds.",
    "Your eyes are always the same size from birth but your nose and ears never stop growing.",
    "By 60 years of age, 60% of men and 40% of women will snore.",
    "A baby's head is one quarter of it's total length, but by age 25 will only be one eighth of it's total length.",
    "Humans can make do longer without food than sleep.",
    "A simple, moderately severe sunburn damages the blood vessels extensively.",
    "Over 90% of diseases are caused or complicated by stress.",
    "A human head remains conscious for about 15 to 20 seconds after it has been decapitated.",
    "It takes 17 muscles to smile and 43 to frown.",
    "Babies are born with 300 bones, but by adulthood they number is reduced to 206.",

];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * SpaceGeek is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Fact = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Fact.prototype = Object.create(AlexaSkill.prototype);
Fact.prototype.constructor = Fact;

Fact.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    //console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

Fact.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    //console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewFactRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
Fact.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    //console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

Fact.prototype.intentHandlers = {
    "GetNewFactIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say tell me a space fact, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new fact from the list and returns to the user.
 */
function handleNewFactRequest(response) {
    // Get a random space fact from the space facts list
    var factIndex = Math.floor(Math.random() * FACTS.length);
    var randomFact = FACTS[factIndex];

    // Create speech output
    var speechOutput = "Here's your fact: " + randomFact;
    var cardTitle = "Your Fact";
    response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var fact = new Fact();
    fact.execute(event, context);
};
