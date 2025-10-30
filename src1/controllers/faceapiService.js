const path = require("path");

const tf = require("@tensorflow/tfjs-node");

const faceapi = require("@vladmandic/face-api/dist/face-api.node.js");
const modelPathRoot = "./models";
const config = require("../configs/database");
const mysql = require("mysql");
const pool = mysql.createPool(config);




let optionsSSDMobileNet;
var sqlRegistration = "";
var faceDescriptor = "";
var description = []

async function image(file) {
  const decoded = tf.node.decodeImage(file);
  const casted = decoded.toFloat();
  const result = casted.expandDims(0);
  decoded.dispose();
  casted.dispose();
  return result;
}



async function detectRegistration(tensor) {
  const result = await faceapi.detectAllFaces(tensor, optionsSSDMobileNet);
  if (result.length == 1) {
    const detections = await faceapi.detectSingleFace(tensor).withFaceLandmarks().withFaceDescriptor()
    faceDescriptor = JSON.stringify(detections.descriptor);
    detections.descriptor.map(d => {
      description.push(d);
    })
  }

  return result;
}

async function faceRegistration(file) {


  await faceapi.tf.setBackend("tensorflow");
  await faceapi.tf.enableProdMode();
  await faceapi.tf.ENV.set("DEBUG", false);
  await faceapi.tf.ready();

  const modelPath = path.join(__dirname, modelPathRoot);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath),
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath)

  optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({
    minConfidence: 0.5,
  });


  const tensor = await image(file);
  description = [];
  const result = await detectRegistration(tensor);
  if (result.length == 1) {
    return {
      message: "berhasilproses",
      data_image: JSON.stringify(description)
    };
  } else {
    tensor.dispose();
    return {
      message: "tidakvalid"
    };
  }
}

async function faceRecog(file, em_id, file_local) {
  await faceapi.tf.setBackend("tensorflow");
  await faceapi.tf.enableProdMode();
  await faceapi.tf.ENV.set("DEBUG", false);
  await faceapi.tf.ready();

  const modelPath = path.join(__dirname, modelPathRoot);
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath),
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath),
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath)

  optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({
    minConfidence: 0.5,
  });

  const tensor = await image(file);
  const img = await image(file_local);

  const resultt = await faceapi.detectAllFaces(tensor).withFaceLandmarks().withFaceDescriptors();
  const imgResult = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();


  // const data_wajah_input = resultt[0]['descriptor'];
  if (resultt.length == 1) {
    const detections = await faceapi.detectSingleFace(tensor).withFaceLandmarks().withFaceDescriptor()

    let proses1 = new Promise(function (myResolve, myReject) {
      pool.getConnection(function (err, connection) {
        connection.query(
          `SELECT * FROM employee WHERE em_id='${em_id}'`,
          function (err, result) {
            if (err) {
              console.log("error" + err)
            } else {

              const labeledDescriptors = [
                new faceapi.LabeledFaceDescriptors(result[0]['em_id'], [imgResult.descriptor])
              ];

              const displaySize = { width: 600, height: 600 }

              const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.4)

              const resizedDetections = faceapi.resizeResults(resultt, displaySize)

              const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));
              console.log(`hasil 2 ${results}`);
              myResolve(results[0].label);

            }
          }
        );
        connection.release();
      });
    });
    return proses1;
  } else {
    return "tidakvalid"
  }

}
module.exports = {
  registration: faceRegistration,
  detection: faceRecog

};