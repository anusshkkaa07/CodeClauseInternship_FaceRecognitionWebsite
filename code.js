button1= document.getElementById("mood_lens_button")
button2= document.getElementById("face_tag_button")

button1text= document.getElementById("mood_tag")
button2text= document.getElementById("face_tag")

document.getElementById('mood_lens_button').addEventListener('mouseover', function(){
    document.getElementById("mood_tag").style.display= 'block';
})

document.getElementById('mood_lens_button').addEventListener('mouseout', function(){
    document.getElementById("mood_tag").style.display= 'none';
})

document.getElementById('face_tag_button').addEventListener('mouseover', function(){
    document.getElementById("face_tag").style.display= 'block';
})

document.getElementById('face_tag_button').addEventListener('mouseout', function(){
    document.getElementById("face_tag").style.display= 'none';
})



//MOOD LENS MODULE

function moodLens(){
    document.getElementById('moodLens').style.display='block';

    const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.getElementById('moodLens').append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})
    
}


//CREW RECOGNISER MODULE

function crewRecogniser(){

  document.getElementById('faceTag').style.display='block';

  //machine learning models
Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
])

.then(start)

function start(){
  document.body.append('Loaded')

  
  inputImage.addEventListener('change',async ()=>{
      const image=await faceapi.bufferToImage(inputImage.files[0])
      document.getElementById('faceTag').append(image)
      image.style.width= '30vw';
      image.style.height= '70vh';
      image.style.position= 'relative';
      image.style.left='-10vw';
      
      

      const canvas = faceapi.createCanvasFromMedia(image)
      document.getElementById('faceTag').append(canvas)

      const displaySize= {width: image.width, height:image.height}
      faceapi.matchDimensions(canvas, displaySize)
      const detections = await faceapi.detectAllFaces(image)
      .withFaceLandmarks()
      .withFaceDescriptors()

      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      resizedDetections.forEach(detection=>{
          const box= detection.detection.box
          const drawBox= new faceapi.draw.DrawBox(box, {label: 'Face'})
          drawBox.draw(canvas)
      })
  })
  
}


}