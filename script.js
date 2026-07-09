const preview = document.getElementById("preview");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

let stream;
let recorder;
let chunks = [];

startBtn.onclick = async () => {

    chunks = [];

    stream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: {
                ideal: "environment"
            }
        },
        audio: true
    });
    preview.srcObject = stream;

    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = e=>{
        if(e.data.size>0){
            chunks.push(e.data);
        }
    };

    recorder.onstop = ()=>{

        const blob = new Blob(chunks,{
            type:recorder.mimeType
        });

        const url = URL.createObjectURL(blob);

        const a=document.createElement("a");
        a.href=url;

        // 拡張子は環境によって変わる
        if(recorder.mimeType.includes("mp4")){
            a.download="text";//movie.mp4
        }else{
            a.download="movie.webm";
        }

        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(url);

        stream.getTracks().forEach(track=>track.stop());

        preview.srcObject=null;

        startBtn.disabled=false;
        stopBtn.disabled=true;
    };

    recorder.start();

    startBtn.disabled=true;
    stopBtn.disabled=false;

};

stopBtn.onclick=()=>{

    recorder.stop();

};
