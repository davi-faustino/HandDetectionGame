const startHandVideo = {
    _model: null,
    _ctx: null,
    _video: null,
    _fingerLookupIndices: {
      thumb: [0, 1, 2, 3, 4],
      indexFinger: [0, 5, 6, 7, 8],
      middleFinger: [0, 9, 10, 11, 12],
      ringFinger: [0, 13, 14, 15, 16],
      pinky: [0, 17, 18, 19, 20]
    },
    
    drawPoint: function(y, x, r) {
      this._ctx.beginPath();
      this._ctx.arc(x, y, r, 0, 2 * Math.PI);
      this._ctx.fill();
    },
    
    drawPath: function(points) {
      const region = new Path2D();
      region.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) {
        const point = points[i];
        region.lineTo(point[0], point[1]);
      }
      this._ctx.stroke(region);
    },
    
    drawKeypoints: function(keypoints) {
      const keypointsArray = keypoints;
      for (let i = 0; i < keypointsArray.length; i++) {
        const y = keypointsArray[i][0];
        const x = keypointsArray[i][1];

        if(i === 0 && actualGameState === gameState.playing){
          handCenterPosition = {'x': y, 'y':x};
        }

        if(i === 8){
          indexFingerPosition = {'x': y, 'y':x};
        }
    
        this.drawPoint(x - 2, y - 2, 3);
      }
    
      const fingers = Object.keys(this._fingerLookupIndices);
      for (let i = 0; i < fingers.length; i++) {
        const finger = fingers[i];
        const points = this._fingerLookupIndices[finger].map(idx => keypoints[idx]);
        this.drawPath(points);
      }
    },
    
    setupCamera: async function() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          'Browser API navigator.mediaDevices.getUserMedia not available');
      }
    
      const video = document.getElementById('video');
      const stream = await navigator.mediaDevices.getUserMedia({
        'video': {
          facingMode: 'user',
        },
      });
      video.srcObject = stream;
    
      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          resolve(video);
        };
      });
    },
    
    main: async function() {
      this._model = await handpose.load();
      this._video = await this.setupCamera();
      this.configCanvas();
    },
    
    configCanvas: function(){
      const {videoWidth, videoHeight} = this._video
      const canvas = document.getElementById('output');
      
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      this._ctx = canvas.getContext('2d');
      this._ctx.translate(videoWidth,0);
      this._ctx.scale(-1, 1);
      this._ctx.strokeStyle = "red";
      this._ctx.fillStyle = "red";

      const landmarksRealTime = () => {
        const {_ctx, _video, _model} = this;
        _ctx.drawImage(_video, 0, 0, _video.videoWidth, _video.videoHeight);
        _model.estimateHands(_video).then(res => {
          if (res.length > 0) {
            this.drawKeypoints(res[0].landmarks);
          }
        });

        requestAnimationFrame(landmarksRealTime);

      }
      
      
      landmarksRealTime();
    }
  }

navigator.getUserMedia = navigator.getUserMedia ||
  navigator.webkitGetUserMedia || navigator.mozGetUserMedia;