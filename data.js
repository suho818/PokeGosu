const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

//const uri = 'mongodb://localhost:27017'; // MongoDB URI
const uri = 'mongodb+srv://20kikiki03:MoHf8gzQnd2n200u@playdata.wpdxmpx.mongodb.net/?retryWrites=true&w=majority&appName=PlayData'
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Error connecting to MongoDB Atlas:', err));

// 데이터 모델
const DataSchema = new mongoose.Schema({
    date: { type: String, required: true }, // 점수 입력 시간
    nickname: { type: String, required: true }, // 사용자 닉네임
    ssid: { type: String, required: true }, // 고유 식별 아이디
    time: { type: Number, required: true }, // 생존시간
    avoid_num: { type: Number, required: true }, // 피한 몬스터볼 수
    distance: { type: Number, required: true} // 이동 거리
});

const PlayData = mongoose.model('playdata', DataSchema);

// 점수 추가 함수
async function addScore(ssid, nickname, time, avoid_num, distance) {
    const newData = new PlayData({
        date: new Date().toISOString(),
        nickname: nickname,
        ssid: ssid,
        time: time,
        avoid_num: avoid_num,
        distance: distance,
    });
    await newData.save();
    console.log(`Score added for ${nickname}: ${score}`);
}

// 상위 랭킹 조회 함수
async function getTopScores() {
    const topScores = await PlayData.find()
        .sort({ score: -1 }) // 점수를 기준으로 내림차순 정렬
        .exec();
    console.log('Top scores:', topScores);
    return topScores;
}

module.exports = { PlayData, addScore, getTopScores };