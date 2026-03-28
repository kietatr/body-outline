/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates hand tracking on live video through ml5.handPose.
 */

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const EACH_HAND_REPS = 4;
const EACH_HAND_SCALE = 1 / EACH_HAND_REPS;

let video;
let handPose;
let handDetectionResults = [];
let connections = [];

async function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    // Create the webcam video and hide it
    video = createCapture(VIDEO);
    video.size(CANVAS_WIDTH, CANVAS_HEIGHT);
    video.hide();

    // start detecting hands from the webcam video
    handPose = await ml5.handPose();
    handPose.detectStart(video, (result) => {
        handDetectionResults = result;
        connections = handPose.getConnections();
    });
}

function draw() {
    // Draw the webcam video
    tint(100, 100);
    image(video, 0, 0, width, height);

    for (let i = 0; i < handDetectionResults.length; i++) {
        let hand = handDetectionResults[i];

        if (hand.handedness == "Right") {
            for (let j = 0; j < EACH_HAND_REPS; j++)
            {
                push();
                translate(j*width*EACH_HAND_SCALE, 0);
                scale(0.25);
                drawHand(hand);
                pop();
            }
        }
        else {
            for (let j = 0; j < EACH_HAND_REPS; j++)
            {
                push();
                translate(j*width*EACH_HAND_SCALE, height*EACH_HAND_SCALE);
                scale(0.25);
                drawHand(hand);
                pop();
            }
            
        }
    }
}

function drawHand(hand)
{
    // Draw connection lines
    for (let i = 0; i < connections.length; i++) {
        let connection = connections[i];
        let startKeypoint = hand.keypoints[connection[0]];
        let endKeypoint = hand.keypoints[connection[1]];
        stroke(255, 0, 0, 100);
        strokeWeight(4);
        noFill();
        line(startKeypoint.x, startKeypoint.y, endKeypoint.x, endKeypoint.y);
    }

    // Draw all the tracked hand points
    for (let idxKeypoint = 0; idxKeypoint < hand.keypoints.length; idxKeypoint++) {
        let keypoint = hand.keypoints[idxKeypoint];
        fill(0, 255, 0, 100);
        noStroke();
        circle(keypoint.x, keypoint.y, 20);
    }
}
